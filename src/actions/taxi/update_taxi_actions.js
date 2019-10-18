import {
  tokenConfig,
  apiHttpPOST,
  apiHttpPATCH
} from "../../utility/request_helper";
import { TAXI_URL } from "../../constants/endpoints";
import {
  UPDATE_TAXI_REQUEST,
  UPDATE_TAXI_FAILURE,
  UPDATE_TAXI_SUCCESS
} from "../../constants/action_types";

import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";
import { fetchTaxis } from "./fetch_taxi_actions";

/**
 * Action creator to initiate the process of updating a taxi
 */
export function updateTaxiRequest() {
  return actionCreator(UPDATE_TAXI_REQUEST);
}

/**
 * Action creator for failure to update a taxi
 * @param {string} error The error message describing the failure
 */
export function updateTaxiFailure(error) {
  return actionCreator(UPDATE_TAXI_FAILURE, error);
}

/**
 * Action creator for successfully updating a taxi
 * @param {object} data
 */
export function updateTaxiSuccess(data) {
  return actionCreator(UPDATE_TAXI_SUCCESS, data);
}

/**
 * Requests for the update of a taxi.
 * If it succeeds, the `UPDATE_TAXI_SUCCESS` action type is dispatched otherwise,
 * the `UPDATE_TAXI_FAILURE` action type is dispatched.
 *
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */
export function updateTaxi(token, taxiData, taxiId, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpPATCH(
      formatUrl(TAXI_URL, null, { id: taxiId }),
      tokenConfig(token),
      taxiData
    )
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(updateTaxiSuccess(response.data));
          dispatch(fetchTaxis(token)); //we fetch all the users again so as to get all the update
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(updateTaxiFailure(errMsg));
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
          dispatch(updateTaxiFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(updateTaxiRequest());
    return apiRequest(dispatch, true);
  };
}
