import React, { Fragment } from "react";
import { Card, Col, CardBody, Input, Button } from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { withRouter } from "react-router-dom";
import { ADD_TOWN_ROUTE } from "../../../constants/app_utils";
import { RefreshCcw } from "react-feather";

class TownsListView extends React.Component {
  state = { countryId: -1 };
  handleAddTown = () => {
    this.props.history.push(ADD_TOWN_ROUTE);
  };
  handleRefreshTable = () => {
    this.props.refreshTownsTable();
  };
  showTownsFor = evt => {
    console.log("val: ", evt.target.value);
    this.setState({
      countryId: evt.target.value
    });
  };
  render() {
    return (
      <Fragment>
        <div className="d-flex justify-content-between">
          <ContentHeader>Towns</ContentHeader>
          {this.props.location.pathname !== ADD_TOWN_ROUTE && (
            <Button size="sm" outline onClick={this.handleAddTown}>
              Add Town
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
              disabled={this.props.isFetchingTowns}
            >
              <RefreshCcw
                size={16}
                color="#E64A19"
                className={`${
                  this.props.isFetchingTowns ? "animate-spin" : ""
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
                <option>All countries...</option>
                {this.props.countries.map(elt => (
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
                      elt => elt.country_id == this.state.countryId
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

export default withRouter(TownsListView);
