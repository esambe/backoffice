import {apiHttpGET, tokenConfig} from "../../utility/request_helper";
import { USERS_URL, ALL_COUNTRIES_ENDPOINT, COUNTRIES_URL } from '../../constants/endpoints';
import {
    FETCH_ALL_COUNTRIES_REQUEST,
    FETCH_ALL_COUNTRIES_SUCCESS,
    FETCH_ALL_COUNTRIES_FAILURE,
    LOAD_ALL_EXT_COUNTRIES_REQUEST,
    LOAD_ALL_EXT_COUNTRIES_SUCCESS,
    LOAD_ALL_EXT_COUNTRIES_FAILURE
}
from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";


/**
 * Action creator to initiate fetching of all the country data
 */
export function fetchAllCountriesRequest(){
    return actionCreator(FETCH_ALL_COUNTRIES_REQUEST);
}

/**
 * Action creator for failure to fetch all country data   
 * @param {string} error A description of the error that occurred
 */
export function fetchAllCountriesFailure(error){
    return actionCreator(FETCH_ALL_COUNTRIES_FAILURE, error)
}


/**
 * Action creator for successfully fetching country data
 * @param {object} data an array of all the country data
 */
export function fetchAllCountriesSuccess(data){
    return actionCreator(FETCH_ALL_COUNTRIES_SUCCESS, data);
}

/**
 * Action creator to initiate the loading of all the countries to be used in adding countries into the app.
 */
export function loadExtCountriesRequest(){
    return actionCreator(LOAD_ALL_EXT_COUNTRIES_REQUEST);
}

/**
 * Action creator for failure to load all the countries from the external endpoint   
 * @param {string} error A description of the error that occurred
 */
export function loadExtCountriesFailure(error){
    return actionCreator(LOAD_ALL_EXT_COUNTRIES_FAILURE, error)
}

/**
 * Action creator for successfully loading all external countries
 * @param {object} data an array of all the countries mapped by english and french names
 */
export function loadExtCountriesSuccess(data){
    return actionCreator(LOAD_ALL_EXT_COUNTRIES_SUCCESS, data);
}


/**
 * Requests for all the country data from the api system and dispatches a `FETCH_ALL_COUNTRIES_SUCCESS`
 * if it was successful otherwise, a `FETCH_ALL_COUNTRIES_FAILURE` is dispatched
 * @param {string} token the user token
 */
export function fetchAppCountries(token){
    function apiRequest(dispatch, retry=false){
        return apiHttpGET(COUNTRIES_URL, tokenConfig(token))
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(fetchAllCountriesSuccess(response.data));
            }else{
                dispatch(fetchAllCountriesFailure(`Response failed with status code ${response.status}`));
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(fetchAllCountriesFailure(errMsg));
            }
            console.log("This error occured: ", err)
        })
    }
    return (dispatch)=>{
        dispatch(fetchAllCountriesRequest())
        return apiRequest(dispatch, true);
    }
}


/**
 * Requests for all the external countries from a remote country listing api system and dispatches a `LOAD_ALL_EXT_COUNTRIES_SUCCESS`
 * if it was successful otherwise, a `LOAD_ALL_EXT_COUNTRIES_FAILURE` is dispatched
 * @param {string} token the user token
 */
export function loadExtCountries(){
    return (dispatch)=>{
        dispatch(loadExtCountriesRequest())
        console.log("starting request")
        return apiHttpGET(ALL_COUNTRIES_ENDPOINT)
                .then(response=>{
                    if(response.status>=200 && response.status<=299){
                        dispatch(loadExtCountriesSuccess(response.data.map(elt=>({
                                en: elt.name,
                                fr: elt.translations.fr?elt.translations.fr:elt.name,
                                flag: elt.flag,
                                countryCode: `${elt.callingCodes[0]?"+"+elt.callingCodes[0]:""}`
                            })
                        )))
                    }else{
                        dispatch(loadExtCountriesFailure(`Response failed with status code ${response.status}`));
                    }
                }).catch(err=>{
                    const errMsg = err.message;
                    dispatch(loadExtCountriesFailure(errMsg));
                    
                    console.log("This error occured: ", err)
                })
    }
}
