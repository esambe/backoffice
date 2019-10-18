import { apiHttpGET, tokenConfig } from "../../utility/request_helper";
import { DRIVER_APPS_URL } from "../../constants/endpoints";
import {
  FETCH_DRIVER_APP_REQUEST,
  FETCH_DRIVER_APP_FAILURE,
  FETCH_DRIVER_APP_SUCCESS
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator to initiate fetching of all driver applications data
 */
export function fetchAllDriversAppRequest() {
  return actionCreator(FETCH_DRIVER_APP_REQUEST);
}

/**
 * Action creator for failure to fetch all driver applications data
 * @param {string} error A description of the error that occurred
 */
export function fetchAllDriversAppFailure(error) {
  return actionCreator(FETCH_DRIVER_APP_FAILURE, error);
}

/**
 * Action creator for successfully fetching user data
 * @param {object} data an array of all the user data
 */
export function fetchAllDriversAppSuccess(data) {
  return actionCreator(FETCH_DRIVER_APP_SUCCESS, data);
}

/**
 * Requests for all user data from the api system and dispatches a `FETCH_DRIVER_APP_SUCCESS`
 * if it was successful otherwise, a `FETCH_DRIVER_APP_FAILURE` is dispatched
 * @param {string} token the user token
 */
export function fetchDrivers_App(token, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpGET(DRIVER_APPS_URL, tokenConfig(token))
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(fetchAllDriversAppSuccess(response.data));
          callback(true);
        } else {
          dispatch(
            fetchAllDriversAppFailure(
              `Response failed with status code ${response.status}`
            )
          );
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
          dispatch(fetchAllDriversAppFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(fetchAllDriversAppRequest());
    return apiRequest(dispatch, true);
  };
}
