import { apiHttpGET, tokenConfig } from "../../utility/request_helper";
import { TAXI_DRIVERS } from "../../constants/endpoints";
import {
  FETCH_TAXI_DRIVER_FAILURE,
  FETCH_TAXI_DRIVER_SUCCESS,
  FETCH_TAXI_DRIVER_REQUEST
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator for the fetching of all taxi in the system
 */
export function fetchTaxiDriverRequest() {
  return actionCreator(FETCH_TAXI_DRIVER_REQUEST);
}

/**
 * Action creator for failure to fetch all taxi in the system
 * @param {object} error A description of the error that occurred
 */
export function fetchTaxiDriverFailure(error) {
  return actionCreator(FETCH_TAXI_DRIVER_FAILURE, error);
}

/**
 * Action creator for successful fetching taxi data
 * @param {object} data an array of all the taxi data
 */
export function fetchTaxiDriversuccess(data) {
  return actionCreator(FETCH_TAXI_DRIVER_SUCCESS, data);
}

/**
 *Requests for all the taxi data from the api system and dispatches a `FETCH_TAXI_SUCCESS`
 * if it was successful otherwise, a `FETCH_TAXI_FAILURE` is dispatched
 * @param {string} token the user token
 */

export function fetchTaxiDrivers(token, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpGET(TAXI_DRIVERS, tokenConfig(token))
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(fetchTaxiDriversuccess(response.data));
          callback(true);
        } else {
          dispatch(
            fetchTaxiDriversuccess(
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
          dispatch(fetchTaxiDriverFailure(errMsg));
          callback(false, errMsg);
        }
      });
  }
  return dispatch => {
    dispatch(fetchTaxiDriverRequest());
    return apiRequest(dispatch, true);
  };
}
