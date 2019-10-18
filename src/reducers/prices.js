import { createReducer } from "../utility/misc";
import {
  ADD_PRICE_REAUEST,
  ADD_PRICE_SUCCESS,
  ADD_PRICE_FAILURE,
  FETCH_PRICE_REQUEST,
  FETCH_PRICE_SUCCESS,
  FETCH_PRICE_FAILURE,
  UPDATE_PRICE_REQUEST,
  UPDATE_PRICE_SUCCESS,
  UPDATE_PRICE_FAILURE,
  DELETE_PRICE_REQUEST,
  DELETE_PRICE_SUCCESS,
  DELETE_PRICE_FAILURE
} from "../constants/action_types";

const initialState = {
  prices: [],

  isFetchingPrice: false,
  isLoadedPrice: false,

  isAddingPrice: false,
  isAddedPrice: false,

  isUpdatingPrice: false,
  isUpdatedPrice: false,

  isDeletingPrice: false,
  isDeletedPrice: false,
  isDeletingPriceId: false,

  addPriceError: null,
  fetchPriceError: null,
  updatePriceError: null,
  deletePriceError: null
};
export default createReducer(initialState, {
  [FETCH_PRICE_REQUEST]: state => ({
    ...state,
    isFetchingPrice: true,
    isLoadedprice: false,
    fetchPriceError: false
  }),
  [FETCH_PRICE_SUCCESS]: (state, paylaod) => ({
    ...state,
    isFetchingPrice: false,
    isLoadedPrice: true,
    prices: paylaod
  }),
  [FETCH_PRICE_FAILURE]: (state, error) => ({
    ...state,
    isFetchingPrice: false,
    isLoadedPrice: false,
    fetchPriceError: error
  }),
  [ADD_PRICE_REAUEST]: state => ({
    ...state,
    isAddingPrice: true,
    isAddedPrice: false,
    addPriceError: false
  }),
  [ADD_PRICE_SUCCESS]: state => ({
    ...state,
    isAddingPrice: false,
    isAddedPrice: true
  }),
  [ADD_PRICE_FAILURE]: (state, error) => ({
    ...state,
    isAddingPrice: false,
    isAddedPrice: false,
    addPriceError: error
  }),
  [UPDATE_PRICE_REQUEST]: state => ({
    ...state,
    isUpdatingPrice: true,
    isUpdatedPrice: false,
    updatePriceError: null
  }),
  [UPDATE_PRICE_SUCCESS]: (state, paylaod) => ({
    ...state,
    isUpdatingPrice: false,
    isUpdatedPrice: true
  }),
  [UPDATE_PRICE_FAILURE]: (state, error) => ({
    ...state,
    isUpdatingPrice: false,
    isUpdatedPrice: false,
    updatePriceError: error
  }),
  [DELETE_PRICE_REQUEST]: (state, priceId) => ({
    ...state,
    isDeletingPrice: true,
    isDeletedPrice: false,
    isDeletingPriceId: priceId
  }),
  [DELETE_PRICE_SUCCESS]: state => ({
    ...state,
    isDeletingPrice: false,
    isDelatedPrice: true
  }),
  [DELETE_PRICE_FAILURE]: (state, error) => ({
    ...state,
    isDeletingPrice: false,
    isDelatedPrice: false,
    deletePriceError: error
  })
});
