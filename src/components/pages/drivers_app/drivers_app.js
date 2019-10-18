import React, { Fragment } from "react";
import { Card, Col, CardBody, Input, Button } from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { withRouter } from "react-router-dom";
import { RefreshCcw } from "react-feather";

class DriversAppListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryId: -1,
      selectedCountryTowns: this.props.towns,
      selectedDrivers: this.props.data
    };
  }

  handleRefreshTable = () => {
    this.props.refreshDriversAppTable();
  };
  showTownsFor = evt => {
    console.log("val:", evt.target.value, this.props.data);
    this.setState({
      townId: evt.target.value,
      selectedDrivers: Number.isInteger(+evt.target.value)
        ? this.props.data.filter(driver => driver.town_id === +evt.target.value)
        : this.props.data
    });
  };
  showCountriesFor = evt => {
    //console.log("val:", evt.target.value);
    this.setState({
      countryId: evt.target.value,
      selectedCountryTowns: this.props.towns.filter(
        town => town.country_id === +evt.target.value
      )
    });
  };

  // componentWillReceiveProps = nextProps => {
  //   this.setState({
  //     selectedCountryTowns:
  //       this.state.selectedCountryTowns.length > 0
  //         ? this.state.selectedCountryTowns
  //         : nextProps.towns,
  //     selectedDrivers:
  //       this.state.selectedDrivers.length > 0
  //         ? this.state.selectedDrivers
  //         : nextProps.data
  //   });
  // };
  render() {
    return (
      <Fragment>
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
                onChange={evt => this.showCountriesFor(evt)}
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
                onChange={evt => this.showTownsFor(evt)}
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
                this.state.selectedDrivers &&
                this.props.data &&
                this.state.countryId >= 0
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

export default withRouter(DriversAppListView);
