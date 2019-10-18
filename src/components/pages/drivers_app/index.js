import React, { Fragment } from "react";
import "react-table/react-table.css";
import DriversAppList from "./drivers_app";
import { Route } from "react-router-dom";

export default class DriversAppManagementView extends React.Component {
  render() {
    return (
      <Fragment>
        <div>
          <DriversAppList {...this.props} />
        </div>
      </Fragment>
    );
  }
}
