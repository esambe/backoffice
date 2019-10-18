import { tokenConfig, apiHttpPOST } from "../../utility/request_helper";
import { PRICES_URL } from "../../constants/endpoints";
import {
  ADD_PRICE_FAILURE,
  ADD_PRICE_SUCCESS,
  ADD_PRICE_FAILURE
} from "../../constants/action_types";
import { fetchPrices } from "./fetch_prices_actions";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";

/**
 * Action creator to initiate the process of adding a new price
 */

export function addPriceRequest() {
  return actionCreator(ADD_PRICE_REAUEST);
}

/**
 * Action creator for failure to add a new price
 * @param {string} error The error message describing the failure
 */
export function addPriceFailure(error) {
  return actionCreator(ADD_PRICE_FAILURE, error);
}
/**
 *  Action creator for adding a price
 * @param {object} data
 */

export function addPriceSuccess(data) {
  return actionCreator(ADD_PRICE_SUCCESS, data);
}

/**
 * Request the addintion of a PRICE
 * if successfull, ADD_PRICE_SUCCESS action type will dispatch otherwise
 * the ADD_PRICE_FAILURE will be dispatch
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */

export function addPrice(token, priceData, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpPOST(PRICES_URL, tokenConfig(token), priceData)
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(addPriceSuccess(response.data));
          dispatch(fetchPrices(token)); //we fetch all the prices again so as to get all the update
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(addPriceFailure(errMsg));
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
          dispatch(addPriceFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(addPriceRequest());
    return apiRequest(dispatch, true);
  };
}
