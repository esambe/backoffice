import {apiHttpGET, tokenConfig} from "../../utility/request_helper";
import { USERS_URL } from '../../constants/endpoints';
import {
    FETCH_ALL_USERS_REQUEST,
    FETCH_ALL_USERS_SUCCESS,
    FETCH_ALL_USERS_FAILURE
}
from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator to initiate fetching of all user data
 */
export function fetchAllUsersRequest(){
    return actionCreator(FETCH_ALL_USERS_REQUEST);
}

/**
 * Action creator for failure to fetch all user data   
 * @param {string} error A description of the error that occurred
 */
export function fetchAllUsersFailure(error){
    return actionCreator(FETCH_ALL_USERS_FAILURE, error)
}

/**
 * Action creator for successfully fetching user data
 * @param {object} data an array of all the user data
 */
export function fetchAllUsersSuccess(data){
    return actionCreator(FETCH_ALL_USERS_SUCCESS, data);
}

/**
 * Requests for all user data from the api system and dispatches a `FETCH_ALL_USERS_SUCCESS`
 * if it was successful otherwise, a `FETCH_ALL_USERS_FAILURE` is dispatched
 * @param {string} token the user token
 */
export function fetchAllUsers(token, callback=()=>{}){
    function apiRequest(dispatch, retry=false){
        return apiHttpGET(USERS_URL, tokenConfig(token))
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(fetchAllUsersSuccess(response.data));
                callback(true);
            }else{
                dispatch(fetchAllUsersFailure(`Response failed with status code ${response.status}`));
                callback(false)
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(fetchAllUsersFailure(errMsg));
                callback(false, errMsg)
            }
            console.log("This error occured: ", err)
        })
    }
    return (dispatch)=>{
        dispatch(fetchAllUsersRequest())
        return apiRequest(dispatch, true);
    }
}