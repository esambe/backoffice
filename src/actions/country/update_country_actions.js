import {tokenConfig, apiHttpPOST, apiHttpPATCH} from "../../utility/request_helper";
import { USERS_URL, COUNTRIES_URL, COUNTRY_URL } from '../../constants/endpoints';
import {
    UPDATE_COUNTRY_REQUEST,
    UPDATE_COUNTRY_SUCCESS,
    UPDATE_COUNTRY_FAILURE
}
from "../../constants/action_types";
import {fetchAppCountries} from "./fetch_country_actions"
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { formatUrl } from "../../utility/misc";

/**
 * Action creator to initiate the process of updating a country
 */
export function updateCountryRequest(){
    return actionCreator(UPDATE_COUNTRY_REQUEST);
}

/**
 * Action creator for failure to update a country
 * @param {string} error The error message describing the failure
 */
export function updateCountryFailure(error){
    return actionCreator(UPDATE_COUNTRY_FAILURE, error)
}

/**
 * Action creator for successfully updating a country
 * @param {object} data 
 */
export function updateCountrySuccess(data){
    return actionCreator(UPDATE_COUNTRY_SUCCESS, data);
}

/**
 * Requests for the update of a country. 
 * If it succeeds, the `UPDATE_COUNTRY_SUCCESS` action type is dispatched otherwise,
 * the `UPDATE_COUNTRY_FAILURE` action type is dispatched.
 * 
 * @param {string} token The request token
 * @param {object} userData Object containing the user data to be saved
 */
export function updateCountry(token, countryData, countryId, callback=()=>{}){
    function apiRequest(dispatch, retry=false){
        return apiHttpPATCH(formatUrl( COUNTRY_URL, null, {id:countryId} ), tokenConfig(token), countryData)
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(updateCountrySuccess(response.data));
                dispatch(fetchAppCountries(token));     //we fetch all the users again so as to get all the update
                callback(true)
            }else{
                const errMsg = response.data.error? response.data.error.message:`Request failed with status code ${response.status}`;
                dispatch(updateCountryFailure(errMsg));
                callback(false, errMsg);
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(updateCountryFailure(errMsg));
                callback(false, errMsg)
            }
            console.log("This error occured: ", err)
        })
    }
    return (dispatch)=>{
        dispatch(updateCountryRequest());
        return apiRequest(dispatch, true);
    }
}