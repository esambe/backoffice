import { createReducer } from "../utility/misc";
import {
  FETCH_CLIENT_FAILURE,
  FETCH_CLIENT_REQUEST,
  FETCH_CLIENT_SUCCESS
} from "../constants/action_types";

const initialState = {
  clients:[],

  isFetchingClient: false,
  isLoadedClient: false,

  clientsTownId: null,
  clientsCountryId: null,
  
  fetchClientError: null,
  addClientError: null,
  updateClientError: null,
  deleteClientError: null
};

export default createReducer(initialState, {
  [FETCH_CLIENT_REQUEST]: state => ({
    ...state,
    isFetchingClient: true,
    isLoadedClient: false,
    fetchClientError: null
  }),
  [FETCH_CLIENT_SUCCESS]: (state, payload) => ({
    ...state,
    isFetchingClient: false,
    isLoadedClient: true,
    clients: payload
  }),
  [FETCH_CLIENT_FAILURE]: (state, error) => ({
    ...state,
    isFetchingClient: false,
    isLoadedClient: false,
    fetchClientError: error
  })
});
