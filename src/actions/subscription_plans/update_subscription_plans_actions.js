import {
  tokenConfig,
  apiHttpPOST,
  apiHttpPATCH
} from "../../utility/request_helper";
import { USERS_URL, SUBSCRIPTION_PLAN_URL } from "../../constants/endpoints";
import {
  UPDATE_SUBSCRIPTION_PLAN_REQUEST,
  UPDATE_SUBSCRIPTION_PLAN_SUCCESS,
  UPDATE_SUBSCRIPTION_PLAN_FAILURE
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";
import { fetchSubscriptionPlan } from "./fetech_subscription_plans_actions";

/**
 * Action creator to initiate the process of updating a subscription plan
 */
export function updateSubscriptionPlanRequest() {
  return actionCreator(UPDATE_SUBSCRIPTION_PLAN_REQUEST);
}

/**
 * Action creator for failure to update a subscription
 * @param {string} error The error message describing the failure
 */
export function updateSubscriptionPlanFailure(error) {
  return actionCreator(UPDATE_SUBSCRIPTION_PLAN_FAILURE, error);
}

/**
 * Action creator for successfully updating a subscription plan
 * @param {object} data
 */
export function updateSubscriptionPlanSuccess(data) {
  return actionCreator(UPDATE_SUBSCRIPTION_PLAN_SUCCESS, data);
}

/**
 * Requests for the update of a subscription.
 * If it succeeds, the `UPDATE_SUBSCRIPTION_PLAN_SUCCESS` action type is dispatched otherwise,
 * the `UPDATE_SUBSCRIPTION_PLAN_FAILURE` action type is dispatched.
 *
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */
export function updateSubscriptionPlan(
  token,
  subscriptionData,
  subscriptionId,
  callback = () => {}
) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpPATCH(
      formatUrl(SUBSCRIPTION_PLAN_URL, null, { id: subscriptionId }),
      tokenConfig(token),
      pickupData
    )
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(updateSubscriptionPlanSuccess(response.data));
          dispatch(fetchSubscriptionPlan(token)); //we fetch all the users again so as to get all the update
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(updateSubscriptionPlanFailure(errMsg));
          callback(false, errMsg);
        }
      })
      .catch(err => {
        if (err && err.response && err.response.status == 401 && retry) {
          reAuthenticateUser(() => apiRequest(dispatch, false), dispatch);
        } else {
          const errMsg =
            err.response && err.response.data
              ? err.response.data.error.message
              : err.message;
          dispatch(updateSubscriptionPlanFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(updateSubscriptionPlanRequest());
    return apiRequest(dispatch, true);
  };
}
