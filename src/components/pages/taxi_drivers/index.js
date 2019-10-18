import React, { Fragment } from "react";
import "react-table/react-table.css";
import TaxiDriverList from "./assign_taxi";
import TaxiDriverManage from "./manage_taxi_drivers";
import { Route } from "react-router-dom";
import {
  ASSIGN_TAXI_DRIVER,
  EDIT_TAXI_DRIVER
} from "../../../constants/app_utils";

export default class TaxiDriverManagementView extends React.Component {
  state = { showTaxiDriverEdit: false };
  handleToggleTaxiDriverEdit = toggleState => {
    this.setState({
      showTaxiDriverEdit: toggleState
    });
  };
  handleSubmitTaxiDriverData = (taxiDriverData, taxi_driverId, callback) => {
    this.props.submitTaxiDriverData(taxiDriverData, taxi_driverId, callback);
  };
  render() {
    return (
      <Fragment>
        <div>
          <Route
            path={ASSIGN_TAXI_DRIVER}
            render={matchprops => (
              <TaxiDriverManage
                {...this.props}
                {...matchprops}
                editData={null}
                submitTaxiDriverData={this.handleSubmitTaxiDriverData}
              />
            )}
          />
          <Route
            exact
            path={EDIT_TAXI_DRIVER}
            render={matchprops => (
              <TaxiDriverManage
                {...this.props}
                {...matchprops}
                editData={this.props.editData}
                submitTaxiDriverData={this.handleSubmitTaxiDriverData}
              />
            )}
          />
          <TaxiDriverList {...this.props} />
        </div>
      </Fragment>
    );
  }
}
