import React, { Fragment } from "react";
import {
  Card,
  Col,
  CardBody,
  Label,
  Button,
  Row,
  UncontrolledAlert,
  Form,
  CustomInput,
  FormGroup,
  Input
} from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import "react-table/react-table.css";
import { X, CheckSquare, RefreshCw } from "react-feather";
import { ClipLoader } from "react-spinners";
import {
  LIST_TAXI_ROUTE,
  ADD_TAXI_ROUTE,
  EDIT_TAXI_ROUTE
} from "../../../constants/app_utils";
import { toastr } from "react-redux-toastr";
import { isNumber } from "util";
import CreateableSelect from "react-select/creatable";

export default class TaxiManagementView extends React.Component {
  constructor(props) {
    super(props);
    let data = props.editData ? props.editData : {};
    this.state = this.getFormData(data);
    this.state = { ...this.state, selectedCountryTowns: this.props.towns };
    this.initFormFromRoute(props);
  }

  getFormData = data => {
    const townName = data.townName;
    const countryName = data.countryName;
    return {
      registrationNumber: data.registrationNumber
        ? data.registrationNumber
        : "",
      grayCard: data.grayCard ? data.grayCard : "",
      carBrand: data.carBrand ? data.carBrand : "",
      model: data.model ? data.model : "",
      status: data.status ? data.status : "",
      heated: data.heated ? data.heated : "",
      id: data.id ? data.id : null,
      countryId: data.countryId ? data.countryId : -1,
      countryName: data.countryName ? data.countryName : null,
      selectedCountry:
        countryName &&
        countryName.trim().length > 0 &&
        this.getCountryFromName(
          countryName.substring(0, countryName.indexOf("||")).trim()
        ),
      townId: data.townId ? data.townId : -1,
      townName: data.townName ? data.townName : null,
      selectedTown:
        townName &&
        townName.trim().length > 0 &&
        this.getTownFromName(
          townName.substring(0, townName.indexOf("||")).trim()
        )
    };
  };

