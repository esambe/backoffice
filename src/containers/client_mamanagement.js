import React from "react";
import ClientView from "../components/pages/clients/index";
import * as fetchActions from "../actions/clients/fetch_client_actions";
// import * as addActions from "../actions/clients/add_clients_actions";
// import * as updateActions from "../actions/clients/update_subscription_plans_actions";
//import * as deleteActions from "../actions/subscription_plans/delete_subscription_plans_actions";
import * as fetchCountryActions from "../actions/country/fetch_country_actions";
import * as fetchCountryTownsActions from "../actions/country/fetch_country_towns";
import * as fetchTownActions from "../actions/town/fetch_town_actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Edit, Trash2, Trash, PlusCircle, Loader } from "react-feather";
// import { EDIT_SUBSCRIPTION_PLAN } from "../constants/app_utils";
import Select from 'react-select';

function mapStateToProps(state) {
  return {
    token: state.auth.userToken,
    userId: state.auth.userId,

    clients: state.clients.clients,

    countries: state.countries.appCountries,
    towns: state.towns.towns,

    isFetchingClient: state.clients.isFetchingClient,
    isLoadedClient: state.clients.isLoadedClient,

    fetchClientError: state.clients.fetchClientError,
    loadClientError: state.clients.ClientError,

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

class ClientListView extends React.Component {
  state = {
    ClientIdEdit: null,
    ClientEdit: null
  };

  componentDidMount() {
    this.refreshClientTable();
  }


  refreshClientTable = () => {
    if (!this.props.isLoadedAppCountries) {
      this.props.fetchAppCountries(this.props.token);
    }

    if (!this.props.isLoadedTowns) {
      this.props.fetchTowns(this.props.token);
    }
    this.props.fetchClient(this.props.token);
  };

  getTownForCountry = countryId => {
    let towns = [];
    this.props.countries.countryId;
  };

//   setEditClient = ClientData => {
//     this.setState(
//       {
//         ClientEdit: { ...ClientData }
//       },
//       () => {
//         this.props.history.push(EDIT_SUBSCRIPTION_PLAN);
//         setTimeout(() => {
//           window.scrollTo(0, 0);
//         }, 25);
//       }
//     );
//   };

//   deleteClient = ClientId => {
//     this.props.deleteClient(this.props.token, ClientId);
//   };

//   handleSubmitClientData = (
//     ClientData,
//     ClientId,
//     callback
//   ) => {
//     if (pickupId) {
//       this.props.updateClient(
//         this.props.token,
//         { ...ClientData, manager_id: this.props.userId },
//         ClientId,
//         callback
//       );
//     } else {
//       this.props.addClient(
//         this.props.token,
//         { ...ClientData, manager_id: this.props.userId },
//         callback
//       );
//     }
//   };
  // refreshClientTable = () => {
  //   this.props.fetchClient(this.props.token);
  // };


  render() {

    return (
      <ClientView
        data={this.props.clients}
        editData={this.state.ClientEdit}
        isFetchingClient={this.props.isFetchingClient}
        fetchClientError={this.props.fetchClientError}
        countries={this.props.countries}
        towns={this.props.towns}
        // isAddingClient={this.props.isAddingClient}
        // isUpdatingClient={this.props.isUpdatingClient}
        // isDeletingClient={this.props.isDeletingClient}
        // deletingClientId={this.props.deletingClientId}
        // addClientError={this.props.addClientError}
        // submitClientData={this.handleSubmitClientData}
        refreshClientTable={() =>
          this.props.fetchClient(this.props.token)
        }
        columns={[
          {
            Header: "No",
            accessor: "id",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedClient &&
                  this.props.deletingClientId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "First Name",
            accessor: "firstname",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedClient &&
                  this.props.deletingClientId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Last Name",
            accessor: "lastname",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedClient &&
                  this.props.deletingClientId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Phone Number",
            accessor: "phone",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedClient &&
                  this.props.deletingClientId == props.original.id
                }
                item={props.value}
              />
            )
          },
          {
            Header: "Created At",
            accessor: "created_at",
            Cell: props => (
              <CellItem
                deleted={
                  this.props.isDeletedClient &&
                  this.props.deletingClientId == props.original.id
                }
                item={props.value}
              />
            )
          },
          // {
          //   Header: "Duration",
          //   accessor: "duration.fr",
          //   Cell: props => (
          //     <CellItem
          //       deleted={
          //         this.props.isDeletedClient &&
          //         this.props.deletingClientId == props.original.id
          //       }
          //       item={props.value}
          //     />
          //   )
          // },
          // {
          //   Header: "Recommendation",
          //   accessor: "recommended",
          //   Cell: props => (
          //     <CellItem
          //       deleted={
          //         this.props.isDeletedClient &&
          //         this.props.deletingClientId == props.original.id
          //       }
          //       item={props.value}
          //     />
          //   )
          // },
          // {
          //   Header: "",
          //   Cell: props => (
          //     <span>
          //       <Edit
          //         size={18}
          //         className="mr-2 hand-cursor"
          //         color="#1565C0"
          //         onClick={() => this.setEditClient(props.original)}
          //       />
          //       {(this.props.isDeletingClient ||
          //         this.props.isDeletedClient) &&
          //       this.props.deletingClientId == props.original.id ? (
          //         <Loader
          //           size={18}
          //           className="hand-cursor animate-spin"
          //           color="#FF586B"
          //         />
          //       ) : (
          //         <Trash2
          //           size={18}
          //           className="hand-cursor"
          //           color="#FF586B"
          //           onClick={() =>
          //             this.deleteClient(props.original.id)
          //           }
          //         />
          //       )}
          //     </span>
          //   ),
          //   width: 100,
          //   filterable: false,
          //   sortable: false,
          // }
        ]}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientListView);
