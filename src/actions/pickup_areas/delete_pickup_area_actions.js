import {tokenConfig, apiHttpDELETE} from "../../utility/request_helper";
import {formatUrl} from "../../utility/misc";
import { USER_URL, TOWN_URL, PICKUP_AREA_URL } from '../../constants/endpoints';
import {
    DELETE_PICKUP_AREA_REQUEST,
    DELETE_PICKUP_AREA_SUCCESS,
    DELETE_PICKUP_AREA_FAILURE
}
from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { fetchPickupAreas } from "./fetch_pickup_areas_actions";

/**
 * Action creator for town deletion
 */
export function deletePickupAreaRequest(pickupId){
    return actionCreator(DELETE_PICKUP_AREA_REQUEST, pickupId);
}

/**
 * Action creator for failure to delete town
 * @param {string} error The error message describing the failure
 */
export function deletePickupAreaFailure(error){
    return actionCreator(DELETE_PICKUP_AREA_FAILURE, error)
}

/**
 * Action creator for successfully deleting a town
 * @param {object} data 
 */
export function deletePickupAreaSuccess(data){
    return actionCreator(DELETE_PICKUP_AREA_SUCCESS, data);
}

/**
 * Action to delete town, given the token and the town id.
 * If it succeeds, the `DELETE_PICKUP_SUCCESS` action type is dispatched otherwise,
 * the `DELETE_PICKUP_FAILURE` action type is dispatched.
 * 
 * @param {string} token The request token
 * @param {string} userId The user's id
 */
export function deletePickupArea(token, pickupId, callback=()=>{}){
    function apiRequest(dispatch, retry=false){
        return apiHttpDELETE(formatUrl( PICKUP_AREA_URL, null, {id:pickupId} ), tokenConfig(token))
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(deletePickupAreaSuccess(pickupId));
                dispatch(fetchPickupAreas(token));     //we fetch all the pickups again so as to get all the update
                callback(true)
            }else{
                const errMsg = response.data.error? response.data.error.message:`Request failed with status code ${response.status}`;
                dispatch(deletePickupAreaFailure(errMsg));
                callback(false, errMsg);
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(deletePickupAreaFailure(errMsg));
                callback(false, errMsg);
            }
            console.log("This error occured: ", err)
        });
    }
    return (dispatch)=>{
        dispatch(deletePickupAreaRequest(pickupId));
        return apiRequest(dispatch, true);
    }
}