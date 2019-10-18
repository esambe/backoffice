import {tokenConfig, apiHttpPOST} from "../../utility/request_helper";
import { USERS_URL, COUNTRIES_URL } from '../../constants/endpoints';
import {
    ADD_COUNTRY_REQUEST,
    ADD_COUNTRY_SUCCESS,
    ADD_COUNTRY_FAILURE
}
from "../../constants/action_types";
import {fetchAppCountries} from "./fetch_country_actions"
import { actionCreator, reAuthenticateUser } from "../action_helpers";

/**
 * Action creator to initiate the process of adding a new country
 */
export function addCountryRequest(){
    return actionCreator(ADD_COUNTRY_REQUEST);
}

/**
 * Action creator for failure to add a new country
 * @param {string} error The error message describing the failure
 */
export function addCountryFailure(error){
    return actionCreator(ADD_COUNTRY_FAILURE, error)
}

/**
 * Action creator for successfully adding a new country
 * @param {object} data 
 */
export function addCountrySuccess(data){
    return actionCreator(ADD_COUNTRY_SUCCESS, data);
}

/**
 * Requests for the addition of a country. 
 * If it succeeds, the `ADD_COUNTRY_SUCCESS` action type is dispatched otherwise,
 * the `ADD_COUNTRY_FAILURE` action type is dispatched.
 * 
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */
export function addCountry(token, countryData, callback=()=>{}){
    function apiRequest(dispatch, retry=false){
        return apiHttpPOST(COUNTRIES_URL, tokenConfig(token), countryData)
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(addCountrySuccess(response.data));
                dispatch(fetchAppCountries(token));     //we fetch all the users again so as to get all the update
                callback(true)
            }else{
                const errMsg = response.data.error? response.data.error.message:`Request failed with status code ${response.status}`;
                dispatch(addCountryFailure(errMsg));
                callback(false)
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(addCountryFailure(errMsg));
                callback(false, errMsg)
            }
            console.log("This error occured: ", err)
        })
    }
    return (dispatch)=>{
        dispatch(addCountryRequest());
        return apiRequest(dispatch, true);
    }
}