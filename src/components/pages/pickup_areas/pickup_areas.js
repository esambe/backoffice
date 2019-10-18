import React, { Fragment } from "react";
import { Card, Col, CardBody, Input, Button } from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { withRouter } from "react-router-dom";
import { ADD_PICKUP_AREA_ROUTE } from "../../../constants/app_utils";
import { RefreshCcw } from "react-feather";

class PickupAreasListView extends React.Component {
  state = { townId: -1 };
  handleAddPickupArea = () => {
    this.props.history.push(ADD_PICKUP_AREA_ROUTE);
  };
  handleRefreshTable = () => {
    this.props.refreshPickupAreasTable();
  };
  showPickupAreasFor = evt => {
    this.setState({
      townId: evt.target.value
    });
  };
  render() {
    return (
      <Fragment>
        <div className="d-flex justify-content-between">
          <ContentHeader>Pickup Areas</ContentHeader>
          {this.props.location.pathname !== ADD_PICKUP_AREA_ROUTE && (
            <Button size="sm" outline onClick={this.handleAddPickupArea}>
              Add Pickup Area
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
              disabled={this.props.isFetchingPickupAreas}
            >
              <RefreshCcw
                size={16}
                color="#E64A19"
                className={`${
                  this.props.isFetchingPickupAreas ? "animate-spin" : ""
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
                onChange={evt => this.showPickupAreasFor(evt)}
              >
                <option>All Towns...</option>
                {this.props.towns &&
                  this.props.towns.map(elt => (
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
                this.props.data && this.state.townId >= 0
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

export default withRouter(PickupAreasListView);
