import { apiHttpGET, tokenConfig } from "../../utility/request_helper";
import { TAXIS_URL } from "../../constants/endpoints";
import {
  FETCH_TAXI_REQUEST,
  FETCH_TAXI_SUCCESS,
  FETCH_TAXI_FAILURE
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator for the fetching of all taxi in the system
 */
export function fetchTaxiRequest() {
  return actionCreator(FETCH_TAXI_REQUEST);
}

/**
 * Action creator for failure to fetch all taxi in the system
 * @param {object} error A description of the error that occurred
 */
export function fetchTaxiFailure(error) {
  return actionCreator(FETCH_TAXI_FAILURE, error);
}

/**
 * Action creator for successful fetching taxi data
 * @param {object} data an array of all the taxi data
 */
export function fetchTaxisuccess(data) {
  return actionCreator(FETCH_TAXI_SUCCESS, data);
}

/**
 *Requests for all the taxi data from the api system and dispatches a `FETCH_TAXI_SUCCESS`
 * if it was successful otherwise, a `FETCH_TAXI_FAILURE` is dispatched
 * @param {string} token the user token
 */

export function fetchTaxis(token, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpGET(TAXIS_URL, tokenConfig(token))
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(fetchTaxisuccess(response.data));
          callback(true);
        } else {
          dispatch(
            fetchTaxiFailure(
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
          dispatch(fetchTaxiFailure(errMsg));
          callback(false, errMsg);
        }
      });
  }
  return dispatch => {
    dispatch(fetchTaxiRequest());
    return apiRequest(dispatch, true);
  };
}
