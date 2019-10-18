import { tokenConfig, apiHttpPOST } from "../../utility/request_helper";
import {
  USERS_URL,
  PICKUP_AREA_URL,
  PICKUP_AREAS_URL
} from "../../constants/endpoints";
import {
  ADD_PICKUP_AREA_REQUEST,
  ADD_PICKUP_AREA_SUCCESS,
  ADD_PICKUP_AREA_FAILURE
} from "../../constants/action_types";
import { fetchPickupAreas } from "./fetch_pickup_areas_actions";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";

/**
 * Action creator to initiate the process of adding a new town
 */
export function addPickupAreaRequest() {
  return actionCreator(ADD_PICKUP_AREA_REQUEST);
}

/**
 * Action creator for failure to add a new town
 * @param {string} error The error message describing the failure
 */
export function addPickupAreaFailure(error) {
  return actionCreator(ADD_PICKUP_AREA_FAILURE, error);
}

/**
 * Action creator for successfully adding a new town
 * @param {object} data
 */
export function addPickupAreaSuccess(data) {
  return actionCreator(ADD_PICKUP_AREA_SUCCESS, data);
}

/**
 * Requests for the addition of a town.
 * If it succeeds, the `ADD_PICKUP_SUCCESS` action type is dispatched otherwise,
 * the `ADD_PICKUP_FAILURE` action type is dispatched.
 *
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */
export function addPickupArea(token, pickupData, callback = () => {}) {
  function apiRequest(dispatch, retry = false) {
    return apiHttpPOST(PICKUP_AREAS_URL, tokenConfig(token), pickupData)
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(addPickupAreaSuccess(response.data));
          dispatch(fetchPickupAreas(token)); //we fetch all the users again so as to get all the update
          callback(true);
        } else {
          const errMsg = response.data.error
            ? response.data.error.message
            : `Request failed with status code ${response.status}`;
          dispatch(addPickupAreaFailure(errMsg));
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
          dispatch(addPickupAreaFailure(errMsg));
          callback(false, errMsg);
        }
        console.log("This error occured: ", err);
      });
  }
  return dispatch => {
    dispatch(addPickupAreaRequest());
    return apiRequest(dispatch, true);
  };
}
