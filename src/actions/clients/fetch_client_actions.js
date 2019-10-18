import { apiHttpGET, tokenConfig } from "../../utility/request_helper";
import {
  CLIENTS_URL,
} from "../../constants/endpoints";
import {
  FETCH_CLIENT_FAILURE,
  FETCH_CLIENT_REQUEST,
  FETCH_CLIENT_SUCCESS
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator to initiate fetching of all the subscription plan
 */
export function fetchClientRequest() {
  return actionCreator(FETCH_CLIENT_REQUEST);
}

/**
 * Action creator for failure to fetch all subscription plan
 * @param {string} error A description of the error that occurred
 */
export function fetchClientFailure(error) {
  return actionCreator(FETCH_CLIENT_FAILURE, error);
}

/**
 * Action creator for successfully fetching subscription plan
 * @param {object} data an array of all the subscription plan
 */
export function fetchClientSuccess(data) {
  return actionCreator(FETCH_CLIENT_SUCCESS, data);
}

/**
 * Requests for all the pickup data from the api system and dispatches a `FETCH_CLIENT_REQUEST`
 * if it was successful otherwise, a `FETCH_CLIENT_SUCCESS` is dispatched
 * @param {string} token the user token
 */
export function fetchClient(token) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpGET(CLIENTS_URL, tokenConfig(token))
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(fetchClientSuccess(response.data));
        } else {
          dispatch(
            fetchClientFailure(
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
          dispatch(fetchClientFailure(errMsg));
        }
        console.log("This error occurred: ", err);
      });
  }
  return dispatch => {
    dispatch(fetchClientRequest());
    return apiRequest(dispatch, true);
  };
}
