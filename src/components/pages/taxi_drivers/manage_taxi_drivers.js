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
  ASSIGN_TAXI_DRIVER,
  LIST_TAXI_DRIVER
} from "../../../constants/app_utils";
import { toastr } from "react-redux-toastr";
import { isNumber } from "util";
import { getFilesAsBase64 } from "../../../utility/misc";
import CreateableSelect from "react-select/creatable";

export default class TaxiDriverManagementView extends React.Component {
  constructor(props) {
    super(props);
    let data = props.editData ? props.editData : {};
    this.state = this.getFormData(data);
    this.initFormFromRoute(props);
  }
  getFormData = data => {
    const townId = data.townId;
    const driverId = data.driverId;
    const taxiId = data.taxiId;
    return {
      owner: data.owner ? data.owner : "",
      available: data.available ? data.available : "",
      driverId: data.driverId ? data.driverId : -1,
      driverName: data.firstname ? data.firstname : null,
      selectedDriver: this.getDriverFromId(driverId),
      taxiId: data.taxiId ? data.taxiId : -1,
      selectedTaxi: this.getTaxiFromId(taxiId)
    };
  };
  initFormFromRoute = props => {
    if (!props.match.isExact && props.match.path == ASSIGN_TAXI_DRIVER) {
      const id =
        props.townId ||
        props.location.pathname
          .substring(ASSIGN_TAXI_DRIVER.length)
          .replace(/\//, "");
      if (id && name && !this.componentIsMounted) {
        this.state = this.state ? this.state : {};
      }
    }
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

    if (!this.state.owner || this.state.owner < 0) {
      error = "No owner is provided";
    }

    if (!this.state.driverId || this.state.driverId < 0) {
      error = "No Driver is selected";
    }
    if (!this.state.taxiId || this.state.taxiId < 0) {
      error = "No Taxi is selected";
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
        owner: this.state.owner,
        available: this.state.available,
        driver_id: this.state.driverId,
        taxi_id: this.state.taxi
      };
      this.props.submitTaxiDriverData(
        data,
        this.state.id,
        (success, errors) => {
          if (!success) {
            this.displayMessage(errors ? errors : "Operation Failed", "error");
          } else {
            const message = this.state.id
              ? "Driver was successfully Assign to Taxi"
              : "Driver was successfully Assign to Taxi";
            toastr.success(message);
            this.props.history.push(LIST_TAXI_DRIVER);
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
            {this.state.id ? "Assign Taxi To Driver" : "Edit"}
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
                        Owner:
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
                        Driver
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput3"
                          className="border-primary"
                          name="driverId"
                          value={this.state.driver}
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
                        Taxi
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput3"
                          className="border-primary"
                          name="taxiId"
                          value={this.state.taxi}
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
                    onClick={() => this.props.history.push(LIST_TAXI_DRIVER)}
                  >
                    <X size={16} color="#FFF" /> Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={this.submitInputData}
                    disabled={
                      this.props.isAssigningTaxiDrivers ||
                      this.props.isUpdatingTaxiDrivers
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
                      {(this.props.isAssigningTaxiDrivers ||
                        this.props.isUpdatingTaxiDrivers) && (
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
