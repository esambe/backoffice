import { apiHttpGET, tokenConfig } from "../../utility/request_helper";
import { PRICE_URL, PRICES_URL } from "../../constants/endpoints";
import {
  FETCH_PRICE_REQUEST,
  FETCH_PRICE_SUCCESS,
  FETCH_PRICE_FAILURE
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator for the fetching of all price in the system
 */
export function fetchPriceRequest() {
  return actionCreator(FETCH_PRICE_FAILURE);
}

/**
 * Action creator for failure to fetch all price in the system
 * @param {object} error A description of the error that occurred
 */
export function fetchPriceFailure(error) {
  return actionCreator(FETCH_PRICE_FAILURE, error);
}

/**
 * Action creator for successful fetching price data
 * @param {object} data an array of all the price data
 */
export function fetchPricesuccess(data) {
  return actionCreator(FETCH_PRICE_SUCCESS, data);
}

/**
 *Requests for all the taxi data from the api system and dispatches a `FETCH_PRICE_SUCCESS`
 * if it was successful otherwise, a `FETCH_PRICE_FAILURE` is dispatched
 * @param {string} token the user token
 */

export function fetchPrices(token, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpGET(PRICES_URL, tokenConfig(token))
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(fetchPricesuccess(response.data));
          callback(true);
        } else {
          dispatch(
            fetchTaxiFailure(
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
          dispatch(fetchTaxiFailure(errMsg));
          callback(false, errMsg);
        }
      });
  }
  return dispatch => {
    dispatch(fetchPriceRequest());
    return apiRequest(dispatch, true);
  };
}
