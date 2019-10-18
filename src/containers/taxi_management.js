import React from "react";
import TaxiView from "../components/pages/taxis/index";
import * as fetchCountryActions from "../actions/country/fetch_country_actions";
import * as fetchActions from "../actions/taxi/fetch_taxi_actions";
import * as addActions from "../actions/taxi/add_taxi_actions";
import * as updateActions from "../actions/taxi/update_taxi_actions";
import * as deleteActions from "../actions/taxi/delete_taxi_actions";
import * as fetchTownActions from "../actions/town/fetch_town_actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Edit, Trash2, Trash, PlusSquare, Loader } from "react-feather";
import { EDIT_TAXI_ROUTE } from "../constants/app_utils";
import { isNumber } from "util";

function mapStateToProps(state) {
  return {
    token: state.auth.userToken,
    userId: state.auth.userId,
    countries: state.countries.appCountries,
    towns: state.towns.towns,

    taxis: state.taxis.taxis,

    isFetchingAppCountries: state.countries.isFetchingAppCountries,
    isLoadedAppCountries: state.countries.isLoadedAppCountries,

    isFetchingTowns: state.towns.isFetchingTowns,
    isLoadedTowns: state.towns.isLoadedTowns,

    isAddingTaxi: state.taxis.isAddingTaxi,
    isAddedTaxi: state.taxis.isAddedTaxi,

    isFetchingTaxi: state.taxis.isFetchingTaxi,
    isLoadedTaxi: state.taxis.isLoadedTaxi,

    isUpdatingTaxi: state.taxis.isUpdatingTaxi,
    isUpdatedTaxi: state.taxis.isUpdatedTaxi,

    isDeletingTaxi: state.taxis.isDeletingTaxi,
    isDeletedTaxi: state.taxis.isDeletedTaxi,

    isDeletingTaxiId: state.taxis.isDeletingTaxiId,
    addTaxiError: state.taxis.addTaxiError,
    deleteTaxiError: state.taxis.deleteTaxiError,
    updateTaxiError: state.taxis.updateTaxiError,
    fetchTaxiError: state.taxis.fetchTaxiError
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...fetchActions,
      ...addActions,
      ...updateActions,
      ...fetchActions,
      ...deleteActions,
      ...fetchCountryActions,
      ...fetchTownActions
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
class TaxiListView extends React.Component {
  state = {
    townId: null,
    taxiIdEdit: null,
    taxiDataEdit: null
  };

  componentDidMount() {
    this.refreshTaxisTable();
  }

  setEditTaxi = taxiData => {
    let townId = taxiData.town_id;
    let townName = this.props.towns.reduce((acc, elt) => {
      if (elt.id == townId) {
        return elt.name.en + " || " + elt.name.fr;
      }
      return acc;
    }, "");
    this.setState(
      {
        taxiDataEdit: { ...taxiData, townId, townName }
      },
      () => {
        this.props.history.push(EDIT_TAXI_ROUTE);
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 25);
      }
    );
  };

  deleteTaxi = taxiId => {
    this.props.deleteTaxi(this.props.token, taxiId);
  };

  handleSubmitTaxiData = (taxiData, taxiId, callback) => {
    if (taxiId) {
      this.props.updateTaxi(
        this.props.token,
        { ...taxiData, manager_id: this.props.userId },
        taxiId,
        callback
      );
    } else {
      this.props.addTaxi(
        this.props.token,
        { ...taxiData, manager_id: this.props.userId },
        callback
      );
    }
  };

  refreshTaxisTable = () => {
    if (!this.props.isLoadedTowns) {
      this.props.fetchTowns(this.props.token);
    }
    if (!this.props.isLoadedAppCountries) {
      this.props.fetchAppCountries(this.props.token);
    }
    this.props.fetchTaxis(this.props.token);
  };

  getTownFromID = townId => {
    let townName = null;
    this.props.towns.forEach(town => {
      if (town.id === townId) {
        townName = town.name.en;
      }
    });

    return townName;
  };
  getCountryFromID = countryId => {
    let countryName = null;
    this.props.countries.forEach(country => {
      if (country.id === countryId) {
        countryName = country.name.en;
      }
    });

    return countryName;
  };

  render() {
    return (
      <TaxiView
        data={this.props.taxis}
        towns={this.props.towns}
        countries={this.props.countries}
        editData={this.state.taxiDataEdit}
        isFetchingTaxi={this.props.isFetchingTaxi}
        fetchTaxiError={this.props.fetchTaxiError}
        isAddingTaxi={this.props.isAddingTaxi}
        isUpdatingTaxi={this.props.isUpdatingTaxi}
        isDeletingTaxi={this.props.isDeletingTaxi}
        isDeletingTaxiId={this.props.isDeletingTaxiId}
        addTaxiError={this.props.addTaxiError}
        updateTaxiError={this.props.updateTaxiError}
        submitTaxiData={this.handleSubmitTaxiData}
        refreshTaxisTable={() => this.props.fetchTaxis(this.props.token)}
        columns={[
          {
            Header: "Number",
            accessor: "registrationNumber",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTaxi &&
                  this.props.deletingTaxiId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Gray Card Number",
            accessor: "grayCard",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTaxi &&
                  this.props.deletingTaxiId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Taxi Brand",
            accessor: "carBrand",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTaxi &&
                  this.props.deletingTaxiId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Taxi Model",
            accessor: "model",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTaxi &&
                  this.props.deletingTaxiId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Status",
            accessor: "status",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTaxi &&
                  this.props.deletingTaxiId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "AC",
            accessor: "heated",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTaxi &&
                  this.props.deletingTaxiId == props.original.id
                }
                item={props.value ? "Yes" : "No"}
              />
            )
          },
          {
            Header: "Country",
            accessor: "country_id",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTaxi &&
                  this.props.deletingTaxiId == props.original.id
                }
                item={this.getCountryFromID(props.value)}
              />
            )
          },
          {
            Header: "Town",
            accessor: "town_id",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTaxi &&
                  this.props.deletingTaxiId == props.original.id
                }
                item={this.getTownFromID(props.value)}
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
                  onClick={() => this.setAddDriver(props.original.id)}
                />
                <Edit
                  size={18}
                  className="mr-2 hand-cursor"
                  color="#1565C0"
                  onClick={() => this.setEditTaxi(props.original)}
                />
                {(this.props.isDeletingTaxi || this.props.isDeletedTaxi) &&
                this.props.deletingTaxiId == props.original.id ? (
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
                    onClick={() => this.deleteTaxi(props.original.id)}
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
)(TaxiListView);
