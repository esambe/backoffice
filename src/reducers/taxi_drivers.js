import { createReducer } from "../utility/misc";
import {
  ASSIGN_TAXI_DRIVER_FAILURE,
  ASSIGN_TAXI_DRIVER_SUCCESS,
  ASSIGN_TAXI_DRIVER_REQUEST,
  FETCH_TAXI_DRIVER_REQUEST,
  FETCH_TAXI_DRIVER_SUCCESS,
  FETCH_TAXI_DRIVER_FAILURE,
  UPDATE_TAXI_DRIVER_FAILURE,
  UPDATE_TAXI_DRIVER_REQUEST,
  UPDATE_TAXI_DRIVER_SUCCESS,
  DELETE_TAXI_DRIVER_FAILURE,
  DELETE_TAXI_DRIVER_REQUEST,
  DELETE_TAXI_DRIVER_SUCCESS
} from "../constants/action_types";

const initialState = {
  taxi_drivers: [],
  taxi_driverId: null,
  taxiId: null,
  driverID: null,

  isFetchingTaxiDrivers: false,
  isLoadedTaxiDrivers: false,

  isAssigningTaxiDrivers: false,
  isAssignedTaxiDrivesrs: false,

  isUpdatingTaxiDrivers: false,
  isUpdatedTaxiDrivers: false,

  isDeletingTaxiDrivers: false,
  isDeletedTaxiDrivers: false,
  isDeletingTaxiDriversId: false,

  assigneTaxidriversError: null,
  fetchTaxiDriversError: null,
  updateTaxiDriversError: null,
  deleteTaxiDriversError: null
};
export default createReducer(initialState, {
  [FETCH_TAXI_DRIVER_REQUEST]: (state, taxi_driverId) => ({
    ...state,
    isFetchingTaxiDrivers: true,
    isLoadedTaxiDrivers: false,
    fetchTaxiDriversError: false
  }),
  [FETCH_TAXI_DRIVER_SUCCESS]: (state, paylaod) => ({
    ...state,
    isFetchingTaxiDrivers: false,
    isLoadedTaxiDrivers: true,
    taxi_drivers: paylaod
  }),
  [FETCH_TAXI_DRIVER_FAILURE]: (state, error) => ({
    ...state,
    isFetchingTaxiDrivers: false,
    isLoadedTaxiDrivers: false,
    fetchTaxiDriversError: error
  }),
  [ASSIGN_TAXI_DRIVER_REQUEST]: state => ({
    ...state,
    isAssigningTaxiDrivers: true,
    isAssignedTaxiDrivesrs: false,
    assigneTaxidriversError: false
  }),
  [ASSIGN_TAXI_DRIVER_SUCCESS]: state => ({
    ...state,
    isAssigningTaxiDrivers: false,
    isAssignedTaxiDrivesrs: true
  }),
  [ASSIGN_TAXI_DRIVER_FAILURE]: (state, error) => ({
    ...state,
    isAssigningTaxiDrivers: false,
    isAssignedTaxiDrivesrs: false,
    assigneTaxidriversError: error
  }),
  [UPDATE_TAXI_DRIVER_REQUEST]: state => ({
    ...state,
    isUpdatingTaxiDrivers: true,
    isUpdatedTaxiDrivers: false,
    updateTaxiDriversError: null
  }),
  [UPDATE_TAXI_DRIVER_SUCCESS]: (state, paylaod) => ({
    ...state,
    isUpdatingTaxiDrivers: false,
    isUpdatedTaxiDrivers: true
  }),
  [UPDATE_TAXI_DRIVER_FAILURE]: (state, error) => ({
    ...state,
    isUpdatingTaxiDrivers: false,
    isUpdatedTaxiDrivers: false,
    updateTaxiDriversError: error
  }),
  [DELETE_TAXI_DRIVER_REQUEST]: (state, taxi_driverId) => ({
    ...state,
    isDeletingTaxiDrivers: true,
    isDeletedTaxiDrivers: false,
    isDeletingTaxiDriversId: taxi_driverId
  }),
  [DELETE_TAXI_DRIVER_SUCCESS]: state => ({
    ...state,
    isDeletingTaxi: false,
    isDelatedtaxi: true
  }),
  [DELETE_TAXI_DRIVER_FAILURE]: (state, error) => ({
    ...state,
    isDeletingTaxiDrivers: false,
    isDeletedTaxiDrivers: false,
    deleteTaxiDriverError: error
  })
});
