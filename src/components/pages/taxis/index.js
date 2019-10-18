import React, { Fragment } from "react";
import "react-table/react-table.css";
import TaxiList from "./taxi";
import TaxiManage from "./manage_taxi";
import { Route } from "react-router-dom";
import { ADD_TAXI_ROUTE, EDIT_TAXI_ROUTE } from "../../../constants/app_utils";

export default class TaxiManagementView extends React.Component {
  state = { showTaxiEdit: false };
  handleToggleTaxiEdit = toggleState => {
    this.setState({
      showTaxiEdit: toggleState
    });
  };
  handleSubmitTaxiData = (taxiData, taxiId, callback) => {
    this.props.submitTaxiData(taxiData, taxiId, callback);
  };
  render() {
    return (
      <Fragment>
        <div>
          <Route
            path={ADD_TAXI_ROUTE}
            render={matchprops => (
              <TaxiManage
                {...this.props}
                {...matchprops}
                editData={null}
                submitTaxiData={this.handleSubmitTaxiData}
              />
            )}
          />
          <Route
            exact
            path={EDIT_TAXI_ROUTE}
            render={matchprops => (
              <TaxiManage
                {...this.props}
                {...matchprops}
                editData={this.props.editData}
                submitTaxiData={this.handleSubmitTaxiData}
              />
            )}
          />
          <TaxiList {...this.props} />
        </div>
      </Fragment>
    );
  }
}
