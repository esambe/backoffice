import { createReducer } from '../utility/misc';
import{
    FETCH_ALL_COUNTRIES_REQUEST,
    FETCH_ALL_COUNTRIES_SUCCESS,
    FETCH_ALL_COUNTRIES_FAILURE,

    LOAD_ALL_EXT_COUNTRIES_REQUEST,
    LOAD_ALL_EXT_COUNTRIES_SUCCESS,
    LOAD_ALL_EXT_COUNTRIES_FAILURE,

    ADD_COUNTRY_REQUEST,
    ADD_COUNTRY_SUCCESS,
    ADD_COUNTRY_FAILURE,

    UPDATE_COUNTRY_REQUEST,
    UPDATE_COUNTRY_SUCCESS,
    UPDATE_COUNTRY_FAILURE,

    DELETE_COUNTRY_REQUEST,
    DELETE_COUNTRY_SUCCESS,
    DELETE_COUNTRY_FAILURE
} 
from "../constants/action_types";

const initialState = {
    appCountries: [],
    allCountries:[],

    isFetchingAppCountries: false,
    isLoadedAppCountries: false,

    isFetchingAllCountries: false,
    isLoadedAllCountries: false,

    isAddingCountry: false,
    isAddedCountry: false,

    isUpdatingCountry: false,
    isUpdatedCountry: false,

    isDeletingCountry: false,
    isDeletedCountry: false,
    deletingCountryId: null,
    
    fetchCountriesError: null,
    loadCountriesError: null,
    addCountryError: null,
    updateCountryError: null,
    deleteCountryError:null
    
}

export default createReducer(initialState, {
    [FETCH_ALL_COUNTRIES_REQUEST]: (state)=>({
        ...state,
        isFetchingAppCountries: true,
        isLoadedAppCountries: false,
        fetchCountriesError: null,
    }),
    [FETCH_ALL_COUNTRIES_SUCCESS]: (state, payload)=>({
        ...state,
        isFetchingAppCountries: false,
        isLoadedAppCountries: true,
        appCountries: payload
    }),
    [FETCH_ALL_COUNTRIES_FAILURE]: (state, error)=>({
        ...state,
        isFetchingAppCountries: false,
        isLoadedAppCountries: false,
        fetchCountriesError: error
    }),

    [LOAD_ALL_EXT_COUNTRIES_REQUEST]: (state) =>({
        ...state,
        isFetchingAllCountries:true,
        isLoadedAllCountries: false,
        loadCountriesError: null
    }),
    [LOAD_ALL_EXT_COUNTRIES_SUCCESS]: (state, payload)=>({
        ...state,
        isFetchingAllCountries:false,
        isLoadedAllCountries:true,
        allCountries: payload
    }),
    [LOAD_ALL_EXT_COUNTRIES_FAILURE]: (state, error)=>({
        ...state,
        isFetchingAllCountries:false,
        isLoadedAllCountries:false,
        loadCountriesError: error
    }),

    [ADD_COUNTRY_REQUEST]: (state) =>({
        ...state,
        isAddingCountry:true,
        isAddedCountry: false,
        loadCountriesError: null
    }),
    [ADD_COUNTRY_SUCCESS]: (state, payload)=>({
        ...state,
        isAddingCountry:false,
        isAddedCountry:true
    }),
    [ADD_COUNTRY_FAILURE]: (state, error)=>({
        ...state,
        isAddingCountry:false,
        isAddedCountry:false,
        addCountryError: error
    }),

    [UPDATE_COUNTRY_REQUEST]: (state) =>({
        ...state,
        isUpdatingCountry:true,
        isUpdatedCountry: false,
        updateCountryError: null
    }),
    [UPDATE_COUNTRY_SUCCESS]: (state, payload)=>({
        ...state,
        isUpdatingCountry:false,
        isUpdatedCountry:true
    }),
    [UPDATE_COUNTRY_FAILURE]: (state, error)=>({
        ...state,
        isUpdatingCountry:false,
        isUpdatedCountry:false,
        updateCountryError: error
    }),

    [DELETE_COUNTRY_REQUEST]: (state, countryId) =>({
        ...state,
        isDeletingCountry:true,
        isDeletedCountry: false,
        deletingCountryId: countryId
    }),
    [DELETE_COUNTRY_SUCCESS]: (state, payload)=>({
        ...state,
        isDeletingCountry:false,
        isDeletedCountry:true
    }),
    [DELETE_COUNTRY_FAILURE]: (state, error)=>({
        ...state,
        isDeletingCountry:false,
        isDeletedCountry:false,
        deleteCountryError: error
    })
})