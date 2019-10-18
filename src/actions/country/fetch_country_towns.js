import { apiHttpGET, tokenConfig } from "../../utility/request_helper";
import { USERS_URL, COUNTRY_TOWNS_URL } from "../../constants/endpoints";
import {
  FETCH_COUNTRY_TOWN_REQUEST,
  FETCH_COUNTRY_TOWN_FAILURE,
  FETCH_COUNTRY_TOWN_SUCCESS
} from "../../constants/action_types";
import { formatUrl } from "../../utility/misc";
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator to initiate fetching of all the country data
 */
export function fetchCountriesTownRequest(countryId) {
  return actionCreator(FETCH_COUNTRY_TOWN_REQUEST, countryId);
}

/**
 * Action creator for failure to fetch all country data
 * @param {string} error A description of the error that occurred
 */
export function fetchCountriesTownFailure(error) {
  return actionCreator(FETCH_COUNTRY_TOWN_FAILURE, error);
}

/**
 * Action creator for successfully fetching country data
 * @param {object} data an array of all the country data
 */
export function fetchCountriesTownSuccess(data) {
  return actionCreator(FETCH_COUNTRY_TOWN_SUCCESS, data);
}

/**
 * Requests for all the country data from the api system and dispatches a `FETCH_ALL_COUNTRIES_SUCCESS`
 * if it was successful otherwise, a `FETCH_ALL_COUNTRIES_FAILURE` is dispatched
 * @param {string} token the user token
 */
export function fetchCountryTowns(token, countryId) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpGET(
      formatUrl(COUNTRY_TOWNS_URL, null, { countryId }),
      tokenConfig(token)
    )
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(fetchCountriesTownSuccess(response.data));
        } else {
          dispatch(
            fetchCountriesTownFailure(
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
          dispatch(fetchCountriesTownFailure(errMsg));
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(fetchCountriesTownRequest(countryId));
    return apiRequest(dispatch, true);
  };
}
