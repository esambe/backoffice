import React, { Fragment } from "react";
import { Card, Col, CardBody, Input, Button } from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { withRouter } from "react-router-dom";
import { ADD_TAXI_ROUTE } from "../../../constants/app_utils";
import { RefreshCcw } from "react-feather";

class TaxiListView extends React.Component {
  state = { townId: -1 };
  handleAddTaxi = () => {
    this.props.history.push(ADD_TAXI_ROUTE);
  };
  handleRefreshTable = () => {
    this.props.refreshTaxisTable();
  };
  showCountriesFor = evt => {
    console.log("val: ", evt.target.value);
    this.setState({
      townId: evt.target.value
    });
  };
  showTownsFor = evt => {
    console.log("val: ", evt.target.value);
    this.setState({
      townId: evt.target.value
    });
  };
  render() {
    return (
      <Fragment>
        <div className="d-flex justify-content-between">
          <ContentHeader>Taxis</ContentHeader>
          {this.props.location.pathname !== ADD_TAXI_ROUTE && (
            <Button size="sm" outline onClick={this.handleAddTaxi}>
              Add New Taxi
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
              disabled={this.props.isFetchingTaixs}
            >
              <RefreshCcw
                size={16}
                color="#E64A19"
                className={`${
                  this.props.isFetchingTaxis ? "animate-spin" : ""
                }`}
              />
            </a>
            <Col md={4} style={{ display: "inline-block" }}>
              <Input
                type="select"
                style={{
                  border: "none",
                  boxShadow: "0px 0px 2px rgba(0,0,0,0.3)"
                }}
                id="userinput1"
                className="border-primary"
                name="nameEn"
                onChange={evt => this.showTownsFor(evt)}
              >
                <option>Towns...</option>
                {this.props.towns.map(elt => (
                  <option value={elt.id}>
                    {elt.name.en + " || " + elt.name.fr}
                  </option>
                ))}
              </Input>
            </Col>
          </div>
          <CardBody>
            <ReactTable
              data={
                this.props.data && this.state.countryId >= 0
                  ? this.props.data.filter(
                      elt => elt.town_id == this.state.townId
                    )
                  : this.props.data
              }
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
export default withRouter(TaxiListView);
