import {tokenConfig, apiHttpDELETE} from "../../utility/request_helper";
import {formatUrl} from "../../utility/misc";
import { USER_URL, COUNTRY_URL, TOWN_URL } from '../../constants/endpoints';
import {
    DELETE_TOWN_REQUEST,
    DELETE_TOWN_SUCCESS,
    DELETE_TOWN_FAILURE
}
from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { fetchTowns } from "./fetch_town_actions";

/**
 * Action creator for town deletion
 */
export function deleteTownRequest(townId){
    return actionCreator(DELETE_TOWN_REQUEST, townId);
}

/**
 * Action creator for failure to delete town
 * @param {string} error The error message describing the failure
 */
export function deleteTownFailure(error){
    return actionCreator(DELETE_TOWN_FAILURE, error)
}

/**
 * Action creator for successfully deleting a town
 * @param {object} data 
 */
export function deleteTownSuccess(data){
    return actionCreator(DELETE_TOWN_SUCCESS, data);
}

/**
 * Action to delete town, given the token and the town id.
 * If it succeeds, the `DELETE_TOWN_SUCCESS` action type is dispatched otherwise,
 * the `DELETE_TOWN_FAILURE` action type is dispatched.
 * 
 * @param {string} token The request token
 * @param {string} userId The user's id
 */
export function deleteTown(token, townId, callback=()=>{}){
    function apiRequest(dispatch, retry=false){
        return apiHttpDELETE(formatUrl( TOWN_URL, null, {id:townId} ), tokenConfig(token))
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(deleteTownSuccess(townId));
                dispatch(fetchTowns(token));     //we fetch all the towns again so as to get all the update
                callback(true)
            }else{
                const errMsg = response.data.error? response.data.error.message:`Request failed with status code ${response.status}`;
                dispatch(deleteTownFailure(errMsg));
                callback(false, errMsg);
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(deleteTownFailure(errMsg));
                callback(false, errMsg);
            }
            console.log("This error occured: ", err)
        });
    }
    return (dispatch)=>{
        dispatch(deleteTownRequest(townId));
        return apiRequest(dispatch, true);
    }
}