import {
  tokenConfig,
  apiHttpPOST,
  apiHttpPATCH
} from "../../utility/request_helper";
import { DRIVER_URL } from "../../constants/endpoints";
import {
  UPDATE_DRIVER_REQUEST,
  UPDATE_DRIVER_SUCCESS,
  UPDATE_DRIVER_FAILURE
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";
import { fetchAllDrivers } from "./fetch_driver_actions";

/**
 * Action creator to initiate the process of updating a town
 */
export function updateDriverRequest() {
  return actionCreator(UPDATE_DRIVER_REQUEST);
}

/**
 * Action creator for failure to update a town
 * @param {string} error The error message describing the failure
 */
export function updateDriverFailure(error) {
  return actionCreator(UPDATE_DRIVER_FAILURE, error);
}

/**
 * Action creator for successfully updating a town
 * @param {object} data
 */
export function updateDriverSuccess(data) {
  return actionCreator(UPDATE_DRIVER_SUCCESS, data);
}

/**
 * Requests for the update of a town.
 * If it succeeds, the `UPDATE_TOWN_SUCCESS` action type is dispatched otherwise,
 * the `UPDATE_TOWN_FAILURE` action type is dispatched.
 *
 * @param {string} token The request token
 * @param {object} driverData Object containing the user data to be saved
 */
export function updateDriver(token, driverData, driverId, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpPATCH(
      formatUrl(DRIVER_URL, null, { id: driverId }),
      tokenConfig(token),
      driverData
    )
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(updateDriverSuccess(response.data));
          dispatch(fetchDrivers(token)); //we fetch all the users again so as to get all the update
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(updateDriverFailure(errMsg));
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
          dispatch(updateDriverFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(updateDriverRequest());
    return apiRequest(dispatch, true);
  };
}
