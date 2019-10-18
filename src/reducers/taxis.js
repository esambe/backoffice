import { createReducer } from "../utility/misc";
import {
  ADD_TAXI_FAILURE,
  ADD_TAXI_REQUEST,
  ADD_TAXI_SUCCESS,
  FETCH_TAXI_FAILURE,
  FETCH_TAXI_REQUEST,
  FETCH_TAXI_SUCCESS,
  UPDATE_TAXI_FAILURE,
  UPDATE_TAXI_REQUEST,
  UPDATE_TAXI_SUCCESS,
  DELETE_TAXI_FAILURE,
  DELETE_TAXI_REQUEST,
  DELETE_TAXI_SUCCESS
} from "../constants/action_types";

const initialState = {
  taxis: [],
  taxiTownId: null,

  isFetchingTaxi: false,
  isLoadedTaxi: false,

  isAddingTaxi: false,
  isAddedTaxi: false,

  isUpdatingTaxi: false,
  isUpdatedTaxi: false,

  isDeletingTaxi: false,
  isDeletedTaxi: false,
  isDeletingTaxiId: false,

  addTaxiError: null,
  fetchTaxiError: null,
  updateTaxiError: null,
  deleteTaxiError: null
};
export default createReducer(initialState, {
  [FETCH_TAXI_REQUEST]: (state, townId) => ({
    ...state,
    isFetchingTaxi: true,
    isLoadedTaxi: false,
    fetchTaxiError: false
  }),
  [FETCH_TAXI_SUCCESS]: (state, paylaod) => ({
    ...state,
    isFetchingTaxi: false,
    isLoadedTaxi: true,
    taxis: paylaod
  }),
  [FETCH_TAXI_FAILURE]: (state, error) => ({
    ...state,
    isFetchingTaxi: false,
    isLoadedTaxi: false,
    fetchTaxiError: error
  }),
  [ADD_TAXI_REQUEST]: state => ({
    ...state,
    isAddingTaxi: true,
    isAddedTaxi: false,
    addTaxiError: false
  }),
  [ADD_TAXI_SUCCESS]: state => ({
    ...state,
    isAddingTaxi: false,
    isAddedTaxi: true
  }),
  [ADD_TAXI_FAILURE]: (state, error) => ({
    ...state,
    isAddingTaxi: false,
    isAddedTaxi: false,
    addTaxiError: error
  }),
  [UPDATE_TAXI_REQUEST]: state => ({
    ...state,
    isUpdatingTaxi: true,
    isUpdatedTaxi: false,
    updateTaxiError: null
  }),
  [UPDATE_TAXI_SUCCESS]: (state, paylaod) => ({
    ...state,
    isUpdatingTaxi: false,
    isUpdatedTaxi: true
  }),
  [UPDATE_TAXI_FAILURE]: (state, error) => ({
    ...state,
    isUpdatingTaxi: false,
    isUpdatedTaxi: false,
    updateTaxiError: error
  }),
  [DELETE_TAXI_REQUEST]: (state, taxiId) => ({
    ...state,
    isDeletingTaxi: true,
    isDeletedTaxi: false,
    isDeletingTaxiId: taxiId
  }),
  [DELETE_TAXI_SUCCESS]: state => ({
    ...state,
    isDeletingTaxi: false,
    isDelatedTaxi: true
  }),
  [DELETE_TAXI_FAILURE]: (state, error) => ({
    ...state,
    isDeletingTaxi: false,
    isDelatedTaxi: false,
    deleteTaxiError: error
  })
});
