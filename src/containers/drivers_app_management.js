import React from "react";
import DriversAppView from "../components/pages/drivers_app/index";
import * as fetchCountryActions from "../actions/country/fetch_country_actions";
import * as fetchTownActions from "../actions/town/fetch_town_actions";
import * as fetchActions from "../actions/drivers_app/fetch_drivers_app_actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Edit, Trash2, PlusSquare, Loader } from "react-feather";
import { convertSvgToPngData } from "../utility/misc";

function mapStateToProps(state) {
  return {
    token: state.auth.userToken,
    userId: state.auth.userId,
    countries: state.countries.appCountries,
    towns: state.towns.towns,

    driversApp: state.drivers_app.driversApp,

    isFetchingTowns: state.towns.isFetchingTowns,
    isLoadedTowns: state.towns.isLoadedTowns,

    isFetchingAppCountries: state.countries.isFetchingAppCountries,
    isLoadedAppCountries: state.countries.isLoadedAppCountries,

    isFetchingDriversApp: state.drivers_app.isFetchingDriversApp,
    isLoadedDriversApp: state.drivers_app.isLoadedDriversApp,

    fetchDriversAppError: state.drivers_app.fetchDriversAppError
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...fetchActions,
      ...fetchTownActions,
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

class DriversAppListView extends React.Component {
  state = {
    townId: null,
    countryId: null,
    driverAppIdEdit: null,
    driverAppDataEdit: null
  };

  componentDidMount() {
    this.refreshDriversTable(this.props.token);
  }

  refreshDriversTable = () => {
    if (!this.props.isLoadedAppCountries) {
      this.props.fetchAppCountries(this.props.token);
    }
    if (!this.props.isLoadedTowns) {
      this.props.fetchTowns(this.props.token);
    }
    this.props.fetchDrivers_App(this.props.token);
  };

  getTownForCountry = countryId => {
    let countries = [];
    this.props.countries.countryId;
  };

  render() {
    return (
      <DriversAppView
        data={this.props.drivers}
        towns={this.props.towns}
        countries={this.props.countries}
        isFetchingDriversApp={this.props.isFetchingDriversApp}
        isLoadedDriversApp={this.props.isLoadedDriversApp}
        fetchDriversAppError={this.fetchDriversAppError}
        refreshDriversTable={() =>
          this.props.fetchDrivers_App(this.props.token)
        }
        columns={[
          {
            Header: "Picture",
            accessor: "picture",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedDriver &&
                  this.props.deletingDriverId == props.original.id
                }
              >
                <img src={props.value} width="50%" height="50%" alt=" " />
              </CellItem>
            )
          },
          {
            Header: "First Name",
            accessor: "firstname",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedDriver &&
                  this.props.deletingDriverId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Last Name",
            accessor: "lastname",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedDriver &&
                  this.props.deletingDriverId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Telephone",
            accessor: "phone",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedDriver &&
                  this.props.deletingDriverId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Email",
            accessor: "email",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedDriver &&
                  this.props.deletingDriverId == props.original.id
                }
                item={props.value}
              />
            )
          },

          {
            Header: "ID Number",
            accessor: "idCardNumber",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedDriver &&
                  this.props.deletingDriverId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "License",
            accessor: "driverLicense",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedDriver &&
                  this.props.deletingDriverId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Actions",
            Cell: props => (
              <span>
                <PlusSquare
                  size={18}
                  className="mr-2 hand-cursor"
                  color="#00897B"
                  onClick={() => this.assignTaxi(props.original.id)}
                />
                <Edit
                  size={18}
                  className="mr-2 hand-cursor"
                  color="#1565C0"
                  onClick={() => this.setEditDriver(props.original)}
                />
                {(this.props.isDeletingDriver || this.props.isDeletedDriver) &&
                this.props.deletingDriverId == props.original.id ? (
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
                    onClick={() => this.deleteDriver(props.original.id)}
                  />
                )}
              </span>
            ),
            width: 90,
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
)(DriversAppListView);
