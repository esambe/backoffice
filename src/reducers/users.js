import { createReducer } from '../utility/misc';
import{
    FETCH_ALL_USERS_REQUEST,
    FETCH_ALL_USERS_SUCCESS,
    FETCH_ALL_USERS_FAILURE,

    CREATE_NEW_USER_REQUEST,
    CREATE_NEW_USER_SUCCESS,
    CREATE_NEW_USER_FAILURE,

    UPDATE_USER_DATA_REQUEST,
    UPDATE_USER_DATA_SUCCESS,
    UPDATE_USER_DATA_FAILURE,

    DELETE_USER_DATA_REQUEST,
    DELETE_USER_DATA_SUCCESS,
    DELETE_USER_DATA_FAILURE,
} 
from "../constants/action_types";

const initialState = {
    allUsers: [],
    deletingUserId:null, 

    isFetchingUsers: false,
    isLoadedUsers: false,

    isCreatingUser: false,
    isCreatedUser:false,
    
    isUpdatingUser: false,
    isUpdatedUser: false,
    
    isDeletingUser: false,
    isDeletedUser:false,
    
    createUserError: null,
    fetchUsersError: null,
    updateUserError: null,
    deleteUserError:null
}

export default createReducer(initialState, {
    [FETCH_ALL_USERS_REQUEST]: (state)=>({
        ...state,
        isFetchingUsers: true,
        isLoadedUsers: false,
        fetchUsersError: null,
    }),
    [FETCH_ALL_USERS_SUCCESS]: (state, payload)=>({
        ...state,
        isFetchingUsers: false,
        isLoadedUsers: true,
        allUsers: payload
    }),
    [FETCH_ALL_USERS_FAILURE]: (state, error)=>({
        ...state,
        isFetchingUsers: false,
        isLoadedUsers: false,
        fetchUsersError: error
    }),

    [CREATE_NEW_USER_REQUEST]: (state) =>({
        ...state,
        isCreatingUser:true,
        isCreatedUser: false,
        createUserError: null
    }),
    [CREATE_NEW_USER_SUCCESS]: (state, payload)=>({
        ...state,
        isCreatingUser:false,
        isCreatedUser:true
    }),
    [CREATE_NEW_USER_FAILURE]: (state, error)=>({
        ...state,
        isCreatingUser:false,
        isCreatedUser:false,
        createUserError: error
    }),

    [UPDATE_USER_DATA_REQUEST]: (state) =>({
        ...state,
        isUpdatingUser:true,
        isUpdatedUser: false,
        updateUserError: null
    }),
    [UPDATE_USER_DATA_SUCCESS]: (state, payload)=>({
        ...state,
        isUpdatingUser:false,
        isUpdatedUser:true
    }),
    [UPDATE_USER_DATA_FAILURE]: (state, error)=>({
        ...state,
        isUpdatingUser:false,
        isUpdatedUser:false,
        updateUserError: error
    }),

    [DELETE_USER_DATA_REQUEST]: (state, useId) =>({
        ...state,
        isDeletingUser:true,
        isDeletedUser:false,
        deletingUserId:useId,
        deleteUserError:null
    }),
    [DELETE_USER_DATA_SUCCESS]: (state, payload)=>({
        ...state,
        isDeletingUser:false,
        isDeletedUser:true
    }),
    [DELETE_USER_DATA_FAILURE]: (state, error)=>({
        ...state,
        isDeletingUser:false,
        isDeletedUser:false,
        deleteUserError: error
    })
})