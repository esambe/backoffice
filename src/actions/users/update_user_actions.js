import {tokenConfig, apiHttpPUT, apiHttpPATCH} from "../../utility/request_helper";
import {formatUrl} from "../../utility/misc";
import { USER_URL } from '../../constants/endpoints';
import {
    UPDATE_USER_DATA_REQUEST,
    UPDATE_USER_DATA_SUCCESS,
    UPDATE_USER_DATA_FAILURE
}
from "../../constants/action_types";
import {fetchAllUsers} from "./fetch_user_actions"
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator for initiating a user data update
 */
export function updateUserDataRequest(){
    return actionCreator(UPDATE_USER_DATA_REQUEST);
}

/**
 * Action creator for failure to update user data
 * @param {string} error The error message describing the failure
 */
export function updateUserDataFailure(error){
    return actionCreator(UPDATE_USER_DATA_FAILURE, error)
}

/**
 * Action creator for successfully updating a user's data
 * @param {object} data 
 */
export function updateUserDataSuccess(data){
    return actionCreator(UPDATE_USER_DATA_SUCCESS, data);
}

/**
 * Action to update a user's data, given the token, the new data and the user's id.
 * If it succeeds, the `UPDATE_USER_DATA_SUCCESS` action type is dispatched otherwise,
 * the `UPDATE_USER_DATA_FAILURE` action type is dispatched.
 * 
 * @param {string} token The request token
 * @param {string} userData The user data to be updated with
 * @param {string} userId The user's id
 */
export function updateUserData(token, userData, userId, callback=()=>{}){
    function apiRequest(dispatch, retry=false){
        return apiHttpPATCH(formatUrl( USER_URL, null, {id:userId} ), tokenConfig(token), {...userData})
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(updateUserDataSuccess(response.data));
                dispatch(fetchAllUsers(token));     //we fetch all the users again so as to get all the update
                callback(true)
            }else{
                const errMsg = response.data.error? response.data.error.message:`Request failed with status code ${response.status}`;
                dispatch(updateUserDataFailure(errMsg));
                callback(false, errMsg)
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(updateUserDataFailure(errMsg));
                callback(false, errMsg);
            }
            console.log("This error occured: ", err)
        })
    }

    return (dispatch)=>{
        dispatch(updateUserDataRequest());
        return apiRequest(dispatch, true);
    }
}