  initFormFromRoute = props => {
    if (!props.match.isExact && props.match.path == ADD_TAXI_ROUTE) {
      const id =
        props.countryId ||
        props.location.pathname
          .substring(ADD_TAXI_ROUTE.length)
          .replace(/\//, "");
      const name = props.countries.reduce((acc, elt) => {
        if (elt.id == id) {
          return elt.name.en + " || " + elt.name.fr;
        } else return acc;
      }, null);

      if (id && name && this.componentIsMounted) {
        this.setState({
          countryId: Number.parseInt(id),
          countryName: name,
          selectedCountry: this.getCountryFromName(
            name.substring(0, name.indexOf("||")).trim()
          )
        });
      } else if (id && name && !this.componentIsMounted) {
        this.state = this.state ? this.state : {};
        this.state = {
          ...this.state,
          countryId: Number.parseInt(id),
          countryName: name,
          selectedCountry: this.getCountryFromName(
            name.substring(0, name.indexOf("||")).trim()
          )
        };
      }
    }
  };

  inputChanged = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  heatedInputChanged = e => {
    this.setState({
      heated: e
    });
  };
  statusInputChange = e => {
    this.setState({
      status: e
    });
  };

  getTownFromName = name => {
    return this.props.towns.reduce((acc, elt) => {
      if (elt && elt.name.en === name) {
        return elt;
      }
      return acc;
    }, "");
  };

  getCountryFromName = name => {
    return this.props.countries.reduce((acc, elt) => {
      console.log("get country");
      if (elt && elt.name.en === name) {
        return elt;
      }
      return acc;
    }, "");
  };

  townInputChanged = elt => {
    const townName = elt.name.en + " || " + elt.name.fr;
    this.setState({
      townId: elt.id,
      townName,
      selectedTown: this.getTownFromName(elt.name.en)
    });
  };

  countryInputChanged = elt => {
    const countryName = elt.name.en + "||" + elt.name.fr;
    this.setState({
      countryId: elt.id,
      selectedCountryTowns: this.props.towns.filter(
        town => town.country_id === elt.id
      ),
      countryName,
      selectedCountry: this.getCountryFromName(elt.name.en)
    });
  };
  setData = data => {
    this.setState(this.getFormData(data));
  };

  componentWillReceiveProps = nextProps => {
    this.setData(
      nextProps.editData && nextProps.editData.id === this.state.id
        ? this.state
        : nextProps.editData
        ? nextProps.editData
        : this.state.townName
        ? this.state
        : {}
    );
    this.initFormFromRoute(nextProps);
  };

  componentDidMount() {
    this.componentIsMounted = true;
    window.scrollTo(0, 0);
  }

  checkData = () => {
    let error = null;
    let isUpdate = this.state.id ? true : false;

    if (this.state.registrationNumber.trim().length == 0) {
      error = "Taxi number is required";
    }
    if (this.state.carBrand.trim().length == 0) {
      error = "Please enter the car's Brand";
    }
    if (this.state.grayCard.trim().length == 0) {
      error = " Please enter the gray card's number";
    }
    if (this.state.model.trim().length == 0) {
      error = "Please enter your taxi model";
    }
    // if (this.state.heated.trim().length == 0) {
    //   error = "chose yes or no if the taxi have AC";
    // }
    if (!this.state.countryId || this.state.countryId < 0) {
      error = "Please select a Country";
    }
    if (!this.state.townId || this.state.townId < 0) {
      error = "No Town selected";
    }
    return error;
  };

  displayMessage = (message, type, timeout = 5000) => {
    this.setState(
      {
        message: type != "error" ? message : null,
        error: type == "error" ? message : null
      },
      () => {
        setTimeout(() => {
          this.setState({ message: null, error: null });
        }, timeout);
      }
    );
  };

  submitInputData = e => {
    e.preventDefault();
    const errors = this.checkData();
    if (!errors) {
      let data = {
        registrationNumber: this.state.registrationNumber,
        grayCard: this.state.grayCard,
        carBrand: this.state.carBrand,
        model: this.state.model,
        status: this.state.status.value,
        heated: this.state.heated.value,
        country_id: this.state.countryId,
        town_id: this.state.townId
      };
      console.log(this.carBrand);
      this.props.submitTaxiData(data, this.state.id, (success, errors) => {
        if (!success) {
          this.displayMessage(errors ? errors : "Operation Failed", "error");
        } else {
          const message = this.state.id
            ? "Taxi was successfully Updated"
            : "Taxi was successfully added";
          toastr.success(message);
          this.props.history.push(LIST_TAXI_ROUTE);
        }
      });
    } else {
      this.displayMessage(errors, "error");
    }
  };
  clearInput = () => {
    this.setData({});
  };
  render() {
    const heatedoptions = [
      { lable: "Yes", value: true },
      { lable: "No", value: false }
    ];
    const statusoptions = [
      { lable: "1", value: 1 },
      { lable: "2", value: 2 },
      { lable: "3", value: 3 },
      { lable: "4", value: 4 },
      { lable: "5", value: 5 }
    ];
    return (
      <Fragment>
        <div className="d-flex justify-content-between">
          <ContentHeader>
            {this.state.id ? "Edit Taxi" : "Add Taxi"}
          </ContentHeader>
        </div>
        <Card>
          <CardBody>
            <Form className="form-horizontal">
              {(this.state.error || this.state.message) && (
                <UncontrolledAlert
                  color={this.state.error ? "danger" : "success"}
                >
                  {this.state.error ? this.state.error : this.state.message}
                </UncontrolledAlert>
              )}
              <div className="form-body">
                <Row>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput2" sm={4}>
                        Taxi Registration Number:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput2"
                          className="border-primary"
                          name="registrationNumber"
                          value={this.state.registrationNumber}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput2" sm={4}>
                        Taxi Gray Card Number:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput2"
                          className="border-primary"
                          name="grayCard"
                          value={this.state.grayCard}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput2" sm={4}>
                        Taxi Brand:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput2"
                          className="border-primary"
                          name="carBrand"
                          value={this.state.carBrand}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput2" sTaxiManagementViewm={4}>
                        Taxi Model:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          TaxiManagementView
                          id="userinput2"
                          TaxiManagementView
                          className="border-priTaxiManagementViewmary"
                          name="model"
                          TaxiManagementView
                          value={this.state.model}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput2" sm={4}>
                        Taxi Status:
                      </Label>
                      <Col sm={8}>
                        <CreateableSelect
                          options={statusoptions}
                          name="status"
                          value={this.state.status}
                          getOptionLabel={elt => elt.lable}
                          getOptionValue={elt => elt}
                          onChange={this.statusInputChange}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput2" sm={4}>
                        AC Existence ?:
                      </Label>
                      <Col sm={8}>
                        <CreateableSelect
                          options={heatedoptions}
                          name="heated"
                          getOptionLabel={elt => elt.lable}
                          getOptionValue={elt => elt}
                          value={this.state.heated}
                          onChange={this.heatedInputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput1" sm={4}>
                        Ride Country:
                      </Label>
                      <Col sm={8}>
                        <CreateableSelect
                          options={this.props.countries}
                          getOptionLabel={elt =>
                            elt.name.en + " || " + elt.name.fr
                          }
                          getOptionValue={elt => elt}
                          value={this.state.selectedCountry}
                          onChange={elt => this.countryInputChanged(elt)}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput1" sm={4}>
                        Ride Town:
                      </Label>
                      <Col sm={8}>
                        <CreateableSelect
                          options={this.state.selectedCountryTowns}
                          getOptionLabel={elt =>
                            elt.name.en + " || " + elt.name.fr
                          }
                          getOptionValue={elt => elt}
                          value={this.state.selectedTown}
                          onChange={elt => this.townInputChanged(elt)}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              <div
                className="form-actions"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div>
                  {!this.state.id && (
                    <Button
                      color="warning"
                      className="mr-1"
                      onClick={this.clearInput}
                    >
                      <RefreshCw size={15} /> Clear
                    </Button>
                  )}
                </div>
                <div>
                  <Button
                    color="warning"
                    className="mr-1"
                    onClick={() => this.props.history.push(LIST_TAXI_ROUTE)}
                  >
                    <X size={16} color="#FFF" /> Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={this.submitInputData}
                    disabled={
                      this.props.isAddingTaxi || this.props.isUpdatingTaxi
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <span style={{ marginRight: 5 }}>
                        <CheckSquare size={16} color="#FFF" />
                      </span>
                      <span style={{ marginRight: 5 }}>
                        {" "}
                        {this.state.id ? "Update" : "Add"}{" "}
                      </span>
                      {(this.props.isAddingTaxi ||
                        this.props.isUpdatingTaxi) && (
                        <ClipLoader size={20} color="white" />
                      )}
                    </div>
                  </Button>
                </div>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}
