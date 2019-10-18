import { createReducer } from "../utility/misc";
import {
  FETCH_SUBSCRIPTION_PLAN_FAILURE,
  FETCH_SUBSCRIPTION_PLAN_REQUEST,
  FETCH_SUBSCRIPTION_PLAN_SUCCESS,
  ADD_SUBSCRIPTION_PLAN_REQUEST,
  ADD_SUBSCRIPTION_PLAN_FAILURE,
  ADD_SUBSCRIPTION_PLAN_SUCCESS,
  UPDATE_SUBSCRIPTION_PLAN_REQUEST,
  UPDATE_SUBSCRIPTION_PLAN_FAILURE,
  UPDATE_SUBSCRIPTION_PLAN_SUCCESS,
  DELETE_SUBSCRIPTION_PLAN_REQUEST,
  DELETE_SUBSCRIPTION_PLAN_FAILURE,
  DELETE_SUBSCRIPTION_PLAN_SUCCESS
} from "../constants/action_types";

const initialState = {
  subscription_plans: [],

  isFetchingSubscriptionPlan: false,
  isLoadedSubscriptionPlan: false,

  isAddingSubscriptionPlan: false,
  isAddedSubscriptionPlan: false,

  isUpdatingSubscriptionPlan: false,
  isUpdatedSubscriptionPlan: false,

  isDeletingSubscriptionPlan: false,
  isDeletedSubscriptionPlan: false,
  DeletingSubscriptionPlanId: null,

  fetchSubscriptionPlanError: null,
  addSubscriptionPlanError: null,
  updateSubscriptionPlanError: null,
  deleteSubscriptionPlanError: null
};

export default createReducer(initialState, {
  [FETCH_SUBSCRIPTION_PLAN_REQUEST]: state => ({
    ...state,
    isFetchingSubscriptionPlan: true,
    isLoadedSubscriptionPlan: false,
    fetchSubscriptionPlanError: null
  }),
  [FETCH_SUBSCRIPTION_PLAN_SUCCESS]: (state, payload) => ({
    ...state,
    isFetchingSubscriptionPlan: false,
    isLoadedSubscriptionPlan: true,
    subscription_plans: payload
  }),
  [FETCH_SUBSCRIPTION_PLAN_FAILURE]: (state, error) => ({
    ...state,
    isFetchingSubscriptionPlan: false,
    isLoadedSubscriptionPlan: false,
    fetchSubscriptionPlanError: error
  }),
  [ADD_SUBSCRIPTION_PLAN_REQUEST]: state => ({
    ...state,
    isAddingSubscriptionPlan: true,
    isAddedSubscriptionPlan: false,
    addSubscriptionPlanError: null
  }),
  [ADD_SUBSCRIPTION_PLAN_SUCCESS]: state => ({
    ...state,
    isAddingSubscriptionPlan: false,
    isAddedSubscriptionPlan: true
  }),
  [ADD_SUBSCRIPTION_PLAN_FAILURE]: (state, error) => ({
    ...state,
    isAddingSubscriptionPlan: false,
    isAddedSubscriptionPlan: false,
    addSubscriptionPlanError: error
  }),
  [UPDATE_SUBSCRIPTION_PLAN_REQUEST]: state => ({
    ...state,
    isUpdatingSubscriptionPlan: true,
    isUpdatedSubscriptionPlan: false,
    updateSubscriptionPlanError: null
  }),
  [UPDATE_SUBSCRIPTION_PLAN_SUCCESS]: state => ({
    ...state,
    isUpdatingSubscriptionPlan: false,
    isUpdatedSubscriptionPlan: true
  }),
  [UPDATE_SUBSCRIPTION_PLAN_FAILURE]: (state, error) => ({
    ...state,
    isUpdatingSubscriptionPlan: false,
    isUpdatedSubscriptionPlan: false,
    updateSubscriptionPlanError: error
  }),
  [DELETE_SUBSCRIPTION_PLAN_REQUEST]: (state, subscriptionPlansId) => ({
    ...state,
    isDeletingSubscriptionPlan: true,
    isDeletedSubscriptionPlan: false,
    DeletingSubscriptionPlanId: subscriptionPlansId,
    deleteSubscriptionPlanError: null
  }),
  [DELETE_SUBSCRIPTION_PLAN_SUCCESS]: (state, payload) => ({
    ...state,
    isUpdatingSubscriptionPlan: false,
    isUpdatedSubscriptionPlan: true,
    subscription_plans: payload
  }),
  [DELETE_SUBSCRIPTION_PLAN_FAILURE]: (state, error) => ({
    ...state,
    isDeletingSubscriptionPlan: false,
    isDeletedSubscriptionPlan: false,
    deleteSubscriptionPlanError: error
  })
});
