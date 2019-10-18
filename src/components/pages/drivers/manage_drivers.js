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
  LIST_DRIVER_ROUTE,
  ADD_DRIVER_ROUTE,
  EDIT_DRIVER_ROUTE
} from "../../../constants/app_utils";
import { toastr } from "react-redux-toastr";
import { isNumber, callbackify } from "util";
import { getFilesAsBase64 } from "../../../utility/misc";
import CreateableSelect from "react-select/creatable";

export default class DriverManagementView extends React.Component {
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
      firstname: data.firstname ? data.firstname : "",
      lastname: data.lastname ? data.lastname : "",
      phone: data.phone ? data.phone : "",
      username: data.username ? data.username : "",
      password: data.password ? data.password : "",
      picture: data.picture ? data.picture : "",
      idCardNumber: data.idCardNumber ? data.idCardNumber : "",
      driverLicense: data.driverLicense ? data.driverLicense : "",
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
    if (!props.match.isExact && props.match.path == ADD_DRIVER_ROUTE) {
      const id =
        props.countryId ||
        props.location.pathname
          .substring(ADD_DRIVER_ROUTE.length)
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
  inputFileChanged = e => {
    this.setState({
      [e.target.name]: e.target.files
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

  generatePassword() {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    console.log(retVal);
    return retVal;
  }

  getCountryFromName = name => {
    return this.props.countries.reduce((acc, elt) => {
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
    const countryName = elt.name.en + " || " + elt.name.fr;
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
        : this.state.countryName
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

    if (!this.state.townId || this.state.townId < 0) {
      error = "No town selected";
    } else if (this.state.firstname.trim().length == 0) {
      error = "Driver First name is required";
    } else if (this.state.phone.trim().length == 0) {
      error = "Driver phone number is required";
    } else if (this.state.username.trim().length == 0) {
      error = "Driver username is required";
    } else if (this.state.idCardNumber.trim().length == 0) {
      error = "Driver ID card number is required";
    } else if (this.state.driverLicense.trim().length == 0) {
      error = "Driver License number is required";
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
      console.log(this.state.picture, " uploaded pic");
      getFilesAsBase64(this.state.picture, base64data => {
        let data = {
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          phone: this.state.phone,
          username: this.state.username,
          password: this.generatePassword(),
          picture: base64data[0],
          idCardNumber: this.state.idCardNumber,
          driverLicense: this.state.driverLicense,
          town_id: this.state.townId,
          country_id: this.state.countryId
        };
        console.log(this.password);
        this.props.submitDriverData(data, this.state.id, (success, errors) => {
          if (!success) {
            this.displayMessage(errors ? errors : "Operation Failed", "error");
          } else {
            const message = this.state.id
              ? "Driver was successfully Updated"
              : "Driver was successfully added";
            toastr.success(message);
            this.props.history.push(LIST_DRIVER_ROUTE);
          }
        });
      });
    } else {
      this.displayMessage(errors, "error");
    }
  };
  clearInput = () => {
    this.setData({});
  };

  render() {
    return (
      <Fragment>
        <div className="d-flex justify-content-between">
          <ContentHeader>
            {this.state.id ? "Edit Driver" : "Add Driver"}
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
                <Row />
                <Row>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput3" sm={4}>
                        First Name:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput3"
                          className="border-primary"
                          name="firstname"
                          value={this.state.firstname}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput3" sm={4}>
                        Last Name:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput3"
                          className="border-primary"
                          name="lastname"
                          value={this.state.lastname}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput3" sm={4}>
                        Phone Number:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput3"
                          className="border-primary"
                          name="phone"
                          value={this.state.phone}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput3" sm={4}>
                        Username:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput3"
                          className="border-primary"
                          name="username"
                          value={this.state.username}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput3" sm={4}>
                        Picture:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="file"
                          id="userinput3"
                          className="border-primary"
                          name="picture"
                          //value={this.state.picture}
                          onChange={this.inputFileChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput3" sm={4}>
                        ID card number:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput3"
                          className="border-primary"
                          name="idCardNumber"
                          value={this.state.idCardNumber}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput3" sm={4}>
                        Driving License Number:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput3"
                          className="border-primary"
                          name="driverLicense"
                          value={this.state.driverLicense}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput1" sm={4}>
                        Country:
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
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput1" sm={4}>
                        Town Name:
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
                    onClick={() => this.props.history.push(LIST_DRIVER_ROUTE)}
                  >
                    <X size={16} color="#FFF" /> Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={this.submitInputData}
                    disabled={
                      this.props.isAddinggDriver || this.props.isUpdatingDriver
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
                      {(this.props.isAddingDriver ||
                        this.props.isUpdatingDriver) && (
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
