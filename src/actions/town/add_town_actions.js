import {tokenConfig, apiHttpPOST} from "../../utility/request_helper";
import { USERS_URL, TOWN_URL, TOWNS_URL } from '../../constants/endpoints';
import {
    ADD_TOWN_REQUEST,
    ADD_TOWN_SUCCESS,
    ADD_TOWN_FAILURE
}
from "../../constants/action_types";
import {fetchTowns} from "./fetch_town_actions"
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";

/**
 * Action creator to initiate the process of adding a new town
 */
export function addTownRequest(){
    return actionCreator(ADD_TOWN_REQUEST);
}

/**
 * Action creator for failure to add a new town
 * @param {string} error The error message describing the failure
 */
export function addTownFailure(error){
    return actionCreator(ADD_TOWN_FAILURE, error)
}

/**
 * Action creator for successfully adding a new town
 * @param {object} data 
 */
export function addTownSuccess(data){
    return actionCreator(ADD_TOWN_SUCCESS, data);
}

/**
 * Requests for the addition of a town. 
 * If it succeeds, the `ADD_TOWN_SUCCESS` action type is dispatched otherwise,
 * the `ADD_TOWN_FAILURE` action type is dispatched.
 * 
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */
export function addTown(token, townData, callback=()=>{}){
    function apiRequest(dispatch, retry=false){
        return apiHttpPOST(TOWNS_URL, tokenConfig(token), townData)
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(addTownSuccess(response.data));
                dispatch(fetchTowns(token));     //we fetch all the users again so as to get all the update
                callback(true)
            }else{
                const errMsg = response.data.error? response.data.error.message:`Request failed with status code ${response.status}`;
                dispatch(addTownFailure(errMsg));
                callback(false)
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(addTownFailure(errMsg));
                callback(false, errMsg)
            }
            console.log("This error occured: ", err)
        })
    }
    return (dispatch)=>{
        dispatch(addTownRequest());
        return apiRequest(dispatch, true);
    }
}