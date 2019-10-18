import { createReducer } from "../utility/misc";
import {
  FETCH_DRIVER_APP_FAILURE,
  FETCH_DRIVER_APP_REQUEST,
  FETCH_DRIVER_APP_SUCCESS
} from "../constants/action_types";

const initialState = {
  driversApp: [],
  driversTownId: null,
  driversCountryId: null,

  isFetchingDriversApp: false,
  isLoadedDriversApp: false,

  fetchDriversAppError: null
};

export default createReducer(initialState, {
  [FETCH_DRIVER_APP_REQUEST]: state => ({
    ...state,
    isFetchingDriversApp: true,
    isLoadedDriversApp: false,
    fetchDriversAppError: null
  }),
  [FETCH_DRIVER_APP_SUCCESS]: (state, payload) => ({
    ...state,
    isFetchingDriversApp: false,
    isLoadedDriversApp: true,
    driversApp: payload
  }),
  [FETCH_DRIVER_APP_FAILURE]: (state, error) => ({
    ...state,
    isFetchingDriversApp: false,
    isLoadedDriversApp: false,
    fetchDriversAppError: error
  })
});
