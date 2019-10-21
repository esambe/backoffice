import React from "react";
import RequestView from "../components/pages/requests/index";
import * as fetchActions from "../actions/requests/fetch_request_actions";

import * as fetchCountryActions from "../actions/country/fetch_country_actions";
import * as fetchCountryTownsActions from "../actions/country/fetch_country_towns";
import * as fetchTownActions from "../actions/town/fetch_town_actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Edit, Trash2, Trash, PlusCircle, Loader } from "react-feather";


function mapStateToProps(state) {
  return {
    token: state.auth.userToken,
    userId: state.auth.userId,

    requests: state.requests.requests,

    countries: state.countries.appCountries,
    towns: state.towns.towns,

    isFetchingRequest: state.requests.isFetchingRequest,
    isLoadedRequest: state.requests.isLoadedRequest,

    fetchRequestError: state.requests.fetchRequestError,
    loadRequestError: state.requests.RequestError,

    isFetchingAppCountries: state.countries.isFetchingAppCountries,
    isLoadedAppCountries: state.countries.isLoadedAppCountries,
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

class RequestListView extends React.Component {
  state = {
    RequestIdEdit: null,
    RequestEdit: null
  };

  componentDidMount() {
    this.refreshRequestTable();
  }


  refreshRequestTable = () => {
    if (!this.props.isLoadedAppCountries) {
      this.props.fetchAppCountries(this.props.token);
    }

    if (!this.props.isLoadedTowns) {
      this.props.fetchTowns(this.props.token);
    }
    this.props.fetchRequest(this.props.token);
  };

  getTownForCountry = countryId => {
    let towns = [];
    this.props.countries.countryId;
  };

  render() {

    return (
      <RequestView
        data={this.props.requests}
        editData={this.state.RequestEdit}
        isFetchingRequest={this.props.isFetchingRequest}
        fetchRequestError={this.props.fetchRequestError}
        countries={this.props.countries}
        towns={this.props.towns}
        requests={this.props.requests}

        refreshRequestTable={() =>
          this.props.fetchRequest(this.props.token)
        }
        columns={[
          {
            Header: "No",
            accessor: "id",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedRequest &&
                  this.props.deletingRequestId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Departure Town",
            accessor: `departure.town.name.en`,
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedRequest &&
                  this.props.deletingRequestId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Destination Town",
            accessor: `destination.town.name.en`,
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedRequest &&
                  this.props.deletingRequestId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Seats",
            accessor: "seats",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedRequest &&
                  this.props.deletingRequestId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Departure Name",
            accessor: "departure.name",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedRequest &&
                  this.props.deletingRequestId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Service",
            accessor: "service.name.en",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedRequest &&
                  this.props.deletingRequestId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Driver Number",
            accessor: "driver.phone",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedRequest &&
                  this.props.deletingRequestId == props.original.id
                }
                item={props.value}
              />
            )
          },

          {
            Header: "Price",
            accessor: "price.amount",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedRequest &&
                  this.props.deletingRequestId == props.original.id
                }
                item={props.value}
              />
            )
          },

          {
            Header: "Payment Method",
            accessor: "paymentMethod",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedRequest &&
                  this.props.deletingRequestId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Request Status",
            accessor: "status",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedRequest &&
                  this.props.deletingRequestId == props.original.id
                }
                item={props.value}
              />
            )
          },
          
        ]}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestListView);
