import React from "react";
import SubscriptionPlanView from "../components/pages/subscription_plans/index";
import * as fetchActions from "../actions/subscription_plans/fetech_subscription_plans_actions";
import * as addActions from "../actions/subscription_plans/add_subscription_plans_actions";
import * as updateActions from "../actions/subscription_plans/update_subscription_plans_actions";
import * as deleteActions from "../actions/subscription_plans/delete_subscription_plans_actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Edit, Trash2, Trash, PlusCircle, Loader } from "react-feather";
import { EDIT_SUBSCRIPTION_PLAN } from "../constants/app_utils";

function mapStateToProps(state) {
  return {
    token: state.auth.userToken,
    userId: state.auth.userId,

    subscription_plans: state.subscription_plans.subscription_plans,

    isFetchingSubscriptionPlan:
      state.subscription_plans.isFetchingSubscriptionPlan,
    isLoadedSubscriptionPlan: state.subscription_plans.isLoadedSubscriptionPlan,

    isAddingSubscriptionPlan: state.subscription_plans.isAddingSubscriptionPlan,
    isAddedSubscriptionPlan: state.subscription_plans.isAddedSubscriptionPlan,

    isUpdatingSubscriptionPlan:
      state.subscription_plans.isUpdatingSubscriptionPlan,
    isUpdatedSubscriptionPlan:
      state.subscription_plans.isUpdatedSubscriptionPlan,

    isDeletingSubscriptionPlan:
      state.subscription_plans.isDeletingSubscriptionPlan,
    isDeletedSubscriptionPlan:
      state.subscription_plans.isDeletedSubscriptionPlan,
    deletingSubscriptionPlanId:
      state.subscription_plans.deletingSubscriptionPlanId,

    fetchSubscriptionPlanError:
      state.subscription_plans.fetchSubscriptionPlanError,
    loadSubscriptionPlanError: state.subscription_plans.SubscriptionPlanError,
    addSubscriptionPlanError: state.subscription_plans.addSubscriptionPlanError
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...fetchActions,
      ...addActions,
      ...updateActions,
      ...deleteActions
    },
    dispatch
  );
}

function CellItem(props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: props.deleted ? "#ef9a9a" : ""
      }}
    >
      {props.item || typeof props.item === "number"
        ? props.item
        : props.children}
    </div>
  );
}

class SubscriptionPlanListView extends React.Component {
  state = {
    SubscriptionPlanIdEdit: null,
    SubscriptionPlanEdit: null
  };

  componentDidMount() {
    this.refreshSubscriptionPlanTable();
  }

  setEditSubscriptionPlan = SubscriptionPlanData => {
    this.setState(
      {
        SubscriptionPlanEdit: { ...SubscriptionPlanData }
      },
      () => {
        this.props.history.push(EDIT_SUBSCRIPTION_PLAN);
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 25);
      }
    );
  };

  deleteSubscriptionPlan = SubscriptionPlanId => {
    this.props.deleteSubscriptionPlan(this.props.token, SubscriptionPlanId);
  };

  handleSubmitSubscriptionPlanData = (
    SubscriptionPlanData,
    SubscriptionPlanId,
    callback
  ) => {
    if (pickupId) {
      this.props.updateSubscriptionPlan(
        this.props.token,
        { ...SubscriptionPlanData, manager_id: this.props.userId },
        SubscriptionPlanId,
        callback
      );
    } else {
      this.props.addSubscriptionPlan(
        this.props.token,
        { ...SubscriptionPlanData, manager_id: this.props.userId },
        callback
      );
    }
  };
  refreshSubscriptionPlanTable = () => {
    this.props.fetchSubscriptionPlan(this.props.token);
  };

  render() {
    return (
      <SubscriptionPlanView
        data={this.props.subscription_plans}
        editData={this.state.SubscriptionPlanEdit}
        isFetchingSubscriptionPlan={this.props.isFetchingSubscriptionPlan}
        fetchSubscriptionPlanError={this.props.fetchSubscriptionPlanError}
        isAddingSubscriptionPlan={this.props.isAddingSubscriptionPlan}
        isUpdatingSubscriptionPlan={this.props.isUpdatingSubscriptionPlan}
        isDeletingSubscriptionPlan={this.props.isDeletingSubscriptionPlan}
        deletingSubscriptionPlanId={this.props.deletingSubscriptionPlanId}
        addSubscriptionPlanError={this.props.addSubscriptionPlanError}
        submitSubscriptionPlanData={this.handleSubmitSubscriptionPlanData}
        refreshSubscriptionPlanTable={() =>
          this.props.fetchSubscriptionPlan(this.props.token)
        }
        columns={[
          {
            Header: "Label",
            accessor: "label",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedSubscriptionPlan &&
                  this.props.deletingSubscriptionPlanId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Amount",
            accessor: "amount",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedSubscriptionPlan &&
                  this.props.deletingSubscriptionPlanId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Period",
            accessor: "period.value",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedSubscriptionPlan &&
                  this.props.deletingSubscriptionPlanId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Period Unit",
            accessor: "period.unit",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedSubscriptionPlan &&
                  this.props.deletingSubscriptionPlanId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Currency",
            accessor: "currency.en",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedSubscriptionPlan &&
                  this.props.deletingSubscriptionPlanId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Duration",
            accessor: "duration.fr",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedSubscriptionPlan &&
                  this.props.deletingSubscriptionPlanId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Recommendation",
            accessor: "recommended",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedSubscriptionPlan &&
                  this.props.deletingSubscriptionPlanId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "",
            Cell: props => (
              <span>
                <Edit
                  size={18}
                  className="mr-2 hand-cursor"
                  color="#1565C0"
                  onClick={() => this.setEditSubscriptionPlan(props.original)}
                />
                {(this.props.isDeletingSubscriptionPlan ||
                  this.props.isDeletedSubscriptionPlan) &&
                this.props.deletingSubscriptionPlanId == props.original.id ? (
                  <Loader
                    size={18}
                    className="hand-cursor animate-spin"
                    color="#FF586B"
                  />
                ) : (
                  <Trash2
                    size={18}
                    className="hand-cursor"
                    color="#FF586B"
                    onClick={() =>
                      this.deleteSubscriptionPlan(props.original.id)
                    }
                  />
                )}
              </span>
            ),
            width: 100,
            filterable: false,
            sortable: false
          }
        ]}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionPlanListView);
