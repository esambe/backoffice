import React, { Fragment } from "react";
import "react-table/react-table.css";
import DriverList from "./drivers";
import DriverManage from "./manage_drivers";
import { Route } from "react-router-dom";
import {
  ADD_DRIVER_ROUTE,
  EDIT_DRIVER_ROUTE
} from "../../../constants/app_utils";

export default class DriverManagementView extends React.Component {
  state = { showDriverEdit: false };
  handleToggleTaxiEdit = toggleState => {
    this.setState({
      showDriverEdit: toggleState
    });
  };
  handleSubmitDriverData = (driverData, driverId, callback) => {
    this.props.submitDriverData(driverData, driverId, callback);
  };
  render() {
    return (
      <Fragment>
        <div>
          <Route
            exact
            path={ADD_DRIVER_ROUTE}
            render={matchprops => (
              <DriverManage
                {...this.props}
                {...matchprops}
                editData={null}
                submitDriverData={this.handleSubmitDriverData}
              />
            )}
          />
          <Route
            exact
            path={EDIT_DRIVER_ROUTE}
            render={matchprops => (
              <DriverManage
                {...this.props}
                {...matchprops}
                editData={this.props.editData}
                submitDriverData={this.handleSubmitDriverData}
              />
            )}
          />
          <DriverList {...this.props} />
        </div>
      </Fragment>
    );
  }
}
