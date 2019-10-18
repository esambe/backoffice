import { GET_TOKEN_URL } from "../constants/endpoints";
import { apiHttpPOST } from "../utility/request_helper";
import { loginUserSuccess } from "./auth/login_actions";

export function actionCreator(type, payload){
    return {
        type, payload
    }
}

/**
 * Reauthenticates the currently logged in user to obtain new tokens.
 * @param {function} callback The callback function to invoke after attempting to reauthenticate
 */
export function reAuthenticateUser(callback=()=>{}, dispatch){
    apiHttpPOST(GET_TOKEN_URL, null, {
        username: window.currentCtx.cred.username,
        password: window.currentCtx.cred.password,
    }).then(response =>{
        if(response.status >= 200 && response.status<=299){
            if(dispatch){
                dispatch( loginUserSuccess( response.data.id, response.data.userId, window.currentCtx.cred.username, window.currentCtx.cred.password ) );
            }
            callback(true)
        }else{
            if(dispatch){
                dispatch( loginUserFailure() );
            }
            callback( false, "Request failed with status code "+response.status )
        }
    }).catch(err=>{
        if(dispatch){
            dispatch( loginUserFailure() );
        }
        callback( false, err.message )
    });
}