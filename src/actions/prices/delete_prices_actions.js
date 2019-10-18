import { tokenConfig, apiHttpDELETE } from "../../utility/request_helper";
import { formatUrl } from "../../utility/misc";
import { PRICE_URL, PRICES_URL } from "../../constants/endpoints";
import {
  DELETE_PRICE_FAILURE,
  DELETE_PRICE_SUCCESS,
  DELETE_PRICE_REQUEST
} from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { fetchPrices } from "./fetch_prices_actions";
import { request } from "http";

/**
 * Action creator for price delete
 */
export function deletePriceRequest(taxiId) {
  return actionCreator(DELETE_PRICE_REQUEST, taxiId);
}
/**
 * Action creator for failure delete PRICE
 *  @param {string} error The error message describing the failure
 */
export function deletePriceFailure(error) {
  return actionCreator(DELETE_PRICE_FAILURE, error);
}

/**
 * Action creator for delete price successful
 *  @param {object} data
 */
export function deletePriceSuccess(data) {
  return actionCreator(DELETE_PRICE_SUCCESS, data);
}

/**
 * Action delete taxi given  token and price id
 * If successful, action DELETE_PRICE_SUCCESS action type is dispatch otherwise
 * Action type DELETE_PRICE_FAILURE is dispatch
 * @param {string} token The request token
 * @param {string} userId The user's id
 */
export function deletePrice(token, priceId, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpDELETE(
      formatUrl(PRICES_URL, null, { id: priceId }),
      tokenConfig(token)
    )
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(deletePriceSuccess(taxiId));
          dispatch(fetchPrices(token));
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(deletePriceFailure(errMsg));
          dispatch(fetchPrices(token));
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
          dispatch(deletePriceFailure(errMsg));
          callback(false, errMsg);
        }
      });
  }
  return dispatch => {
    dispatch(deletePriceRequest(priceId));
    return apiRequest(dispatch, true);
  };
}
