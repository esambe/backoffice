import {apiHttpGET, tokenConfig} from "../../utility/request_helper";
import { USER_ROLES } from '../../constants/endpoints';
import {
    FETCH_ALL_ROLES_REQUEST,
    FETCH_ALL_ROLES_SUCCESS,
    FETCH_ALL_ROLES_FAILURE,
}
from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";


/**
 * Action creator to initiate fetching of all the Role data
 */
export function fetchAllRolesRequest(){
    return actionCreator(FETCH_ALL_ROLES_REQUEST);
}

/**
 * Action creator for failure to fetch all Role data   
 * @param {string} error A description of the error that occurred
 */
export function fetchAllRolesFailure(error){
    return actionCreator(FETCH_ALL_ROLES_FAILURE, error)
}


/**
 * Action creator for successfully fetching Role data
 * @param {object} data an array of all the Role data
 */
export function fetchAllRolesSuccess(data){
    return actionCreator(FETCH_ALL_ROLES_SUCCESS, data);
}


/**
 * Requests for all the Role data from the api system and dispatches a `FETCH_ALL_ROLES_SUCCESS`
 * if it was successful otherwise, a `FETCH_ALL_ROLES_FAILURE` is dispatched
 * @param {string} token the user token
 */
export function fetchAppRoles(token){
    function apiRequest(dispatch, retry=false){
        return apiHttpGET(USER_ROLES, tokenConfig(token))
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(fetchAllRolesSuccess(response.data));
            }else{
                dispatch(fetchAllRolesFailure(`Response failed with status code ${response.status}`));
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(fetchAllRolesFailure(errMsg));
            }
            console.log("This error occured: ", err)
        })
    }
    return (dispatch)=>{
        dispatch(fetchAllRolesRequest())
        return apiRequest(dispatch, true);
    }
}
