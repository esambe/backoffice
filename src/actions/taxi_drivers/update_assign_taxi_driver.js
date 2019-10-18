import {
  tokenConfig,
  apiHttpPOST,
  apiHttpPATCH
} from "../../utility/request_helper";
import { TAXI_DRIVER } from "../../constants/endpoints";
import {
  UPDATE_TAXI_DRIVER_FAILURE,
  UPDATE_TAXI_DRIVER_REQUEST,
  UPDATE_TAXI_DRIVER_SUCCESS
} from "../../constants/action_types";

import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";
import { fetchTaxiDrivers } from "./fetch_assign_taxi_driver";

/**
 * Action creator to initiate the process of updating a taxi_driver
 */
export function updateTaxiDriverRequest() {
  return actionCreator(UPDATE_TAXI_DRIVER_REQUEST);
}

/**
 * Action creator for failure to update a taxi_driver
 * @param {string} error The error message describing the failure
 */
export function updateTaxiDriverFailure(error) {
  return actionCreator(UPDATE_TAXI_DRIVER_FAILURE, error);
}

/**
 * Action creator for successfully updating a taxi_driver
 * @param {object} data
 */
export function updateTaxiDriverSuccess(data) {
  return actionCreator(UPDATE_TAXI_DRIVER_SUCCESS, data);
}

/**
 * Requests for the update of a taxi.
 * If it succeeds, the `UPDATE_TAXI_DRIVER_SUCCESS` action type is dispatched otherwise,
 * the `UPDATE_TAXI_DRIVER_FAILURE` action type is dispatched.
 *
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */
export function updatetaxiDriver(
  token,
  taxiDriverData,
  taxi_driverId,
  callback = () => {}
) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpPATCH(
      formatUrl(TAXI_DRIVER, null, { id: taxi_driverId }),
      tokenConfig(token),
      taxiDriverData
    )
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(updateTaxiDriverSuccess(response.data));
          dispatch(fetchTaxiDrivers(token)); //we fetch all the users again so as to get all the update
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(updateTaxiDriverFailure(errMsg));
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
          dispatch(updateTaxiDriverFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(updateTaxiDriverRequest());
    return apiRequest(dispatch, true);
  };
}
