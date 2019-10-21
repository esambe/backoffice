import { createReducer } from "../utility/misc";
import {
  FETCH_REQUEST_FAILURE,
  FETCH_REQUEST,
  FETCH_REQUEST_SUCCESS
} from "../constants/action_types";

const initialState = {
  requests:[],

  isFetchingRequest: false,
  isLoadedRequest: false,

  requestsTownId: null,
  requestsCountryId: null,
  
  fetchRequestError: null,
  addRequestError: null,
  updateRequestError: null,
  deleteRequestError: null
};

export default createReducer(initialState, {
  [FETCH_REQUEST]: state => ({
    ...state,
    isFetchingRequest: true,
    isLoadedRequest: false,
    fetchRequestError: null
  }),
  [FETCH_REQUEST_SUCCESS]: (state, payload) => ({
    ...state,
    isFetchingRequest: false,
    isLoadedRequest: true,
    requests: payload
  }),
  [FETCH_REQUEST_FAILURE]: (state, error) => ({
    ...state,
    isFetchingRequest: false,
    isLoadedRequest: false,
    fetchRequestError: error
  })
});
