import {tokenConfig, apiHttpPOST, apiHttpPATCH} from "../../utility/request_helper";
import { USERS_URL, COUNTRIES_URL, COUNTRY_URL, PICKUP_AREA_URL } from '../../constants/endpoints';
import {
    UPDATE_PICKUP_AREA_REQUEST,
    UPDATE_PICKUP_AREA_SUCCESS,
    UPDATE_PICKUP_AREA_FAILURE
}
from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";
import { fetchPickupAreas } from "./fetch_pickup_areas_actions";

/**
 * Action creator to initiate the process of updating a pickup
 */
export function updatePickupAreaRequest(){
    return actionCreator(UPDATE_PICKUP_AREA_REQUEST);
}

/**
 * Action creator for failure to update a PICKUP
 * @param {string} error The error message describing the failure
 */
export function updatePickupAreaFailure(error){
    return actionCreator(UPDATE_PICKUP_AREA_FAILURE, error)
}

/**
 * Action creator for successfully updating a pickup
 * @param {object} data 
 */
export function updatePickupAreaSuccess(data){
    return actionCreator(UPDATE_PICKUP_AREA_SUCCESS, data);
}

/**
 * Requests for the update of a pickup. 
 * If it succeeds, the `UPDATE_PICKUP_SUCCESS` action type is dispatched otherwise,
 * the `UPDATE_PICKUP_FAILURE` action type is dispatched.
 * 
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */
export function updatePickupArea(token, pickupData, pickupId, callback=()=>{}){
    function apiRequest(dispatch, retry=false){
        return apiHttpPATCH(formatUrl( PICKUP_AREA_URL, null, {id:pickupId} ), tokenConfig(token), pickupData)
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(updatePickupAreaSuccess(response.data));
                dispatch(fetchPickupAreas(token));     //we fetch all the users again so as to get all the update
                callback(true)
            }else{
                const errMsg = response.data.error? response.data.error.message:`Request failed with status code ${response.status}`;
                dispatch(updatePickupAreaFailure(errMsg));
                callback(false, errMsg);
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(updatePickupAreaFailure(errMsg));
                callback(false, errMsg)
            }
            console.log("This error occured: ", err)
        })
    }
    return (dispatch)=>{
        dispatch(updatePickupAreaRequest());
        return apiRequest(dispatch, true);
    }
}