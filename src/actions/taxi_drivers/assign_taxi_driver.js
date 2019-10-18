import { tokenConfig, apiHttpPOST } from "../../utility/request_helper";
import { TAXI_DRIVERS } from "../../constants/endpoints";
import {
  ASSIGN_TAXI_DRIVER_SUCCESS,
  ASSIGN_TAXI_DRIVER_REQUEST,
  ASSIGN_TAXI_DRIVER_FAILURE
} from "../../constants/action_types";
import { fetchTaxiDrivers } from "./fetch_assign_taxi_driver";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";

/**
 * Action creator to initiate the process of adding a new taxi the app
 */

export function assignTaxiDriverRequest() {
  return actionCreator(ASSIGN_TAXI_DRIVER_REQUEST);
}

/**
 * Action creator for failure to add a new taxi
 * @param {string} error The error message describing the failure
 */
export function assignTaxiDriverFailure(error) {
  return actionCreator(ASSIGN_TAXI_DRIVER_FAILURE, error);
}
/**
 *  Action creator for adding a taxi
 * @param {object} data
 */

export function assignTaxiDriversuccess(data) {
  return actionCreator(ASSIGN_TAXI_DRIVER_SUCCESS, data);
}

/**
 * Request the addintion of a Taxi
 * if successfull, ADD_TAXI_SUCCESS action type will dispatch otherwise
 * the ADD_TAXI_FAILURE will be dispatch
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */

export function assignTaxiDrivers(token, taxiDriverData, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpPOST(TAXI_DRIVERS, tokenConfig(token), taxiDriverData)
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(assignTaxiDriversuccess(response.data));
          dispatch(fetchTaxiDrivers(token)); //we fetch all the users again so as to get all the update
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(assignTaxiDriverFailure(errMsg));
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
          dispatch(assignTaxiDriverFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(assignTaxiDriverRequest());
    return apiRequest(dispatch, true);
  };
}
