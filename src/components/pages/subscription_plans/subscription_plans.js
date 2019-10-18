import React, { Fragment } from "react";
import { Card, Col, CardBody, Input, Button } from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { withRouter } from "react-router-dom";
import { ADD_SUBSCRIPTION_PLAN } from "../../../constants/app_utils";
import { RefreshCcw } from "react-feather";

class SubscriptionPlanListView extends React.Component {
  handleAddSubscriptionPlan = () => {
    this.props.history.push(ADD_SUBSCRIPTION_PLAN);
  };
  handleRefreshTable = () => {
    this.props.refreshSubscriptionPlansTable();
  };
  render() {
    return (
      <Fragment>
        <div className="d-flex justify-content-between">
          <ContentHeader>Subscription Plans</ContentHeader>
          {this.props.location.pathname !== ADD_SUBSCRIPTION_PLAN && (
            <Button size="sm" outline onClick={this.handleAddSubscriptionPlan}>
              Add Subscription Plan
            </Button>
          )}
        </div>
        <Card>
          <div
            className="ml-1"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10
            }}
          >
            <a
              onClick={() => this.handleRefreshTable()}
              disabled={this.props.isFetchingSubscriptionPlan}
            >
              <RefreshCcw
                size={16}
                color="#E64A19"
                className={`${
                  this.props.isFetchingSubscriptionPlan ? "animate-spin" : ""
                }`}
              />
            </a>
          </div>
          <CardBody>
            <ReactTable
              data={this.props.data}
              columns={this.props.columns}
              defaultPageSize={
                this.props.defaultPageSize ? this.props.defaultPageSize : 10
              }
              className="-striped -highlight"
            />
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}

export default withRouter(SubscriptionPlanListView);
