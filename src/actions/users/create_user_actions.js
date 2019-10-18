import {tokenConfig, apiHttpPOST} from "../../utility/request_helper";
import { USERS_URL } from '../../constants/endpoints';
import {
    CREATE_NEW_USER_REQUEST,
    CREATE_NEW_USER_SUCCESS,
    CREATE_NEW_USER_FAILURE
}
from "../../constants/action_types";
import {fetchAllUsers} from "./fetch_user_actions"
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator for New User creation request
 */
export function createUserRequest(){
    return actionCreator(CREATE_NEW_USER_REQUEST);
}

/**
 * Action creator for failure to create a new user
 * @param {string} error The error message describing the failure
 */
export function createUserFailure(error){
    return actionCreator(CREATE_NEW_USER_FAILURE, error)
}

/**
 * Action creator for successfully creating a user
 * @param {object} data 
 */
export function createUserSuccess(data){
    return actionCreator(CREATE_NEW_USER_SUCCESS, data);
}

/**
 * Requests for the creation of a new user given the token and the user data. 
 * If it succeeds, the `CREATE_NEW_USER_SUCCESS` action type is dispatched otherwise,
 * the `CREATE_NEW_USER_FAILURE` action type is dispatched.
 * 
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */
export function createNewUser(token, userData, callback=()=>{}){
    function apiRequest(dispatch, retry=false){
        return apiHttpPOST(USERS_URL, tokenConfig(token), {...userData})
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(createUserSuccess(response.data));
                dispatch(fetchAllUsers(token));     //we fetch all the users again so as to get all the update
                callback(true)
            }else{
                const errMsg = response.data.error? response.data.error.message:`Request failed with status code ${response.status}`;
                dispatch(createUserFailure(errMsg));
                callback(false, errMsg)
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(createUserFailure(errMsg));
                callback(false, errMsg)
            }
            console.log("This error occured: ", err)
        })
    }
    return (dispatch)=>{
        dispatch(createUserRequest());
        return apiRequest(dispatch, true);
    }
}