import { apiHttpGET, tokenConfig } from "../../utility/request_helper";
import {
  CLIENT_REQUESTS_URL
} from "../../constants/endpoints";
import {
  FETCH_REQUEST_FAILURE,
  FETCH_REQUEST,
  FETCH_REQUEST_SUCCESS
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator to initiate fetching of all the subscription plan
 */
export function fetchRequestRequest() {
  return actionCreator(FETCH_REQUEST);
}

/**
 * Action creator for failure to fetch all subscription plan
 * @param {string} error A description of the error that occurred
 */
export function fetchRequestFailure(error) {
  return actionCreator(FETCH_REQUEST_FAILURE, error);
}

/**
 * Action creator for successfully fetching subscription plan
 * @param {object} data an array of all the subscription plan
 */
export function fetchRequestSuccess(data) {
  return actionCreator(FETCH_REQUEST_SUCCESS, data);
}

/**
 * Requests for all the pickup data from the api system and dispatches a `FETCH_REQUEST`
 * if it was successful otherwise, a `FETCH_REQUEST_SUCCESS` is dispatched
 * @param {string} token the user token
 */
export function fetchRequest(token) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpGET(CLIENT_REQUESTS_URL, tokenConfig(token))
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(fetchRequestSuccess(response.data));
        } else {
          dispatch(
            fetchRequestFailure(
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
          dispatch(fetchRequestFailure(errMsg));
        }
        console.log("This error occurred: ", err);
      });
  }
  return dispatch => {
    dispatch(fetchRequestRequest());
    return apiRequest(dispatch, true);
  };
}
