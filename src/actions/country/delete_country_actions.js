import {tokenConfig, apiHttpDELETE} from "../../utility/request_helper";
import {formatUrl} from "../../utility/misc";
import { USER_URL, COUNTRY_URL } from '../../constants/endpoints';
import {
    DELETE_COUNTRY_REQUEST,
    DELETE_COUNTRY_SUCCESS,
    DELETE_COUNTRY_FAILURE
}
from "../../constants/action_types";
import { actionCreator, reAuthenticateUser } from "../action_helpers";
import { fetchAppCountries } from "./fetch_country_actions";

/**
 * Action creator for country deletion
 */
export function deleteCountryRequest(countryId){
    return actionCreator(DELETE_COUNTRY_REQUEST, countryId);
}

/**
 * Action creator for failure to delete country
 * @param {string} error The error message describing the failure
 */
export function deleteCountryFailure(error){
    return actionCreator(DELETE_COUNTRY_FAILURE, error)
}

/**
 * Action creator for successfully deleting a country
 * @param {object} data 
 */
export function deleteCountrySuccess(data){
    return actionCreator(DELETE_COUNTRY_SUCCESS, data);
}

/**
 * Action to delete country, given the token and the country id.
 * If it succeeds, the `DELETE_COUNTRY_SUCCESS` action type is dispatched otherwise,
 * the `DELETE_COUNTRY_FAILURE` action type is dispatched.
 * 
 * @param {string} token The request token
 * @param {string} userId The user's id
 */
export function deleteCountry(token, countryId, callback=()=>{}){
    function apiRequest(dispatch, retry=false){
        return apiHttpDELETE(formatUrl( COUNTRY_URL, null, {id:countryId} ), tokenConfig(token))
        .then(response=>{
            if(response.status>=200 && response.status<=299){
                dispatch(deleteCountrySuccess(countryId));
                dispatch(fetchAppCountries(token));     //we fetch all the users again so as to get all the update
                callback(true)
            }else{
                const errMsg = response.data.error? response.data.error.message:`Request failed with status code ${response.status}`;
                dispatch(deleteCountryFailure(errMsg));
                callback(false, errMsg);
            }
        }).catch(err=>{
            if(err && err.response && err.response.status == 401 && retry){
                reAuthenticateUser(()=>apiRequest(dispatch, false), dispatch)
            }else{
                const errMsg = err.response && err.response.data? err.response.data.error.message:err.message;
                dispatch(deleteCountryFailure(errMsg));
                callback(false, errMsg);
            }
            console.log("This error occured: ", err)
        })
    }
    return (dispatch)=>{
        dispatch(deleteCountryRequest(countryId));
        return apiRequest(dispatch, true);
    }
}