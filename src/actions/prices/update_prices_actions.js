import {
  tokenConfig,
  apiHttpPOST,
  apiHttpPATCH
} from "../../utility/request_helper";
import { PRICES_URL } from "../../constants/endpoints";
import {
  UPDATE_PRICE_REQUEST,
  UPDATE_PRICE_SUCCESS,
  UPDATE_PRICE_FAILURE
} from "../../constants/action_types";

import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";
import { fetchPrices } from "./fetch_prices_actions";

/**
 * Action creator to initiate the process of updating a price
 */
export function updatePriceRequest() {
  return actionCreator(UPDATE_PRICE_REQUEST);
}

/**
 * Action creator for failure to update a PRICE
 * @param {string} error The error message describing the failure
 */
export function updatePriceFailure(error) {
  return actionCreator(UPDATE_PRICE_FAILURE, error);
}

/**
 * Action creator for successfully updating a price
 * @param {object} data
 */
export function updatePriceSuccess(data) {
  return actionCreator(UPDATE_PRICE_SUCCESS, data);
}

/**
 * Requests for the update of a taxi.
 * If it succeeds, the `UPDATE_TAXI_SUCCESS` action type is dispatched otherwise,
 * the `UPDATE_TAXI_FAILURE` action type is dispatched.
 *
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */
export function updatePrice(token, pricCeData, priceId, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpPATCH(
      formatUrl(PRICES_URL, null, { id: priceId }),
      tokenConfig(token),
      pricCeData
    )
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(updatePriceSuccess(response.data));
          dispatch(fetchPrices(token)); //we fetch all the users again so as to get all the update
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(updatePriceFailure(errMsg));
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
          dispatch(updatePriceFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(updatePriceRequest());
    return apiRequest(dispatch, true);
  };
}
