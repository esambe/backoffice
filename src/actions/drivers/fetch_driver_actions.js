import { apiHttpGET, tokenConfig } from "../../utility/request_helper";
import { DRIVERS_URL } from "../../constants/endpoints";
import {
  FETCH_DRIVER_REQUEST,
  FETCH_DRIVER_SUCCESS,
  FETCH_DRIVERS_FAILURE
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator to initiate fetching of all driver data
 */
export function fetchAllDriversRequest() {
  return actionCreator(FETCH_DRIVER_REQUEST);
}

/**
 * Action creator for failure to fetch all driver data
 * @param {string} error A description of the error that occurred
 */
export function fetchAllDriversFailure(error) {
  return actionCreator(FETCH_DRIVERS_FAILURE, error);
}

/**
 * Action creator for successfully fetching user data
 * @param {object} data an array of all the user data
 */
export function fetchAllDriversSuccess(data) {
  return actionCreator(FETCH_DRIVER_SUCCESS, data);
}

/**
 * Requests for all user data from the api system and dispatches a `FETCH_ALL_USERS_SUCCESS`
 * if it was successful otherwise, a `FETCH_ALL_USERS_FAILURE` is dispatched
 * @param {string} token the user token
 */
export function fetchDrivers(token, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpGET(DRIVERS_URL, tokenConfig(token))
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(fetchAllDriversSuccess(response.data));
          callback(true);
        } else {
          dispatch(
            fetchAllDriversFailure(
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
          dispatch(fetchAllDriversFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(fetchAllDriversRequest());
    return apiRequest(dispatch, true);
  };
}
