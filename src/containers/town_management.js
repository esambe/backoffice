import React from "react";
import TownView from "../components/pages/towns";
import * as fetchCountryActions from "../actions/country/fetch_country_actions";
import * as fetchActions from "../actions/town/fetch_town_actions";
import * as addActions from "../actions/town/add_town_actions";
import * as updateActions from "../actions/town/update_town_actions";
import * as deleteActions from "../actions/town/delete_town_actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Edit, Trash2, Trash, PlusSquare, Loader } from "react-feather";
import { EDIT_TOWN_ROUTE, ADD_PICKUP_AREA_ROUTE } from "../constants/app_utils";
import { isNumber } from "util";

function mapStateToProps(state) {
  return {
    token: state.auth.userToken,
    userId: state.auth.userId,
    countries: state.countries.appCountries,

    towns: state.towns.towns,

    isFetchingAppCountries: state.countries.isFetchingAppCountries,
    isLoadedAppCountries: state.countries.isLoadedAppCountries,

    isFetchingTowns: state.towns.isFetchingTowns,
    isLoadedTowns: state.towns.isLoadedTowns,

    isAddingTown: state.towns.isAddingTown,
    isAddedTown: state.towns.isAddedTown,

    isUpdatingTown: state.towns.isUpdatingTown,
    isUpdatedTown: state.towns.isUpdatedTown,

    isDeletingTown: state.towns.isDeletingTown,
    isDeletedTown: state.towns.isDeletedTown,
    deletingTownId: state.towns.deletingTownId,

    fetchTownsError: state.towns.fetchTownsError,
    loadTownsError: state.towns.loadTownError,
    addTownsError: state.towns.addTownError
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...fetchActions,
      ...addActions,
      ...updateActions,
      ...deleteActions,
      ...fetchCountryActions
    },
    dispatch
  );
}

function CellItem(props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: props.deleted ? "#ef9a9a" : ""
      }}
    >
      {props.item || typeof props.item === "number"
        ? props.item
        : props.children}
    </div>
  );
}

class TownListView extends React.Component {
  state = {
    countryId: null,
    townIdEdit: null,
    townDataEdit: null
  };

  componentDidMount() {
    this.refreshTownsTable();
  }

  setEditTown = townData => {
    let countryId = townData.country_id;
    let countryName = this.props.countries.reduce((acc, elt) => {
      if (elt.id == countryId) {
        return elt.name.en + " || " + elt.name.fr;
      }
      return acc;
    }, "");
    this.setState(
      {
        townDataEdit: { ...townData, countryId, countryName }
      },
      () => {
        this.props.history.push(EDIT_TOWN_ROUTE);
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 25);
      }
    );
  };

  deleteTown = townId => {
    this.props.deleteTown(this.props.token, townId);
  };

  handleSubmitTownData = (townData, townId, callback) => {
    if (townId) {
      this.props.updateTown(
        this.props.token,
        { ...townData, manager_id: this.props.userId },
        townId,
        callback
      );
    } else {
      this.props.addTown(
        this.props.token,
        { ...townData, manager_id: this.props.userId },
        callback
      );
    }
  };
  setAddPickupArea = townId => {
    this.props.history.push(`${ADD_PICKUP_AREA_ROUTE}/${townId}`);
  };
  refreshTownsTable = () => {
    if (!this.props.isLoadedAppCountries) {
      this.props.fetchAppCountries(this.props.token);
    }
    this.props.fetchTowns(this.props.token);
  };

  render() {
    return (
      <TownView
        data={this.props.towns}
        countries={this.props.countries}
        editData={this.state.townDataEdit}
        isFetchingTowns={this.props.isFetchingTowns}
        fetchTownsError={this.props.fetchTownsError}
        isAddingTown={this.props.isAddingTown}
        isUpdatingTown={this.props.isUpdatingTown}
        isDeletingTown={this.props.isDeletingTown}
        deletingTownId={this.props.deletingTownId}
        addTownError={this.props.addTownError}
        submitTownData={this.handleSubmitTownData}
        refreshTownsTable={() => this.props.fetchTowns(this.props.token)}
        columns={[
          {
            Header: "Name (En)",
            accessor: "name.en",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTown &&
                  this.props.deletingTownId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Name (Fr)",
            accessor: "name.fr",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTown &&
                  this.props.deletingTownId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Longitude",
            accessor: "location.lng",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTown &&
                  this.props.deletingTownId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Latitude",
            accessor: "location.lat",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTown &&
                  this.props.deletingTownId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Description",
            accessor: "description",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTown &&
                  this.props.deletingTownId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "",
            Cell: props => (
              <span>
                <PlusSquare
                  size={18}
                  className="mr-2 hand-cursor"
                  color="#00897B"
                  onClick={() => this.setAddPickupArea(props.original.id)}
                />
                <Edit
                  size={18}
                  className="mr-2 hand-cursor"
                  color="#1565C0"
                  onClick={() => this.setEditTown(props.original)}
                />
                {(this.props.isDeletingTown || this.props.isDeletedTown) &&
                this.props.deletingTownId == props.original.id ? (
                  <Loader
                    size={18}
                    className="hand-cursor animate-spin"
                    color="#FF586B"
                  />
                ) : (
                  <Trash2
                    size={18}
                    className="hand-cursor"
                    color="#FF586B"
                    onClick={() => this.deleteTown(props.original.id)}
                  />
                )}
              </span>
            ),
            width: 100,
            filterable: false,
            sortable: false
          }
        ]}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TownListView);
