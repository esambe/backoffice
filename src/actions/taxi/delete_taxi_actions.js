import { tokenConfig, apiHttpDELETE } from "../../utility/request_helper";
import { formatUrl } from "../../utility/misc";
import { TAXI_URL } from "../../constants/endpoints";
import {
  DELETE_TAXI_SUCCESS,
  DELETE_TAXI_FAILURE,
  DELETE_TAXI_REQUEST
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { fetchTaxis } from "./fetch_taxi_actions";
import { request } from "http";

/**
 * Action creator for taxi delete
 */
export function deleteTaxiRequest(taxiId) {
  return actionCreator(DELETE_TAXI_REQUEST, taxiId);
}
/**
 * Action creator for failure delete taxi
 *  @param {string} error The error message describing the failure
 */
export function deleteTaxiFailure(error) {
  return actionCreator(DELETE_TAXI_FAILURE, error);
}

/**
 * Action creator for delete taxi successful
 *  @param {object} data
 */
export function deleteTaxiSuccess(data) {
  return actionCreator(DELETE_TAXI_SUCCESS, data);
}

/**
 * Action delete taxi given  token and taxi id
 * If successful, action DELETE_TAXI_SUCCESS action type is dispatch otherwise
 * Action type DELETE_TAXI_FAILURE is dispatch
 * @param {string} token The request token
 * @param {string} userId The user's id
 */
export function deleteTaxi(token, taxiId, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpDELETE(
      formatUrl(TAXI_URL, null, { id: taxiId }),
      tokenConfig(token)
    )
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(deleteTaxiSuccess(taxiId));
          dispatch(fetchTaxis(token));
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(deleteTaxiFailure(errMsg));
          dispatch(fetchTaxis(token));
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
          dispatch(deleteTaxiFailure(errMsg));
          callback(false, errMsg);
        }
      });
  }
  return dispatch => {
    dispatch(deleteTaxiRequest(taxiId));
    return apiRequest(dispatch, true);
  };
}
