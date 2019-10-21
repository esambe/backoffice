import { createReducer } from "../utility/misc";
import {
  FETCH_SUBSCRIPTION_FAILURE,
  FETCH_SUBSCRIPTION_REQUEST,
  FETCH_SUBSCRIPTION_SUCCESS,
  // ADD_SUBSCRIPTION_REQUEST,
  // ADD_SUBSCRIPTION_FAILURE,
  // ADD_SUBSCRIPTION_SUCCESS,
  // UPDATE_SUBSCRIPTION_REQUEST,
  // UPDATE_SUBSCRIPTION_FAILURE,
  // UPDATE_SUBSCRIPTION_SUCCESS,
  // DELETE_SUBSCRIPTION_REQUEST,
  // DELETE_SUBSCRIPTION_FAILURE,
  // DELETE_SUBSCRIPTION_SUCCESS
} from "../constants/action_types";

const initialState = {
  subscriptions: [],

  isFetchingSubscription: false,
  isLoadedSubscription: false,

  // isAddingSubscription: false,
  // isAddedSubscription: false,

  // isUpdatingSubscription: false,
  // isUpdatedSubscription: false,

  // isDeletingSubscription: false,
  // isDeletedSubscription: false,
  // DeletingSubscriptionId: null,

  // fetchSubscriptionError: null,
  // addSubscriptionError: null,
  // updateSubscriptionError: null,
  // deleteSubscriptionError: null
};

export default createReducer(initialState, {
  [FETCH_SUBSCRIPTION_REQUEST]: state => ({
    ...state,
    isFetchingSubscription: true,
    isLoadedSubscription: false,
    fetchSubscriptionError: null
  }),
  [FETCH_SUBSCRIPTION_SUCCESS]: (state, payload) => ({
    ...state,
    isFetchingSubscription: false,
    isLoadedSubscription: true,
    subscriptions: payload
  }),
  [FETCH_SUBSCRIPTION_FAILURE]: (state, error) => ({
    ...state,
    isFetchingSubscription: false,
    isLoadedSubscription: false,
    fetchSubscriptionError: error
  })
  // [ADD_SUBSCRIPTION_REQUEST]: state => ({
  //   ...state,
  //   isAddingSubscription: true,
  //   isAddedSubscription: false,
  //   addSubscriptionError: null
  // }),
  // [ADD_SUBSCRIPTION_SUCCESS]: state => ({
  //   ...state,
  //   isAddingSubscription: false,
  //   isAddedSubscription: true
  // }),
  // [ADD_SUBSCRIPTION_FAILURE]: (state, error) => ({
  //   ...state,
  //   isAddingSubscription: false,
  //   isAddedSubscription: false,
  //   addSubscriptionError: error
  // }),
  // [UPDATE_SUBSCRIPTION_REQUEST]: state => ({
  //   ...state,
  //   isUpdatingSubscription: true,
  //   isUpdatedSubscription: false,
  //   updateSubscriptionError: null
  // }),
  // [UPDATE_SUBSCRIPTION_SUCCESS]: state => ({
  //   ...state,
  //   isUpdatingSubscription: false,
  //   isUpdatedSubscription: true
  // }),
  // [UPDATE_SUBSCRIPTION_FAILURE]: (state, error) => ({
  //   ...state,
  //   isUpdatingSubscription: false,
  //   isUpdatedSubscription: false,
  //   updateSubscriptionError: error
  // }),
  // [DELETE_SUBSCRIPTION_REQUEST]: (state, subscriptionsId) => ({
  //   ...state,
  //   isDeletingSubscription: true,
  //   isDeletedSubscription: false,
  //   DeletingSubscriptionId: subscriptionsId,
  //   deleteSubscriptionError: null
  // }),
  // [DELETE_SUBSCRIPTION_SUCCESS]: (state, payload) => ({
  //   ...state,
  //   isUpdatingSubscription: false,
  //   isUpdatedSubscription: true,
  //   subscriptions: payload
  // }),
  // [DELETE_SUBSCRIPTION_FAILURE]: (state, error) => ({
  //   ...state,
  //   isDeletingSubscription: false,
  //   isDeletedSubscription: false,
  //   deleteSubscriptionError: error
  // })
});
