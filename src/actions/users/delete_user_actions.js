import {tokenConfig, apiHttpDELETE} from "../../utility/request_helper";
import {formatUrl} from "../../utility/misc";
import { USER_URL } from '../../constants/endpoints';
import {
    DELETE_USER_DATA_REQUEST,
    DELETE_USER_DATA_SUCCESS,
    DELETE_USER_DATA_FAILURE
}
from "../../constants/action_types";
import {fetchAllUsers} from "./fetch_user_actions"
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator for user data deletion
 */
export function deleteUserDataRequest(userId){
    return actionCreator(DELETE_USER_DATA_REQUEST, userId);
}

/**
 * Action creator for failure to delete user data
 * @param {string} error The error message describing the failure
 */
export function deleteUserDataFailure(error){
    return actionCreator(DELETE_USER_DATA_FAILURE, error)
}

/**
 * Action creator for successfully deleting a user's data
 * @param {object} data 
 */
export function deleteUserDataSuccess(data){
    return actionCreator(DELETE_USER_DATA_SUCCESS, data);
}

/**
 * Action to delete user's data, given the token and the user's id.
 * If it succeeds, the `DELETE_USER_DATA_SUCCESS` action type is dispatched otherwise,
 * the `DELETE_USER_DATA_FAILURE` action type is dispatched.
 * 
 * @param {string} token The request token
 * @param {string} userId The user's id
 */
export function deleteUserData(token, userId, callback=()=>{}){
    function apiRequest(dispatch, retry=false){
        return apiHttpDELETE(formatUrl( USER_URL, null, {id:userId} ), tokenConfig(token))
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(deleteUserDataSuccess(userId));
                dispatch(fetchAllUsers(token));     //we fetch all the users again so as to get all the update
                callback(true)
            }else{
                const errMsg = response.data.error? response.data.error.message:`Request failed with status code ${response.status}`;
                dispatch(deleteUserDataFailure(errMsg));
                callback(false, errMsg);
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(deleteUserDataFailure(errMsg));
                callback(false, errMsg);
            }
            console.log("This error occured: ", err)
        })
    }
    return (dispatch)=>{
        dispatch(deleteUserDataRequest(userId));
        return apiRequest(dispatch, true);
    }
}