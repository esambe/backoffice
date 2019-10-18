import React, { Fragment } from "react";
import { Card, Col, CardBody, Input, Button } from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { withRouter } from "react-router-dom";
import { ADD_DRIVER_ROUTE } from "../../../constants/app_utils";
import { RefreshCcw } from "react-feather";

class DriversListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryId: -1,
      selectedCountryTowns: this.props.towns,
      selectedDrivers: this.props.data
    };
  }

  handleAddDriver = () => {
    this.props.history.push(ADD_DRIVER_ROUTE);
  };
  handleRefreshTable = () => {
    this.props.refreshDriversTable();
  };
  showTownsFor = townId => {
    this.setState({
      townId: townId,
      selectedDrivers: Number.isInteger(townId)
        ? this.props.data.filter(driver => driver.town_id === townId)
        : this.props.data
    });
  };
  showCountriesFor = countryId => {
    //console.log("val:", evt.target.value);
    this.setState({
      countryId: countryId,
      selectedCountryTowns: this.props.towns.filter(
        town => town.country_id === countryId
      )
    });
  };

  componentWillReceiveProps = nextProps => {
    this.setState(
      {
        selectedCountryTowns:
          this.state.selectedCountryTowns.length > 0
            ? this.state.selectedCountryTowns
            : nextProps.towns,
        selectedDrivers:
          this.state.selectedDrivers.length > 0
            ? this.state.selectedDrivers
            : nextProps.data
      },
      () => {
        this.showCountriesFor(this.state.countryId);
        this.showTownsFor(this.state.townId);
      }
    );
  };
  render() {
    return (
      <Fragment>
        <div className="d-flex justify-content-between">
          <ContentHeader>DRIVERS</ContentHeader>
          {this.props.location.pathname !== ADD_DRIVER_ROUTE && (
            <Button size="sm" outline onClick={this.handleAddDriver}>
              Add New Driver
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
              disabled={this.props.isFetchingDrivers}
            >
              <RefreshCcw
                size={16}
                color="#E64A19"
                className={`${
                  this.props.isFetchingDrivers ? "animate-spin" : ""
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
                onChange={evt => this.showCountriesFor(+evt.target.value)}
              >
                <option>All countries...</option>
                {this.props.countries &&
                  this.props.countries.map(elt => (
                    <option value={elt.id}>
                      {elt.name.en + " || " + elt.name.fr}
                    </option>
                  ))}
              </Input>
            </Col>
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
                onChange={evt => this.showTownsFor(+evt.target.value)}
              >
                <option>All Towns...</option>
                {this.state.selectedCountryTowns &&
                  this.state.selectedCountryTowns.map(elt => (
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
                this.state.selectedDrivers
                /* this.props.data && this.state.countryId >= 0
                  ? this.props.data.filter(
                      elt => elt.country_id == this.state.countryId
                    )
                  : this.props.data */
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

export default withRouter(DriversListView);
