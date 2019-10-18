import React from "react";
import ClientView from "../components/pages/clients/index";
import * as fetchActions from "../actions/clients/fetch_client_actions";
// import * as addActions from "../actions/clients/add_clients_actions";
// import * as updateActions from "../actions/clients/update_subscription_plans_actions";
//import * as deleteActions from "../actions/subscription_plans/delete_subscription_plans_actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Edit, Trash2, Trash, PlusCircle, Loader } from "react-feather";
// import { EDIT_SUBSCRIPTION_PLAN } from "../constants/app_utils";

function mapStateToProps(state) {
  return {
    token: state.auth.userToken,
    userId: state.auth.userId,

    clients: state.clients.clients,

    isFetchingClient: state.clients.isFetchingClient,
    isLoadedClient: state.clients.isLoadedClient,

    fetchClientError: state.clients.fetchClientError,
    loadClientError: state.clients.ClientError
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...fetchActions,
    //   ...addActions,
    //   ...updateActions,
    //   ...deleteActions
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
  refreshClientTable = () => {
    this.props.fetchClient(this.props.token);
  };

  render() {
    return (
      <ClientView
        data={this.props.clients}
        editData={this.state.ClientEdit}
        isFetchingClient={this.props.isFetchingClient}
        fetchClientError={this.props.fetchClientError}
        // isAddingClient={this.props.isAddingClient}
        // isUpdatingClient={this.props.isUpdatingClient}
        // isDeletingClient={this.props.isDeletingClient}
        // deletingClientId={this.props.deletingClientId}
        addClientError={this.props.addClientError}
        submitClientData={this.handleSubmitClientData}
        refreshClientTable={() =>
          this.props.fetchClient(this.props.token)
        }
        columns={[
          {
            Header: "Label",
            accessor: "label",
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
            Header: "Amount",
            accessor: "amount",
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
            Header: "Period",
            accessor: "period.value",
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
            Header: "Period Unit",
            accessor: "period.unit",
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
            Header: "Currency",
            accessor: "currency.en",
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
            Header: "Duration",
            accessor: "duration.fr",
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
            Header: "Recommendation",
            accessor: "recommended",
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
            Header: "",
            Cell: props => (
              <span>
                <Edit
                  size={18}
                  className="mr-2 hand-cursor"
                  color="#1565C0"
                  onClick={() => this.setEditClient(props.original)}
                />
                {(this.props.isDeletingClient ||
                  this.props.isDeletedClient) &&
                this.props.deletingClientId == props.original.id ? (
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
                      this.deleteClient(props.original.id)
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
)(ClientListView);
