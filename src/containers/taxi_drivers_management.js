import React from "react";
import TaxiDriverView from "../components/pages/taxi_drivers/index";
import * as fetchtaxiActions from "../actions/taxi/fetch_taxi_actions";
import * as fetchActions from "../actions/taxi_drivers/fetch_assign_taxi_driver";
import * as assignActions from "../actions/taxi_drivers/assign_taxi_driver";
import * as updateActions from "../actions/taxi_drivers/update_assign_taxi_driver";
import * as deleteActions from "../actions/taxi_drivers/delete_assign_taxi_driver";
import * as fetchDriverActions from "../actions/drivers/fetch_driver_actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Edit, Trash2, Trash, PlusSquare, Loader } from "react-feather";
import { EDIT_TAXI_DRIVER } from "../constants/app_utils";
import { isNumber } from "util";

function mapStateToProps(state) {
  return {
    token: state.auth.userToken,
    userId: state.auth.userId,
    drivers: state.drivers.drivers,
    taxis: state.taxis.taxis,

    taxi_drivers: state.taxi_drivers.taxi_drivers,

    isFetchingTaxi: state.taxis.isFetchingTaxi,
    isLoadedTaxi: state.taxis.isLoadedTaxi,

    isFetchingDrivers: state.drivers.isFetchingDrivers,
    isLoadedDrivers: state.drivers.isLoadedDrivers,

    isAssigningingTaxiDrivers: state.taxi_drivers.isAssigningingTaxiDrivers,
    isAssignedTaxiDrivers: state.taxi_drivers.isAssignedTaxiDrivers,

    isFetchingTaxiDrivers: state.taxi_drivers.isFetchingTaxiDrivers,
    isLoadedTaxiDrivers: state.taxi_drivers.isLoadedTaxiDrivers,

    isUpdatingTaxiDrivers: state.taxi_drivers.isUpdatingTaxiDrivers,
    isUpdatedTaxiDrivers: state.taxi_drivers.isUpdatedTaxiDrivers,

    isDeletingTaxiDrivers: state.taxi_drivers.isDeletingTaxiDrivers,
    isDeletedTaxiDrivers: state.taxi_drivers.isDeletedTaxiDrivers,

    isDeletingTaxiDriversId: state.taxi_drivers.isDeletingTaxiDriversId,
    assigneTaxidriversError: state.taxi_drivers.assigneTaxidriversError,
    deleteTaxiDriversError: state.taxi_drivers.deleteTaxiDriversError,
    updateTaxiDriversError: state.taxi_drivers.updateTaxiDriversError,
    fetchTaxiDriversError: state.taxi_drivers.fetchTaxiDriversError
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...fetchActions,
      ...assignActions,
      ...updateActions,
      ...fetchActions,
      ...deleteActions,
      ...fetchtaxiActions,
      ...fetchDriverActions
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
class TaxiDriverListView extends React.Component {
  state = {
    driverId: null,
    taxiDriverIdEdit: null,
    taxiDriverDataEdit: null
  };

  componentDidMount() {
    this.refreshTaxiDriversTable();
  }

  setEditTaxiDriver = taxiDriverData => {
    let driverId = taxiDriverData.driver_id;
    this.setState(
      {
        taxiDriverDataEdit: { ...taxiDriverData, driverId }
      },
      () => {
        this.props.history.push(EDIT_TAXI_DRIVER);
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 25);
      }
    );
  };

  deleteTaxiDiver = taxiDriverId => {
    this.props.deleteTaxiDiver(this.props.token, taxiDriverId);
  };

  handleSubmitTaxiDriverData = (taxiDriverData, taxiDriverId, callback) => {
    if (taxiDriverId) {
      this.props.updateTaxiDriver(
        this.props.token,
        { ...taxiDriverData, manager_id: this.props.userId },
        taxiDriverId,
        callback
      );
    } else {
      this.props.assignTaxiDriver(
        this.props.token,
        { ...taxiDriverData, manager_id: this.props.userId },
        callback
      );
    }
  };

  refreshTaxiDriversTable = () => {
    this.props.fetchTaxiDrivers(this.props.token);
  };

  render() {
    return (
      <TaxiDriverView
        data={this.props.taxi_drivers}
        drivers={this.props.drivers}
        taxis={this.props.taxis}
        editData={this.state.taxiDriverDataEdit}
        isFetchingTaxiDrivers={this.props.isFetchingTaxiDrivers}
        fetchTaxiDriversError={this.props.fetchTaxiDriversError}
        isAssigningingTaxiDrivers={this.props.isAssigningingTaxiDrivers}
        isUpdatingTaxiDrivers={this.props.isUpdatingTaxiDrivers}
        isDeletingTaxiDrivers={this.props.isDeletingTaxiDrivers}
        isDeletingTaxiDriversId={this.props.isDeletingTaxiDriversId}
        assigneTaxidriversError={this.props.assigneTaxidriversError}
        updateTaxiDriversError={this.props.updateTaxiDriversError}
        submitTaxiDriversData={this.handleSubmitTaxiDriverData}
        refreshTaxiDriversTable={() =>
          this.props.fetchTaxiDrivers(this.props.token)
        }
        columns={[
          {
            Header: "Owner",
            accessor: "owner",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTaxiDrivers &&
                  this.props.isDeletingTaxiDrivers == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Taxi",
            accessor: "taxi_id",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTaxiDrivers &&
                  this.props.isDeletingTaxiDrivers == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Driver",
            accessor: "driver_id",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedTaxiDrivers &&
                  this.props.isDeletingTaxiDrivers == props.original.id
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
                  onClick={() => this.setAddDriver(props.original.id)}
                />
                <Edit
                  size={18}
                  className="mr-2 hand-cursor"
                  color="#1565C0"
                  onClick={() => this.setEditTaxiDriver(props.original)}
                />
                {(this.props.isDeletingTaxiDrivers ||
                  this.props.isDeletedTaxiDrivers) &&
                this.props.isDeletingTaxiDriversId == props.original.id ? (
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
                    onClick={() => this.deleteTaxiDiver(props.original.id)}
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
)(TaxiDriverListView);
