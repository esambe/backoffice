import { createReducer } from '../utility/misc';

import{
    FETCH_ALL_ROLES_REQUEST,
    FETCH_ALL_ROLES_SUCCESS,
    FETCH_ALL_ROLES_FAILURE
} 
from "../constants/action_types";

const initialState = {
    appRoles: [],

    isFetchingAppRoles: false,
    isLoadedAppRoles: false,

    // isFetchingAllRoles: false,
    // isLoadedAllRoles: false,
    
    fetchRolesError: null,
    loadRolesError: null
    
}

export default createReducer(initialState, {
    [FETCH_ALL_ROLES_REQUEST]: (state)=>({
        ...state,
        isFetchingAppRoles: true,
        isLoadedAppRoles: false,
        fetchRolesError: null,
    }),
    [FETCH_ALL_ROLES_SUCCESS]: (state, payload)=>({
        ...state,
        isFetchingAppRoles: false,
        isLoadedAppRoles: true,
        appRoles: payload
    }),
    [FETCH_ALL_ROLES_FAILURE]: (state, error)=>({
        ...state,
        isFetchingAppRoles: false,
        isLoadedAppRoles: false,
        fetchRolesError: error
    })
   
})