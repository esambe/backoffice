import {apiHttpPOST} from "../../utility/request_helper";
import { GET_TOKEN_URL } from '../../constants/endpoints';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE
}
from "../../constants/action_types";
import {LOCAL_STORAGE_TOKEN_KEY, LOCAL_STORAGE_PASSWORD_KEY, LOCAL_STORAGE_SECRET, LOCAL_STORAGE_USERNAME_KEY, LOGIN_VIEW_ROUTE} from "../../constants/app_utils"
import sjcl from "sjcl"
import { actionCreator } from "../action_helpers";

/**
 * Redirects the user to the provided route. If an optional token is provided, 
 * this token is saved to the local storage.
 * @param {string} redirectPath The route to redirect the user to.
 * @param {string} token Token to be saved if `rememberUser` is set to true
 */
export function redirectUser(redirectPath, token=null){
    if(token){
        window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    }
    if(redirectPath){
        window.browserHistory.push(redirectPath);
    }
}

/**
 * Saves the username and password to the local storage.
 * Equally encrypts these credentials before saving.
 * @param {string} username the username to be saved
 * @param {string} password the password to be saved
 */
export function saveUsernameAndPassword(username, password){
    const encryptedPassword = sjcl.encrypt(LOCAL_STORAGE_SECRET, password);
    const encryptedUsername = sjcl.encrypt(LOCAL_STORAGE_SECRET, username);

    localStorage.setItem(LOCAL_STORAGE_PASSWORD_KEY, encryptedPassword);
    localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, encryptedUsername);
}

/**
 * ActionCreator to dispatch a login success to the store
 * @param {string} token The user token
 * @param {string} userId The user's Id
 * @param {string} username the user's username
 * @param {string } password the user's password
 */
export function loginUserSuccess(token, userId, username, password){
    setCurrentContextUser(userId, username, password);
    return actionCreator(USER_LOGIN_SUCCESS, {token, userId, username, password});
}

/**
 * Action creator to Dispatch the login failure action to the store. This is equally used
 * to log a user out so as to update the necessary state changes which prevents 
 * further access to non-authenticated components
 * @param {string} errorMsg The reason why the login failed.
 */
export function loginUserFailure(errorMsg){
    window.localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    return actionCreator(USER_LOGIN_FAILURE, errorMsg);
}

/**
 * Logs a user out. **NOTE:** `This method requires the dispatcher function to successfully log the user out.`
 * @param {dispatcher} dispatch An optional but recommended dispatcher which is used dispatch the login failure action
 */
export function logoutUser(dispatch){
    window.localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    window.localStorage.removeItem(LOCAL_STORAGE_PASSWORD_KEY);
    window.localStorage.removeItem(LOCAL_STORAGE_USERNAME_KEY);
    if(dispatch){
        dispatch( loginUserFailure() )
        window.browserHistory.push(LOGIN_VIEW_ROUTE)
    }else{
        return actionCreator(USER_LOGIN_FAILURE)
    }
}

/**
 * Attempts to log the user into the system with the provided parameters.
 * <p>Dispatches `USER_LOGIN_REQUEST` action will the login procedure is about to begin.</p>
 * <p>Dispatches `USER_LOGIN_SUCCESS` if the login was successful.</p> 
 * <p>Dispatches `USER_LOGIN_FAILURE` if the login failed or an error occurred in the process</p>
 * @param {string} username 
 * @param {string} password 
 */
export function loginUser(username, password, rememberUser, redirectPath){
    const loginErrorMessage = "Username or Password is incorrect";
    return (dispatch)=>{
        dispatch( actionCreator(USER_LOGIN_REQUEST) )
        apiHttpPOST(GET_TOKEN_URL, null, {
            username,
            password,
        }).then(response =>{
            if(response.status >= 200 && response.status<=299){
                dispatch( loginUserSuccess( response.data.id, response.data.userId, username, password ) );
                redirectUser(redirectPath, rememberUser?response.data.id:null);
                if(rememberUser){
                    saveUsernameAndPassword(username, password);
                }
            }else{
                dispatch( loginUserFailure( loginErrorMessage ) );
            }
        }).catch(err=>{
            dispatch( loginUserFailure( `${err.response && err.response.status == 401? loginErrorMessage : err.message}` ) );
        });
    };
}


function setCurrentContextUser(userId, username, password){
    window.currentCtx.cred = {userId, username, password}
}   
