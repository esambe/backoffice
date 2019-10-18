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
  LIST_SUBSCRIPTION_PLAN,
  ADD_SUBSCRIPTION_PLAN,
  EDIT_SUBSCRIPTION_PLAN
} from "../../../constants/app_utils";
import { toastr } from "react-redux-toastr";
import { isNumber } from "util";
import CreateableSelect from "react-select/creatable";

export default class SubscriptionPlanManagmentView extends React.Component {
  constructor(props) {
    super(props);
    let data = props.editData ? props.editData : {};
    this.state = this.getFormData(data);
  }

  getFormData = data => {
    return {
      label: data.labele ? data.label : "",
      amount: data.amount ? data.amount : "",
      value: data.period && data.period.value ? data.period.value : "",
      unit: data.period && data.period.unit ? data.period.unit : "",
      id: data.id ? data.id : null,
      commenten: data.comment && data.comment.fr ? data.commenten : "",
      commentfr: data.comment && data.comment.fr ? data.commentfr : "",
      recommended: data.recommended ? data.recommended : false,
      currencyen: data.currency && data.currency.en ? data.currency.en : "",
      currencyfr: data.currency && data.currency.fr ? data.currency.fr : "",
      durationen: data.duration && data.duration.en ? data.durationen : "",
      durationfr: data.duration && data.duration.fr ? data.durationfr : ""
    };
  };
  inputChanged = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  recommendedInputChanged = e => {
    this.setState({
      recommended: e
    });
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
  };
  componentDidMount() {
    this.componentIsMounted = true;
    window.scrollTo(0, 0);
  }

  checkData = () => {
    let error = null;
    let isUpdate = this.state.id ? true : false;

    if (!this.state.label.trim().length == 0) {
      error = "Label is required";
    } else if (
      (typeof this.state.amount == "string" &&
        this.state.amount.trim().length == 0) ||
      isNaN(Number(this.state.amount))
    ) {
      error =
        typeof this.state.amount == "string" &&
        this.state.amount.trim().length == 0
          ? "No amount provided"
          : "Invalide";
    } else if (
      (typeof this.state.value == "string" &&
        this.state.value.trim().length == 0) ||
      isNaN(Number(this.state.value))
    ) {
      error =
        typeof this.state.value == "string" &&
        this.state.value.trim().length == 0
          ? "No Value provided"
          : "Invalid Value provided";
    } else if (!this.state.unit.trim().length == 0) {
      error = "Unit is required";
    } else if (!this.state.recommended.trim().length == 0) {
      error = "Recommended is Required";
    } else if (!this.state.currency.trim().length == 0) {
      error = "Currency is Required";
    } else if (!this.state.duration.trim().length == 0) {
      error = "Duration is Required";
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
        label: this.state.label,
        amount: this.state.amount,
        period: {
          value: this.state.value,
          unit: this.state.unit
        },
        comment: {
          fr: this.state.commentfr,
          en: this.state.commenten
        },
        recommended: this.state.recommended.value,
        currency: {
          fr: this.state.currencyfr,
          en: this.state.currencyen
        },
        duration: {
          fr: this.state.durationfr,
          en: this.state.durationen
        },
        town_id: this.state.townId
      };
      this.props.submitSubscriptionPlanData(
        data,
        this.state.id,
        (success, eheatedrrors) => {
          if (!success) {
            this.displayMessage(errors ? errors : "Operation Failed", "error");
          } else {
            const message = this.state.id
              ? "Pickup area was successfully Updated"
              : "Pickup area was successfully added";
            toastr.success(message);
            this.props.history.push(LIST_SUBSCRIPTION_PLAN);
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
    const recomendationoptions = [
      { lable: "Yes", value: true },
      { lable: "No", value: false }
    ];
    return (
      <Fragment>
        <div className="d-flex justify-content-between">
          <ContentHeader>
            {this.state.id ? "Edit Subscription Plan" : "Add Subscription Plan"}
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
                        Label:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput3"
                          className="border-primary"
                          name="label"
                          pl
                          value={this.state.label}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput3" sm={4}>
                        Amount:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput3"
                          className="border-primary"
                          name="amount"
                          pl
                          value={this.state.amount}
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
                        period:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput4"
                          className="border-primary"
                          name="value"
                          value={this.state.value}
                          onChange={this.inputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput5" sm={4}>
                        Unit:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput5"
                          className="border-primary"
                          name="unit"
                          value={this.state.unit}
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
                        Comment:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput6"
                          placeholder="fr"
                          className="border-primary"
                          name="commentfr"
                          value={this.state.commentfr}
                          onChange={this.inputChanged}
                        />
                        <Input
                          type="text"
                          rows={5}
                          id="userinput6"
                          placeholder="en"
                          className="border-primary"
                          name="commenten"
                          value={this.state.commenten}
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
                        Recommended:
                      </Label>
                      <Col sm={8}>
                        <CreateableSelect
                          options={recomendationoptions}
                          name="status"
                          value={this.state.recommended}
                          getOptionLabel={elt => elt.lable}
                          getOptionValue={elt => elt}
                          onChange={this.recommendedInputChanged}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup row>
                      <Label for="userinput6" sm={4}>
                        Currency:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput6"
                          placeholder="fr"
                          className="border-primary"
                          name="currencyfr"
                          value={this.state.currencyfr}
                          onChange={this.inputChanged}
                        />
                        <Input
                          type="text"
                          rows={5}
                          id="userinput6"
                          placeholder="en"
                          className="border-primary"
                          name="currencyen"
                          value={this.state.currencyen}
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
                        Duration:
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          id="userinput6"
                          placeholder="fr"
                          className="border-primary"
                          name="durationfr"
                          value={this.state.durationfr}
                          onChange={this.inputChanged}
                        />
                        <Input
                          type="text"
                          rows={5}
                          id="userinput6"
                          placeholder="en"
                          className="border-primary"
                          name="durrationen"
                          value={this.state.durrationen}
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
                      this.props.history.push(LIST_SUBSCRIPTION_PLAN)
                    }
                  >
                    <X size={16} color="#FFF" /> Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={this.submitInputData}
                    disabled={
                      this.props.isAddingSubscriptionPlan ||
                      this.props.isUpdatingSubscriptionPlan
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
                      {(this.props.isAddingSubscriptionPlan ||
                        this.props.isUpdatingSubscriptionPlan) && (
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
