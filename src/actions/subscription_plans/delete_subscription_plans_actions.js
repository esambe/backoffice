import { tokenConfig, apiHttpDELETE } from "../../utility/request_helper";
import { formatUrl } from "../../utility/misc";
import { USER_URL, SUBSCRIPTION_PLAN_URL } from "../../constants/endpoints";
import {
  DELETE_SUBSCRIPTION_PLAN_SUCCESS,
  DELETE_SUBSCRIPTION_PLAN_REQUEST,
  DELETE_SUBSCRIPTION_PLAN_FAILURE
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { fetchSubscriptionPlan } from "./fetech_subscription_plans_actions";

/**
 * Action creator for subscription plan deletion
 */
export function deleteSubscriptionPlanRequest(subscriptionPlanId) {
  return actionCreator(DELETE_SUBSCRIPTION_PLAN_REQUEST, subscriptionPlanId);
}

/**
 * Action creator for failure to delete subscription plan
 * @param {string} error The error message describing the failure
 */
export function deleteSubscriptionPlanFailure(error) {
  return actionCreator(DELETE_SUBSCRIPTION_PLAN_FAILURE, error);
}

/**
 * Action creator for successfully deleting a subscription plan
 * @param {object} data
 */
export function deleteSubscriptionPlanSuccess(data) {
  return actionCreator(DELETE_SUBSCRIPTION_PLAN_SUCCESS, data);
}

/**
 * Action to delete town, given the token and the subscription plan id.
 * If it succeeds, the `DELETE_SUBSCRIPTION_PLAN_SUCCESS` action type is dispatched otherwise,
 * the `DELETE_SUBSCRIPTION_PLAN_FAILURE` action type is dispatched.
 *
 * @param {string} token The request token
 * @param {string} userId The user's id
 */
export function deleteSubscriptionPlan(
  token,
  subscriptionPlanId,
  callback = () => {}
) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpDELETE(
      formatUrl(SUBSCRIPTION_PLAN_URL, null, { id: subscriptionPlanId }),
      tokenConfig(token)
    )
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(deleteSubscriptionPlanSuccess(pickupId));
          dispatch(fetchSubscriptionPlan(token)); //we fetch all the pickups again so as to get all the update
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(deleteSubscriptionPlanFailure(errMsg));
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
          dispatch(deleteSubscriptionPlanFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(deleteSubscriptionPlanRequest(pickupId));
    return apiRequest(dispatch, true);
  };
}
