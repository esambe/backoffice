import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import customizer from "./customizer";
import auth from "./auth";
import users from "./users";
import countries from "./countries";
import towns from "./towns";
import pickup_areas from "./pickup_areas";
import drivers from "./drivers";
import taxis from "./taxis";
import taxi_drivers from "./taxi_drivers";
import drivers_app from "./drivers_app";
import subscription_plans from "./subscription_plans";
import prices from "./prices";
import clients from './clients';
import requests from './requests';

/**
 * Combines all reducers to return a single which is then used as
 * part of the store's configuration
 */
const rootReducer = combineReducers({
  routing: routerReducer,
  toastr: toastrReducer,

  /* place your reducers here */
  customizer,
  auth,
  users,
  countries,
  towns,
  pickup_areas,
  drivers,
  taxis,
  taxi_drivers,
  drivers_app,
  subscription_plans,
  prices,
  clients,
  requests
});

export default rootReducer;
