import { createReducer } from '../utility/misc';
import{
    FETCH_PICKUP_AREAS_REQUEST,
    FETCH_PICKUP_AREAS_SUCCESS,
    FETCH_PICKUP_AREAS_FAILURE,

    ADD_PICKUP_AREA_REQUEST,
    ADD_PICKUP_AREA_SUCCESS,
    ADD_PICKUP_AREA_FAILURE, 

    UPDATE_PICKUP_AREA_REQUEST,
    UPDATE_PICKUP_AREA_SUCCESS,
    UPDATE_PICKUP_AREA_FAILURE,

    DELETE_PICKUP_AREA_REQUEST,
    DELETE_PICKUP_AREA_SUCCESS,
    DELETE_PICKUP_AREA_FAILURE
} 
from "../constants/action_types";

const initialState = {
    pickupAreas: [],
    pickupAreasTownId:null,
    pickupAreasCountryId:null, 

    isFetchingPickupAreas: false,
    isLoadedPickupAreas: false,

    isAddingPickupArea: false,
    isAddedPickupArea:false,
    
    isUpdatingPickupArea: false,
    isUpdatedPickupArea: false,
    
    isDeletingPickupArea: false,
    isDeletedPickupArea:false,
    deletingPickupAreaId:null,
    
    addPickupAreaError: null,
    fetchPickupAreasError: null,
    updatePickupAreaError: null,
    deletePickupAreaError:null
}

export default createReducer(initialState, {
    [FETCH_PICKUP_AREAS_REQUEST]: (state,  townId)=>({
        ...state,
        isFetchingPickupAreas: true,
        isLoadedPickupAreas: false,
        fetchPickupAreasError: null,
    }),
    [FETCH_PICKUP_AREAS_SUCCESS]: (state, payload)=>({
        ...state,
        isFetchingPickupAreas: false,
        isLoadedPickupAreas: true,
        pickupAreas: payload
    }),
    [FETCH_PICKUP_AREAS_FAILURE]: (state, error)=>({
        ...state,
        isFetchingPickupAreas: false,
        isLoadedPickupAreas: false,
        fetchPickupAreasError: error
    }),

    [ADD_PICKUP_AREA_REQUEST]: (state) =>({
        ...state,
        isAddingPickupArea:true,
        isAddedPickupArea: false,
        addPickupAreaError: null
    }),
    [ADD_PICKUP_AREA_SUCCESS]: (state, payload)=>({
        ...state,
        isAddingPickupArea:false,
        isAddedPickupArea:true
    }),
    [ADD_PICKUP_AREA_FAILURE]: (state, error)=>({
        ...state,
        isAddingPickupArea:false,
        isAddedPickupArea:false,
        addPickupAreaError: error
    }),

    [UPDATE_PICKUP_AREA_REQUEST]: (state) =>({
        ...state,
        isUpdatingPickupArea:true,
        isUpdatedPickupArea: false,
        updatePickupAreaError: null
    }),
    [UPDATE_PICKUP_AREA_SUCCESS]: (state, payload)=>({
        ...state,
        isUpdatingPickupArea:false,
        isUpdatedPickupArea:true
    }),
    [UPDATE_PICKUP_AREA_FAILURE]: (state, error)=>({
        ...state,
        isUpdatingPickupArea:false,
        isUpdatedPickupArea:false,
        updatePickupAreaError: error
    }),

    [DELETE_PICKUP_AREA_REQUEST]: (state, pickupId) =>({
        ...state,
        isDeletingPickupArea:true,
        isDeletedPickupArea:false,
        deletingPickupAreaId:pickupId,
        deletePickupAreaError:null
    }),
    [DELETE_PICKUP_AREA_SUCCESS]: (state, payload)=>({
        ...state,
        isDeletingPickupArea:false,
        isDeletedPickupArea:true
    }),
    [DELETE_PICKUP_AREA_FAILURE]: (state, error)=>({
        ...state,
        isDeletingPickupArea:false,
        isDeletedPickupArea:false,
        deletePickupAreaError: error
    })
})