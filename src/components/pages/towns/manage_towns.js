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
  LIST_TOWNS_ROUTE,
  ADD_TOWN_ROUTE,
  EDIT_TOWN_ROUTE
} from "../../../constants/app_utils";
import { toastr } from "react-redux-toastr";
import { isNumber } from "util";
import CreateableSelect from "react-select/creatable";

export default class CountryManagementView extends React.Component {
  constructor(props) {
    super(props);
    let data = props.editData ? props.editData : {};
    this.state = this.getFormData(data);
    this.initFormFromRoute(props);
  }
  getFormData = data => {
    const countryName = data.countryName;
    return {
      nameFr: data.nameFr ? data.nameFr : data.name ? data.name.fr : "",
      nameEn: data.nameEn ? data.nameEn : data.name ? data.name.en : "",
      description: data.description ? data.description : "",
      longt:
        data.longt || isNumber(data.longt)
          ? data.longt
          : data.location && (data.location.lng || isNumber(data.location.lng))
          ? data.location.lng
          : "",
      lat:
        data.lat || isNumber(data.longt)
          ? data.lat
          : data.location && (data.location.lat || isNumber(data.location.lng))
          ? data.location.lat
          : "",
      id: data.id ? data.id : null,
      countryId: data.countryId ? data.countryId : -1,
      countryName: data.countryName ? data.countryName : null,
      selectedCountry:
        countryName &&
        this.getCountryFromName(
          countryName.substring(0, countryName.indexOf("||")).trim()
        )
    };
  };
  initFormFromRoute = props => {
    if (!props.match.isExact && props.match.path == ADD_TOWN_ROUTE) {
      const id =
        props.countryId ||
        props.location.pathname
          .substring(ADD_TOWN_ROUTE.length)
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
  getCountryFromName = name => {
    return this.props.countries.reduce((acc, elt) => {
      if (elt && elt.name.en === name) {
        return elt;
      }
      return acc;
    }, "");
  };
  countryInputChanged = elt => {
    const countryName = elt.name.en + " || " + elt.name.fr;
    this.setState({
      countryId: elt.id,
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

    if (!this.state.countryId || this.state.countryId < 0) {
      error = "No country selected";
    } else if (this.state.nameEn.trim().length == 0) {
      error = "English town name is required";
    } else if (this.state.nameFr.trim().length == 0) {
      error = "French town name is required";
    } else if (
      (typeof this.state.longt == "string" &&
        this.state.longt.trim().length == 0) ||
      isNaN(Number(this.state.longt))
    ) {
      error =
        typeof this.state.longt == "string" &&
        this.state.longt.trim().length == 0
          ? "No Longitude provided"
          : "Invalid Longitude provided";
    } else if (
      (typeof this.state.lat == "string" &&
        this.state.lat.trim().length == 0) ||
      isNaN(Number(this.state.lat))
    ) {
      error =
        typeof this.state.lat == "string" && this.state.lat.trim().length == 0
          ? "No Latitude provided"
          : "Invalid Latitude provided";
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
        name: {
          en: this.state.nameEn,
          fr: this.state.nameFr
        },
        description: this.state.description,
        location: {
          lng: this.state.longt,
          lat: this.state.lat
        },
        country_id: this.state.countryId
      };
      this.props.submitTownData(data, this.state.id, (success, errors) => {
        if (!success) {
          this.displayMessage(errors ? errors : "Operation Failed", "error");
        } else {
          const message = this.state.id
            ? "Town was successfully Updated"
            : "Town was successfully added";
          toastr.success(message);
          this.props.history.push(LIST_TOWNS_ROUTE);
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
    return (
      <Fragment>
        <div className="d-flex justify-content-between">
          <ContentHeader>
            {this.state.id ? "Edit Town" : "Add Town"}
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
                      <Label for="userinput1" sm={4}>
                        Country Name:
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
                      <Label for="userinput2" sm={4}>
                        Town Name (EN):
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput2"
                          className="border-primary"
                          name="nameEn"
                          value={this.state.nameEn}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput3" sm={4}>
                        Town Name (FR):
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput3"
                          className="border-primary"
                          name="nameFr"
                          value={this.state.nameFr}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput4" sm={4}>
                        Longitude:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput4"
                          className="border-primary"
                          name="longt"
                          value={this.state.longt}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput5" sm={4}>
                        Latitude:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput5"
                          className="border-primary"
                          name="lat"
                          value={this.state.lat}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput6" sm={4}>
                        Description:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="textarea"
                          rows={5}
                          id="userinput6"
                          className="border-primary"
                          name="description"
                          value={this.state.description}
                          onChange={this.inputChanged}
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
                    onClick={() => this.props.history.push(LIST_TOWNS_ROUTE)}
                  >
                    <X size={16} color="#FFF" /> Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={this.submitInputData}
                    disabled={
                      this.props.isAddingTown || this.props.isUpdatingTown
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
                      {(this.props.isAddingTown ||
                        this.props.isUpdatingTown) && (
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
