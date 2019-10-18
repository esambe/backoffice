import { tokenConfig, apiHttpPOST } from "../../utility/request_helper";
import { USERS_URL, SUBSCRIPTION_PLANS_URL } from "../../constants/endpoints";
import {
  FETCH_SUBSCRIPTION_PLAN_FAILURE,
  FETCH_SUBSCRIPTION_PLAN_REQUEST,
  FETCH_SUBSCRIPTION_PLAN_SUCCESS
} from "../../constants/action_types";
import { fetchSubscriptionPlan } from "./fetech_subscription_plans_actions";
import { actionCreator, reAuthenticateUser } from "../action_helpers";

// Initiate process of adding subscription plan
export function addSubscriptrionPlanRequest() {
  return actionCreator(FETCH_SUBSCRIPTION_PLAN_REQUEST);
}

/**
 * Action creator for successfully adding a new subscription
 * @param {object} data
 */
export function addSubscriptrionPlanSuccess(data) {
  return actionCreator(FETCH_SUBSCRIPTION_PLAN_SUCCESS, data);
}

// Adding subscription plan process failed
/**
 * Action creator for failure to add a new subscription plans
 * @param {string} error The error message describing the failure
 */
export function addSubscriptrionPlanFailure(error) {
  return actionCreator(FETCH_SUBSCRIPTION_PLAN_FAILURE, error);
}

/**
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */
export function addSubscriptrionPlan(
  token,
  subscriptionPlanData,
  callback = () => {}
) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpPOST(
      SUBSCRIPTION_PLANS_URL,
      tokenConfig(token),
      subscriptionPlanData
    )
      .then(Response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(addSubscriptrionPlanSuccess(response.data));
          dispatch(fetchSubscriptionPlan(token)); //we fetch all the users again so as to get all the update
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(addSubscriptrionPlanFailure(errMsg));
          callback(false);
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
          dispatch(addSubscriptrionPlanFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(addSubscriptrionPlanRequest());
    return apiRequest(dispatch, true);
  };
}
