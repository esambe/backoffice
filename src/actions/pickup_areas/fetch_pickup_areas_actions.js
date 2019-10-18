import {apiHttpGET, tokenConfig} from "../../utility/request_helper";
import {  PICKUP_AREAS_URL } from '../../constants/endpoints';
import {
    FETCH_PICKUP_AREAS_REQUEST,
    FETCH_PICKUP_AREAS_SUCCESS,
    FETCH_PICKUP_AREAS_FAILURE
}
from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";


/**
 * Action creator to initiate fetching of all the pickup data
 */
export function fetchPickupAreasRequest(townId){
    return actionCreator(FETCH_PICKUP_AREAS_REQUEST, townId);
}

/**
 * Action creator for failure to fetch all pickups data   
 * @param {string} error A description of the error that occurred
 */
export function fetchPickupAreasFailure(error){
    return actionCreator(FETCH_PICKUP_AREAS_FAILURE, error)
}


/**
 * Action creator for successfully fetching pickups data
 * @param {object} data an array of all the pickups data
 */
export function fetchPickupAreasSuccess(data){
    return actionCreator(FETCH_PICKUP_AREAS_SUCCESS, data);
}

/**
 * Requests for all the pickup data from the api system and dispatches a `FETCH_PICKUPS_SUCCESS`
 * if it was successful otherwise, a `FETCH_PICKUPS_FAILURE` is dispatched
 * @param {string} token the user token
 */
export function fetchPickupAreas(token, countryId, townId){
    function apiRequest(dispatch, retry=false){
        return apiHttpGET(PICKUP_AREAS_URL, tokenConfig(token))
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(fetchPickupAreasSuccess(response.data));
            }else{
                dispatch(fetchPickupAreasFailure(`Response failed with status code ${response.status}`));
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(fetchPickupAreasFailure(errMsg));
            }
            console.log("This error occurred: ", err)
        })
    }
    return (dispatch)=>{
        dispatch(fetchPickupAreasRequest(countryId, townId))
        return apiRequest(dispatch, true);
    }
}
