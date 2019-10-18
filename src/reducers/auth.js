import { createReducer } from '../utility/misc';
import{
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE
} 
from "../constants/action_types";

const initialState = {
    isAuthenticatingUser: false,
    isUserAuthenticated: false,
    userToken: null,
    userId:null,
    userName: null,
    userPassword: null,
    authError: null
}

export default createReducer(initialState, {
    [USER_LOGIN_REQUEST]: (state)=>({
        ...state,
        isAuthenticatingUser: true,
        isUserAuthenticated: false,
        authError: null
    }),

    [USER_LOGIN_SUCCESS]: (state, payload)=>({
        ...state,
        isAuthenticatingUser: false,
        isUserAuthenticated: true,
        userToken: payload.token,
        userId: payload.userId? payload.userId: state.userId,
        userName: payload.username? payload.username:state.userName,
        userPassword: payload.password? payload.password: state.userPassword
    }),
    
    [USER_LOGIN_FAILURE]: (state, errors)=>({
        ...state,
        isAuthenticatingUser: false,
        isUserAuthenticated: false,
        authError: errors
    })
})