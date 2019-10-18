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
  LIST_PICKUP_AREAS_ROUTE,
  ADD_PICKUP_AREA_ROUTE,
  EDIT_PICKUP_AREA_ROUTE
} from "../../../constants/app_utils";
import { toastr } from "react-redux-toastr";
import { isNumber } from "util";
import CreateableSelect from "react-select/creatable";

export default class PickupAreaManagementView extends React.Component {
  constructor(props) {
    super(props);
    let data = props.editData ? props.editData : {};
    this.state = this.getFormData(data);
    this.initFormFromRoute(props);
  }
  getFormData = data => {
    const townName = data.townName;
    return {
      name: data.name ? data.name : "",
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
    if (!props.match.isExact && props.match.path == ADD_PICKUP_AREA_ROUTE) {
      const id =
        props.townId ||
        props.location.pathname
          .substring(ADD_PICKUP_AREA_ROUTE.length)
          .replace(/\//, "");
      const name = props.towns.reduce((acc, elt) => {
        if (elt.id == id) {
          return elt.name.en + " || " + elt.name.fr;
        } else return acc;
      }, null);

      if (id && name && this.componentIsMounted) {
        this.setState({
          townId: Number.parseInt(id),
          townName: name,
          selectedTown: this.getTownFromName(
            name.substring(0, name.indexOf("||")).trim()
          )
        });
      } else if (id && name && !this.componentIsMounted) {
        this.state = this.state ? this.state : {};
        this.state = {
          ...this.state,
          townId: Number.parseInt(id),
          townName: name,
          selectedTown: this.getTownFromName(
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
  getTownFromName = name => {
    return this.props.towns.reduce((acc, elt) => {
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

    if (!this.state.townId || this.state.townId < 0) {
      error = "No town selected";
    } else if (this.state.name.trim().length == 0) {
      error = "Pickup area name is required";
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
        name: this.state.name,
        description: this.state.description,
        location: {
          lng: this.state.longt,
          lat: this.state.lat
        },
        town_id: this.state.townId
      };
      this.props.submitPickupAreaData(
        data,
        this.state.id,
        (success, errors) => {
          if (!success) {
            this.displayMessage(errors ? errors : "Operation Failed", "error");
          } else {
            const message = this.state.id
              ? "Pickup area was successfully Updated"
              : "Pickup area was successfully added";
            toastr.success(message);
            this.props.history.push(LIST_PICKUP_AREAS_ROUTE);
          }
        }
      );
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
            {this.state.id ? "Edit Pickup Area" : "Add Pickup Area"}
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
                      <Label for="userinput1" sm={4}>
                        Town Name:
                      </Label>
                      <Col sm={8}>
                        <CreateableSelect
                          options={this.props.towns}
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
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput3" sm={4}>
                        Pickup Area Name:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput3"
                          className="border-primary"
                          name="name"
                          value={this.state.name}
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
                    onClick={() =>
                      this.props.history.push(LIST_PICKUP_AREAS_ROUTE)
                    }
                  >
                    <X size={16} color="#FFF" /> Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={this.submitInputData}
                    disabled={
                      this.props.isAddingPickupArea ||
                      this.props.isUpdatingPickupArea
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
                      {(this.props.isAddingPickupArea ||
                        this.props.isUpdatingPickupArea) && (
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
