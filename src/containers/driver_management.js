import React from "react";
import DriverView from "../components/pages/drivers/index";
import * as fetchCountryActions from "../actions/country/fetch_country_actions";
import * as fetchCountryTownsActions from "../actions/country/fetch_country_towns";
import * as fetchTownActions from "../actions/town/fetch_town_actions";
import * as fetchActions from "../actions/drivers/fetch_driver_actions";
import * as addActions from "../actions/drivers/create_driver_actions";
import * as updateActions from "../actions/drivers/update_driver_actions";
import * as deleteActions from "../actions/drivers/delete_driver_actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Edit, Trash2, PlusSquare, Loader } from "react-feather";
import { EDIT_DRIVER_ROUTE, ASSIGN_TAXI_DRIVER } from "../constants/app_utils";
import { convertSvgToPngData } from "../utility/misc";

function mapStateToProps(state) {
  return {
    token: state.auth.userToken,
    userId: state.auth.userId,
    countries: state.countries.appCountries,
    towns: state.towns.towns,

    drivers: state.drivers.drivers,

    isFetchingTowns: state.towns.isFetchingTowns,
    isLoadedTowns: state.towns.isLoadedTowns,

    isFetchingAppCountries: state.countries.isFetchingAppCountries,
    isLoadedAppCountries: state.countries.isLoadedAppCountries,

    isFetchingDrivers: state.drivers.isFetchingDrivers,
    isLoadedDrivers: state.drivers.isLoadedDrivers,

    isAddingDriver: state.drivers.isAddingDriver,
    isAddedDriver: state.drivers.isAddedDriver,

    isUpdatingDriver: state.drivers.isUpdatingDriver,
    isUpdatedDriver: state.drivers.isUpdatedDriver,

    isDeletingDriver: state.drivers.isDeletingDriver,
    isDeletedDriver: state.drivers.isDeletedDriver,
    deletingDriverId: state.drivers.deletingDriverId,

    addDriverError: state.drivers.addDriverError,
    fetchDriversError: state.drivers.fetchDriversError,
    updateDriverError: state.drivers.updateDriverError
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...fetchActions,
      ...addActions,
      ...updateActions,
      ...deleteActions,
      ...fetchTownActions,
      ...fetchCountryActions,
      ...fetchCountryTownsActions
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

class DriverListView extends React.Component {
  state = {
    townId: null,
    countryId: null,
    driverIdEdit: null,
    driverDataEdit: null
  };

  componentDidMount() {
    this.refreshDriversTable(this.props.token);
  }

  setEditDriver = driverData => {
    let countryId = driverData.country_id;
    let countryName = this.props.countries.reduce((acc, elt) => {
      if (elt.id == countryId) {
        return elt.name.en + " || " + elt.name.fr;
      }
      return acc;
    }, "");
    this.setState(
      { driverDataEdit: { ...driverData, countryId, countryName } },
      () => {
        this.props.history.push(EDIT_DRIVER_ROUTE);
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 25);
      }
    );
  };

  deleteDriver = driverId => {
    this.props.deleteDriverData(this.props.token, driverId);
  };

  handleSubmitDriverData = (driverData, driverId, callback) => {
    if (driverId) {
      this.props.updateDriver(
        this.props.token,
        { ...driverData, manager_id: this.props.userId },
        driverId,
        callback
      );
    } else {
      this.props.addDriver(
        this.props.token,
        { ...driverData, manager_id: this.props.userId },
        callback
      );
    }
  };
  assignTaxi = driverId => {
    this.props.history.push(`${ASSIGN_TAXI_DRIVER}/${driverId}`);
  };
  refreshDriversTable = () => {
    if (!this.props.isLoadedAppCountries) {
      this.props.fetchAppCountries(this.props.token);
    }
    if (!this.props.isLoadedTowns) {
      this.props.fetchTowns(this.props.token);
    }
    this.props.fetchDrivers(this.props.token);
  };

  getTownForCountry = countryId => {
    let towns = [];
    this.props.countries.countryId;
  };

  render() {
    return (
      <DriverView
        data={this.props.drivers}
        towns={this.props.towns}
        countries={this.props.countries}
        editData={this.state.driverDataEdit}
        isFetchingDrivers={this.props.isFetchingDrivers}
        isLoadedDrivers={this.props.isLoadedDrivers}
        isAddingDriver={this.props.isAddingDriver}
        isAddedDriver={this.props.isAddedDriver}
        fetchDriversError={this.fetchDriversError}
        isUpdatingDriver={this.props.isUpdatingDriver}
        isUpdatedDriver={this.props.isUpdatedDriver}
        createDriverError={this.props.createDriverError}
        updateDriverError={this.props.updateDriverError}
        submitDriverData={this.handleSubmitDriverData}
        refreshDriversTable={() => this.props.fetchDrivers(this.props.token)}
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
)(DriverListView);
