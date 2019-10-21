import { apiHttpGET, tokenConfig } from "../../utility/request_helper";
import {
  SUBCRIPTION_REQUESTS_URL
} from "../../constants/endpoints";
import {
  FETCH_SUBSCRIPTION_FAILURE,
  FETCH_SUBSCRIPTION_REQUEST,
  FETCH_SUBSCRIPTION_SUCCESS
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator to initiate fetching of all the subscription 
 */
export function fetchSubscriptionRequest() {
  return actionCreator(FETCH_SUBSCRIPTION_REQUEST);
}

/**
 * Action creator for failure to fetch all subscription 
 * @param {string} error A description of the error that occurred
 */
export function fetchSubscriptionFailure(error) {
  return actionCreator(FETCH_SUBSCRIPTION_FAILURE, error);
}

/**
 * Action creator for successfully fetching subscription 
 * @param {object} data an array of all the subscription 
 */
export function fetchSubscriptionSuccess(data) {
  return actionCreator(FETCH_SUBSCRIPTION_SUCCESS, data);
}

/**
 * Requests for all the pickup data from the api system and dispatches a `FETCH_SUBSCRIPTION_REQUEST`
 * if it was successful otherwise, a `FETCH_SUBSCRIPTION_SUCCESS` is dispatched
 * @param {string} token the user token
 */
export function fetchSubscription(token) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpGET(SUBCRIPTION_REQUESTS_URL, tokenConfig(token))
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(fetchSubscriptionSuccess(response.data));
        } else {
          dispatch(
            fetchSubscriptionFailure(
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
          dispatch(fetchSubscriptionFailure(errMsg));
        }
        console.log("This error occurred: ", err);
      });
  }
  return dispatch => {
    dispatch(fetchSubscriptionRequest());
    return apiRequest(dispatch, true);
  };
}
