import { createReducer } from '../utility/misc';
import{
    FETCH_TOWNS_REQUEST,
    FETCH_TOWNS_SUCCESS,
    FETCH_TOWNS_FAILURE,

    ADD_TOWN_REQUEST,
    ADD_TOWN_SUCCESS,
    ADD_TOWN_FAILURE,

    UPDATE_TOWN_REQUEST,
    UPDATE_TOWN_SUCCESS,
    UPDATE_TOWN_FAILURE,

    DELETE_TOWN_REQUEST,
    DELETE_TOWN_SUCCESS,
    DELETE_TOWN_FAILURE,
} 
from "../constants/action_types";

const initialState = {
    towns: [],
    townsCountryId:null, 

    isFetchingTowns: false,
    isLoadedTowns: false,

    isAddingTown: false,
    isAddedTown:false,
    
    isUpdatingTown: false,
    isUpdatedTown: false,
    
    isDeletingTown: false,
    isDeletedTown:false,
    deletingTownId:null,
    
    addTownError: null,
    fetchTownsError: null,
    updateTownError: null,
    deleteTownError:null
}

export default createReducer(initialState, {
    [FETCH_TOWNS_REQUEST]: (state, countryId)=>({
        ...state,
        isFetchingTowns: true,
        isLoadedTowns: false,
        fetchTownsError: null,
    }),
    [FETCH_TOWNS_SUCCESS]: (state, payload)=>({
        ...state,
        isFetchingTowns: false,
        isLoadedTowns: true,
        towns: payload
    }),
    [FETCH_TOWNS_FAILURE]: (state, error)=>({
        ...state,
        isFetchingTowns: false,
        isLoadedTowns: false,
        fetchTownsError: error
    }),

    [ADD_TOWN_REQUEST]: (state) =>({
        ...state,
        isAddingTown:true,
        isAddedTown: false,
        addTownError: null
    }),
    [ADD_TOWN_SUCCESS]: (state, payload)=>({
        ...state,
        isAddingTown:false,
        isAddedTown:true
    }),
    [ADD_TOWN_FAILURE]: (state, error)=>({
        ...state,
        isAddingTown:false,
        isAddedTown:false,
        addTownError: error
    }),

    [UPDATE_TOWN_REQUEST]: (state) =>({
        ...state,
        isUpdatingTown:true,
        isUpdatedTown: false,
        updateTownError: null
    }),
    [UPDATE_TOWN_SUCCESS]: (state, payload)=>({
        ...state,
        isUpdatingTown:false,
        isUpdatedTown:true
    }),
    [UPDATE_TOWN_FAILURE]: (state, error)=>({
        ...state,
        isUpdatingTown:false,
        isUpdatedTown:false,
        updateTownError: error
    }),

    [DELETE_TOWN_REQUEST]: (state, townId) =>({
        ...state,
        isDeletingTown:true,
        isDeletedTown:false,
        deletingTownId:townId,
        deleteTownError:null
    }),
    [DELETE_TOWN_SUCCESS]: (state, payload)=>({
        ...state,
        isDeletingTown:false,
        isDeletedTown:true
    }),
    [DELETE_TOWN_FAILURE]: (state, error)=>({
        ...state,
        isDeletingTown:false,
        isDeletedTown:false,
        deleteTownError: error
    })
})