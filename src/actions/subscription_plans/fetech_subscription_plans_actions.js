import { apiHttpGET, tokenConfig } from "../../utility/request_helper";
import {
  SUBSCRIPTION_PLANS_URL,
  SUBSCRIPTION_PLAN_URL
} from "../../constants/endpoints";
import {
  FETCH_SUBSCRIPTION_PLAN_FAILURE,
  FETCH_SUBSCRIPTION_PLAN_REQUEST,
  FETCH_SUBSCRIPTION_PLAN_SUCCESS
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator to initiate fetching of all the subscription plan
 */
export function fetchSubscriptionPlanRequest() {
  return actionCreator(FETCH_SUBSCRIPTION_PLAN_REQUEST);
}

/**
 * Action creator for failure to fetch all subscription plan
 * @param {string} error A description of the error that occurred
 */
export function fetchSubscriptionPlanFailure(error) {
  return actionCreator(FETCH_SUBSCRIPTION_PLAN_FAILURE, error);
}

/**
 * Action creator for successfully fetching subscription plan
 * @param {object} data an array of all the subscription plan
 */
export function fetchSubscriptionPlanSuccess(data) {
  return actionCreator(FETCH_SUBSCRIPTION_PLAN_SUCCESS, data);
}

/**
 * Requests for all the pickup data from the api system and dispatches a `FETCH_SUBSCRIPTION_PLAN_REQUEST`
 * if it was successful otherwise, a `FETCH_SUBSCRIPTION_PLAN_SUCCESS` is dispatched
 * @param {string} token the user token
 */
export function fetchSubscriptionPlan(token) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpGET(SUBSCRIPTION_PLANS_URL, tokenConfig(token))
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(fetchSubscriptionPlanSuccess(response.data));
        } else {
          dispatch(
            fetchSubscriptionPlanFailure(
              `Response failed with status code ${response.status}`
            )
          );
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
          dispatch(fetchSubscriptionPlanFailure(errMsg));
        }
        console.log("This error occurred: ", err);
      });
  }
  return dispatch => {
    dispatch(fetchSubscriptionPlanRequest());
    return apiRequest(dispatch, true);
  };
}
