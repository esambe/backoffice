import { tokenConfig, apiHttpPOST } from "../../utility/request_helper";
import { DRIVERS_URL, DRIVER_URL } from "../../constants/endpoints";
import {
  ADD_DRIVER_REQUEST,
  ADD_DRIVER_SUCCESS,
  ADD_DRIVER_FAILURE
} from "../../constants/action_types";
import { fetchDrivers } from "./fetch_driver_actions";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";

/**
 * Action creator for New Driver creation request
 */
export function addDriverRequest() {
  return actionCreator(ADD_DRIVER_REQUEST);
}

/**
 * Action creator for failure to create a new driver
 * @param {string} error The error message describing the failure
 */
export function addDriverFailure(error) {
  return actionCreator(ADD_DRIVER_FAILURE, error);
}

/**
 * Action creator for successfully creating a driver
 * @param {object} data
 */
export function addDriverSuccess(data) {
  return actionCreator(ADD_DRIVER_SUCCESS, data);
}

/**
 * Requests for the creation of a new user given the token and the driver data.
 * If it succeeds, the `CREATE_NEW_DRIVER_SUCCESS` action type is dispatched otherwise,
 * the `CREATE_NEW_DRIVER_FAILURE` action type is dispatched.
 *
 * @param {string} token The request token
 * @param {object} userData Object containing the drivers data to be saved
 */
export function addDriver(token, driverData, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpPOST(DRIVERS_URL, tokenConfig(token), driverData)
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(addDriverSuccess(response.data));
          dispatch(fetchDrivers(token)); //we fetch all the drivers again so as to get all the update
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(addDriverFailure(errMsg));
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
          dispatch(addDriverFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(addDriverRequest());
    return apiRequest(dispatch, true);
  };
}
