import { tokenConfig, apiHttpPOST } from "../../utility/request_helper";
import { TAXIS_URL } from "../../constants/endpoints";
import {
  ADD_TAXI_REQUEST,
  ADD_TAXI_SUCCESS,
  ADD_TAXI_FAILURE
} from "../../constants/action_types";
import { fetchTaxis } from "./fetch_taxi_actions";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";

/**
 * Action creator to initiate the process of adding a new taxi the app
 */

export function addTaxiRequest() {
  return actionCreator(ADD_TAXI_REQUEST);
}

/**
 * Action creator for failure to add a new taxi
 * @param {string} error The error message describing the failure
 */
export function addTaxiFailure(error) {
  return actionCreator(ADD_TAXI_FAILURE, error);
}
/**
 *  Action creator for adding a taxi
 * @param {object} data
 */

export function addTaxiSuccess(data) {
  return actionCreator(ADD_TAXI_SUCCESS, data);
}

/**
 * Request the addintion of a Taxi
 * if successfull, ADD_TAXI_SUCCESS action type will dispatch otherwise
 * the ADD_TAXI_FAILURE will be dispatch
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */

export function addTaxi(token, taxiData, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpPOST(TAXIS_URL, tokenConfig(token), taxiData)
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(addTaxiSuccess(response.data));
          dispatch(fetchTaxis(token)); //we fetch all the users again so as to get all the update
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(addTaxiFailure(errMsg));
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
          dispatch(addTaxiFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(addTaxiRequest());
    return apiRequest(dispatch, true);
  };
}
