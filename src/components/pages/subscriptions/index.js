import React, { Fragment } from "react";
import "react-table/react-table.css";
import SubscriptionList from "./subscriptions";
import { Route } from "react-router-dom";


export default class SubscriptionManagementView extends React.Component {
  // handleSubmitSubcriptionPlanData = (
  //   subscriptionData,
  //   subscriptionId,
  //   callback
  // ) => {
  //   this.props.submitSubscription(
  //     subscriptionData,
  //     subscriptionId,
  //     callback
  //   );
  // };
  render() {
    return (
      <Fragment>
        <div>
          <SubscriptionList {...this.props} />
        </div>
      </Fragment>
    );
  }
}
