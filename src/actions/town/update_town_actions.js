import {tokenConfig, apiHttpPOST, apiHttpPATCH} from "../../utility/request_helper";
import { USERS_URL, COUNTRIES_URL, COUNTRY_URL, TOWN_URL } from '../../constants/endpoints';
import {
    UPDATE_TOWN_REQUEST,
    UPDATE_TOWN_SUCCESS,
    UPDATE_TOWN_FAILURE
}
from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";
import { fetchTowns } from "./fetch_town_actions";

/**
 * Action creator to initiate the process of updating a town
 */
export function updateTownRequest(){
    return actionCreator(UPDATE_TOWN_REQUEST);
}

/**
 * Action creator for failure to update a town
 * @param {string} error The error message describing the failure
 */
export function updateTownFailure(error){
    return actionCreator(UPDATE_TOWN_FAILURE, error)
}

/**
 * Action creator for successfully updating a town
 * @param {object} data 
 */
export function updateTownSuccess(data){
    return actionCreator(UPDATE_TOWN_SUCCESS, data);
}

/**
 * Requests for the update of a town. 
 * If it succeeds, the `UPDATE_TOWN_SUCCESS` action type is dispatched otherwise,
 * the `UPDATE_TOWN_FAILURE` action type is dispatched.
 * 
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */
export function updateTown(token, townData, townId, callback=()=>{}){
    function apiRequest(dispatch, retry=false){
        return apiHttpPATCH(formatUrl( TOWN_URL, null, {id:townId} ), tokenConfig(token), townData)
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(updateTownSuccess(response.data));
                dispatch(fetchTowns(token));     //we fetch all the users again so as to get all the update
                callback(true)
            }else{
                const errMsg = response.data.error? response.data.error.message:`Request failed with status code ${response.status}`;
                dispatch(updateTownFailure(errMsg));
                callback(false, errMsg);
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(updateTownFailure(errMsg));
                callback(false, errMsg)
            }
            console.log("This error occured: ", err)
        })
    }
    return (dispatch)=>{
        dispatch(updateTownRequest());
        return apiRequest(dispatch, true);
    }
}