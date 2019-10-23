import React from "react";
import SubscriptionView from "../components/pages/subscriptions/index";
import * as fetchActions from "../actions/subscription/fetch_subscription_actions";

import * as fetchCountryActions from "../actions/country/fetch_country_actions";
import * as fetchCountryTownsActions from "../actions/country/fetch_country_towns";
import * as fetchTownActions from "../actions/town/fetch_town_actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Edit, Trash2, Trash, PlusCircle, Loader } from "react-feather";
// import { EDIT_SUBSCRIPTION } from "../constants/app_utils";

function mapStateToProps(state) {
  return {
    token: state.auth.userToken,
    userId: state.auth.userId,

    subscriptions: state.subscriptions.subscriptions,

    isFetchingSubscription:
    state.subscriptions.isFetchingSubscription,
    isLoadedSubscription: state.subscriptions.isLoadedSubscription,

    // isAddingSubscription: state.subscription.isAddingSubscription,
    // isAddedSubscription: state.subscription.isAddedSubscription,

    // isUpdatingSubscription:
    //   state.subscription.isUpdatingSubscription,
    // isUpdatedSubscription:
    //   state.subscription.isUpdatedSubscription,

    // isDeletingSubscription:
    //   state.subscription.isDeletingSubscription,
    // isDeletedSubscription:
    // state.subscription.isDeletedSubscription,
    // deletingSubscriptionId:
    // state.subscription.deletingSubscriptionId,

    countries: state.countries.appCountries,
    towns: state.towns.towns,

    isFetchingAppCountries: state.countries.isFetchingAppCountries,
    isLoadedAppCountries: state.countries.isLoadedAppCountries,

    fetchSubscriptionError:
    state.subscriptions.fetchSubscriptionError,
    loadSubscriptionError: state.subscriptions.SubscriptionError,
    //addSubscriptionError: state.subscription.addSubscriptionError
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...fetchActions,
    //   ...addActions,
    //   ...updateActions,
    //   ...deleteActions
    ...fetchTownActions,
    ...fetchCountryActions,
    ...fetchCountryTownsActions
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

class SubscriptionListView extends React.Component {
  state = {
    SubscriptionIdEdit: null,
    SubscriptionEdit: null
  };

  componentDidMount() {
    this.refreshSubscriptionTable();
  }


  refreshSubscriptionTable = () => {
    this.props.fetchSubscription(this.props.token);

    if (!this.props.isLoadedAppCountries) {
      this.props.fetchAppCountries(this.props.token);
    }

    if (!this.props.isLoadedTowns) {
      this.props.fetchTowns(this.props.token);
    }
  };

  getTownForCountry = countryId => {
    let towns = [];
    this.props.countries.countryId;
  };

  render() {
    var i = 0;
    return (
      <SubscriptionView
        data={this.props.subscriptions}
        editData={this.state.SubscriptionEdit}
        isFetchingSubscription={this.props.isFetchingSubscription}
        fetchSubscriptionError={this.props.fetchSubscriptionError}
        countries={this.props.countries}
        towns={this.props.towns}
        // isAddingSubscription={this.props.isAddingSubscription}
        // isUpdatingSubscription={this.props.isUpdatingSubscription}
        // isDeletingSubscription={this.props.isDeletingSubscription}
        // deletingSubscriptionId={this.props.deletingSubscriptionId}
        // addSubscriptionError={this.props.addSubscriptionError}
        // submitSubscriptionData={this.handleSubmitSubscriptionData}
        refreshSubscriptionTable={() =>
          this.props.fetchSubscription(this.props.token)
        }
        columns={[
          {
            Header: "No",
            accessor: "id",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedSubscription &&
                  this.props.deletingSubscriptionId == props.original.id
                }
                item={<div className="text-center">{i++}</div>}
                className="text-center"
              />
            )
          },
          {
            Header: "Client",
            accessor: "client",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedSubscriptionPlan &&
                  this.props.deletingSubscriptionPlanId == props.original.id
                }
                item={<div className="text-center">{props.value}</div>}
                className="text-center"
              />
            )
          },
          {
            Header: "Subscription Plan",
            accessor: "subscription_plan",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedSubscriptionPlan &&
                  this.props.deletingSubscriptionPlanId == props.original.id
                }
                className="text-center"
                item={<div className="text-center">{props.value}</div>}
              />
            )
          },
          {
            Header: "Subscribed On",
            accessor: "subscribed_on",
            Cell: props => (
              <CellItem
                className="text-center"
                deleted={
                  this.props.isDeletedSubscriptionPlan &&
                  this.props.deletingSubscriptionPlanId == props.original.id
                }
                item={<div className="text-center">{props.value}</div>}
              />
            )
          },
          {
            Header: "Expired On",
            accessor: "expired_on",
            Cell: props => (
              <CellItem
                className="text-center"
                deleted={
                  this.props.isDeletedSubscriptionPlan &&
                  this.props.deletingSubscriptionPlanId == props.original.id
                }
                item={<div className="text-center">{props.value}</div>}
              />
            )
          },
          {
            Header: "Status",
            accessor: "active",
            Cell: props => (
              <CellItem
                item={props.value == 1 ? 
                <div className="d-flex justify-content-center">
                  <div style={{ height: 10, width: 10, borderRadius: '50%', backgroundColor: 'green' }}></div> 
                </div>
                :
                <div className="d-flex justify-content-center">
                 <div style={{ height: 10, width: 10, borderRadius: '50%', backgroundColor: 'blue' }}></div>  
                </div>
                }
              />
            )
          }
        ]}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionListView);
