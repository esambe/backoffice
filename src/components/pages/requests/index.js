import React, { Fragment } from "react";
import "react-table/react-table.css";
import RequestList from "./requests";
import { Route } from "react-router-dom";
import {
  ADD_SUBSCRIPTION_PLAN,
  EDIT_SUBSCRIPTION_PLAN
} from "../../../constants/app_utils";

export default class ClientView extends React.Component {

//   handleSubmitSubcriptionPlanData = (
//     subscriptionplanData,
//     subscriptionplaId,
//     callback
//   ) => {
//     this.props.submitSubscriptionPlan(
//       subscriptionplanData,
//       subscriptionplaId,
//       callback
//     );
//   };
  render() {
    return (
      <Fragment>
        <div>
          {/* <Route
            path={ADD_SUBSCRIPTION_PLAN}
            render={matchprops => (
              <SubscriptionPlanManage
                {...this.props}
                {...matchprops}
                editData={null}
                submitPickupAreaData={this.handleSubmitSubcriptionPlanData}
              />
            )}
          />
          <Route
            exact
            path={EDIT_SUBSCRIPTION_PLAN}
            render={matchprops => (
              <SubscriptionPlanManage
                {...this.props}
                {...matchprops}
                editData={this.props.editData}
                submitSubscriptionPlan={this.handleSubmitSubcriptionPlanData}
              />
            )}
          /> */}
          <RequestList {...this.props} />
        </div>
      </Fragment>
    );
  }
}
