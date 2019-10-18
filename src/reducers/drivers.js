import { createReducer } from "../utility/misc";
import {
  FETCH_DRIVER_REQUEST,
  FETCH_DRIVER_SUCCESS,
  FETCH_DRIVERS_FAILURE,
  ADD_DRIVER_REQUEST,
  ADD_DRIVER_SUCCESS,
  ADD_DRIVER_FAILURE,
  UPDATE_DRIVER_REQUEST,
  UPDATE_DRIVER_SUCCESS,
  UPDATE_DRIVER_FAILURE,
  DELETE_DRIVER_REQUEST,
  DELETE_DRIVER_SUCCESS,
  DELETE_DRIVER_FAILURE
} from "../constants/action_types";

const initialState = {
  drivers: [],
  driversTownId: null,
  driversCountryId: null,

  isFetchingDrivers: false,
  isLoadedDrivers: false,

  isAddingDriver: false,
  isAddedDriver: false,

  isUpdatingDriver: false,
  isUpdatedDriver: false,

  isDeletingDriver: false,
  isDeletedDriver: false,
  deletingDriverId: null,

  addDriverError: null,
  fetchDriversError: null,
  updateDriverError: null,
  deleteDriverError: null
};

export default createReducer(initialState, {
  [FETCH_DRIVER_REQUEST]: state => ({
    ...state,
    isFetchingDrivers: true,
    isLoadedDrivers: false,
    fetchDriversError: null
  }),
  [FETCH_DRIVER_SUCCESS]: (state, payload) => ({
    ...state,
    isFetchingDrivers: false,
    isLoadedDrivers: true,
    drivers: payload
  }),
  [FETCH_DRIVERS_FAILURE]: (state, error) => ({
    ...state,
    isFetchingDrivers: false,
    isLoadedDrivers: false,
    fetchDriversError: error
  }),

  [ADD_DRIVER_REQUEST]: state => ({
    ...state,
    isAddingDriver: true,
    isAddedDriver: false,
    addDriverError: null
  }),
  [ADD_DRIVER_SUCCESS]: (state, payload) => ({
    ...state,
    isAddingDriver: false,
    isAddedDriver: true
  }),
  [ADD_DRIVER_FAILURE]: (state, error) => ({
    ...state,
    isAddingDriver: false,
    isAddedDriver: false,
    addDriverError: error
  }),

  [UPDATE_DRIVER_REQUEST]: state => ({
    ...state,
    isUpdatingDriver: true,
    isUpdatedDriver: false,
    updateDriverError: null
  }),
  [UPDATE_DRIVER_SUCCESS]: (state, payload) => ({
    ...state,
    isUpdatingDriver: false,
    isUpdatedDriver: true
  }),
  [UPDATE_DRIVER_FAILURE]: (state, error) => ({
    ...state,
    isUpdatingDriver: false,
    isUpdatedDriver: false,
    updateDriverError: error
  }),

  [DELETE_DRIVER_REQUEST]: (state, driverId) => ({
    ...state,
    isDeletingDriver: true,
    isDeletedDriver: false,
    deletingDriverId: driverId,
    deleteDriverError: null
  }),
  [DELETE_DRIVER_SUCCESS]: (state, payload) => ({
    ...state,
    isDeletingDriver: false,
    isDeletedDriver: true
  }),
  [DELETE_DRIVER_FAILURE]: (state, error) => ({
    ...state,
    isDeletingDriver: false,
    isDeletedDriver: false,
    deleteDriverError: error
  })
});
