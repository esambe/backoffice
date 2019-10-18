import { tokenConfig, apiHttpDELETE } from "../../utility/request_helper";
import { formatUrl } from "../../utility/misc";
import { USER_URL, TOWN_URL, DRIVER_URL } from "../../constants/endpoints";
import {
  DELETE_DRIVER_REQUEST,
  DELETE_DRIVER_SUCCESS,
  DELETE_DRIVER_FAILURE
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { fetchDrivers } from "./fetch_driver_actions";

/**
 * Action creator for user data deletion
 */
export function deleteDriverDataRequest(driverId) {
  return actionCreator(DELETE_DRIVER_REQUEST, driverId);
}

/**
 * Action creator for failure to delete user data
 * @param {string} error The error message describing the failure
 */
export function deleteDriverDataFailure(error) {
  return actionCreator(DELETE_DRIVER_FAILURE, error);
}

/**
 * Action creator for successfully deleting a user's data
 * @param {object} data
 */
export function deleteDriverDataSuccess(data) {
  return actionCreator(DELETE_DRIVER_SUCCESS, data);
}

/**
 * Action to delete driver's data, given the token and the drivers's id.
 * If it succeeds, the `DELETE_DRIVER_DATA_SUCCESS` action type is dispatched otherwise,
 * the `DELETE_DRIVER_DATA_FAILURE` action type is dispatched.
 *
 * @param {string} token The request token
 * @param {string} driverId The user's id
 */
export function deleteDriverData(token, driverId, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpDELETE(
      formatUrl(DRIVER_URL, null, { id: driverId }),
      tokenConfig(token)
    )
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(deleteDriverDataSuccess(driverId));
          dispatch(fetchDrivers(token)); //we fetch all the users again so as to get all the update
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(deleteDriverDataFailure(errMsg));
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
          dispatch(deleteDriverDataFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(deleteDriverDataRequest(driverId));
    return apiRequest(dispatch, true);
  };
}
