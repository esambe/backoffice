import { apiHttpGET, tokenConfig } from "../../utility/request_helper";
import { TOWNS_URL } from "../../constants/endpoints";
import {
  FETCH_TOWNS_REQUEST,
  FETCH_TOWNS_SUCCESS,
  FETCH_TOWNS_FAILURE
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator to initiate fetching of all the country data
 */
export function fetchTownsRequest(countryId) {
  return actionCreator(FETCH_TOWNS_REQUEST, countryId);
}

/**
 * Action creator for failure to fetch all towns data
 * @param {string} error A description of the error that occurred
 */
export function fetchTownsFailure(error) {
  return actionCreator(FETCH_TOWNS_FAILURE, error);
}

/**
 * Action creator for successfully fetching towns data
 * @param {object} data an array of all the towns data
 */
export function fetchTownsSuccess(data) {
  return actionCreator(FETCH_TOWNS_SUCCESS, data);
}

/**
 * Requests for all the town data from the api system and dispatches a `FETCH_TOWNS_SUCCESS`
 * if it was successful otherwise, a `FETCH_TOWNS_FAILURE` is dispatched
 * @param {string} token the user token
 */
export function fetchTowns(token, countryId) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpGET(TOWNS_URL, tokenConfig(token))
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(fetchTownsSuccess(response.data));
        } else {
          dispatch(
            fetchTownsFailure(
              `Response failed with status code ${response.status}`
            )
          );
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
          dispatch(fetchTownsFailure(errMsg));
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(fetchTownsRequest(countryId));
    return apiRequest(dispatch, true);
  };
}
