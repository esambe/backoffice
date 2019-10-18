import { tokenConfig, apiHttpDELETE } from "../../utility/request_helper";
import { formatUrl } from "../../utility/misc";
import { TAXI_DRIVER } from "../../constants/endpoints";
import {
  DELETE_TAXI_DRIVER_FAILURE,
  DELETE_TAXI_DRIVER_SUCCESS,
  DELETE_TAXI_DRIVER_REQUEST
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import {
  fetchTaxiDrivers,
  fetchTaxiDriverFailure
} from "./fetch_assign_taxi_driver";
import { request } from "http";

/**
 * Action creator for taxi_driver delete
 */
export function deleteTaxiDriverRequest(taxi_driverId) {
  return actionCreator(DELETE_TAXI_DRIVER_REQUEST, taxi_driverId);
}
/**
 * Action creator for failure delete taxi_drivers
 *  @param {string} error The error message describing the failure
 */
export function deleteTaxiDriverFailure(error) {
  return actionCreator(DELETE_TAXI_DRIVER_FAILURE, error);
}

/**
 * Action creator for delete tax_drivers successful
 *  @param {object} data
 */
export function deleteTaxiDriverSuccess(data) {
  return actionCreator(DELETE_TAXI_DRIVER_SUCCESS, data);
}

/**
 * Action delete taxi given  token and taxi_driver id
 * If successful, action DELETE_TAXI_DRIVER_SUCCESS action type is dispatch otherwise
 * Action type DELETE_TAXI_DRIVER_FAILURE is dispatch
 * @param {string} token The request token
 * @param {string} userId The user's id
 */
export function deleteTaxiDriver(token, taxi_driverId, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpDELETE(
      formatUrl(TAXI_DRIVER, null, { id: taxi_driverId }),
      tokenConfig(token)
    )
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(deleteTaxiDriverSuccess(taxi_driverId));
          dispatch(fetchTaxiDrivers(token));
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(deleteTaxiDriverFailure(errMsg));
          dispatch(fetchTaxiDrivers(token));
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
          dispatch(deleteTaxiDriverFailure(errMsg));
          callback(false, errMsg);
        }
      });
  }
  return dispatch => {
    dispatch(deleteTaxiDriverRequest(taxi_driverId));
    return apiRequest(dispatch, true);
  };
}
