import React, {Fragment} from "react";
import {Card, Col, CardBody, Label, Button, Row, UncontrolledAlert, Form, FormGroup, Input} from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import "react-table/react-table.css";
import {X, CheckSquare, RefreshCw} from "react-feather";
import {ClipLoader} from "react-spinners"
import {LIST_USERS_ROUTE, EDIT_USER_ROUTE, CREATE_USER_ROUTE} from "../../../constants/app_utils"
import {cleanObject, validateEmail} from "../../../utility/misc";
import {toastr} from "react-redux-toastr";

export default class UserManagementView extends React.Component{
    constructor(props){
        super(props);
        this.state={};
        let data = props.editData?props.editData:{};
        this.state = this.getFormData(data);
    }
    getFormData=(data)=>{
        return {
            firstname: data.firstname?data.firstname:"",
            lastname: data.lastname?data.lastname:"",
            username: data.username?data.username:"",
            password: data.password?data.password:"",
            cpassword: "",
            email: data.email?data.email:"",
            id: data.id?data.id:null
        }
    }
    inputChanged = (e)=>{
        this.setState({
            [e.target.name] : e.target.value
        });
    }
    setData = (data)=>{
        this.setState( this.getFormData(data) );
    }
    componentWillReceiveProps = (nextProps)=>{
        this.setData(nextProps.editData && nextProps.editData.id === this.state.id? this.state:
                        nextProps.editData?nextProps.editData:this.state.username?this.state:{});
        if(this.props.location === EDIT_USER_ROUTE && nextProps.location === CREATE_USER_ROUTE){
            window.scrollTo(0,0);
        }
    }
    componentDidMount(){
        window.scrollTo(0,0);
    }

    checkData = ()=>{
        let error = null;
        let isUpdate = this.state.id?true:false;

        if(this.state.firstname.trim().length==0){
            error = "User's First Name is required!";
        }
        else if(this.state.lastname.trim().length==0){
            error="User's Last Name is required!"
        }
        else if(this.state.username.trim().length==0){
            error="User's Username is required!"
        }
        else if(!isUpdate && this.state.password.trim().length==0){
            error="User's Password is required!"
        }
        else if(this.state.email.trim().length==0){
            error="User's Email is required!"
        }
        else if(!validateEmail(this.state.email)){
            error= "Email is invalid!"
        }
        else if(!isUpdate && this.state.password !== this.state.cpassword){
            error = "Confirmation Password does not match"
        }

        return error;
    }
    displayMessage = (message, type, timeout=5000)=>{
        this.setState({
            message: type!="error"?message:null,
            error: type=="error"?message:null
        }, ()=>{
            setTimeout(() => {
                 this.setState({message:null, error:null})   
            }, timeout);
        })
    }
    submitInputData = (e)=>{
        e.preventDefault();
        const errors = this.checkData()
        if(!errors){
            let {firstname, lastname, username, password, email} = this.state;
            this.props.submitUserData(
                    cleanObject({firstname, lastname, username, password, email}), this.state.id, (success, errors)=>{
                        if(!success){
                            this.displayMessage(errors?errors:"Operation Failed", "error");
                        }else{
                            const message = this.state.id? "User was successfully Updated":"User was successfully created";
                            toastr.success(message);
                            this.props.history.push(LIST_USERS_ROUTE);
                        }  
                    });
        }else{
            this.displayMessage(errors, "error");
        }
    }
    clearInput = ()=>{
        this.setData({});
    }


    render(){
        return (
            <Fragment>
                <div className="d-flex justify-content-between">
                    <ContentHeader>{this.state.id?"Edit User":"Create User"}</ContentHeader>
                </div>
                <Card>
                    <CardBody>
                        <Form className="form-horizontal">
                            {(this.state.error || this.state.message) && 
                                <UncontrolledAlert color={this.state.error?"danger":"success"}>
                                    {this.state.error?this.state.error:this.state.message}        
                                </UncontrolledAlert>
                            }
                            <div className="form-body">
                                <Row>
                                    <Col md="6">
                                    <FormGroup row>
                                        <Label for="userinput1" sm={4}>First Name:</Label>
                                        <Col sm={8}>
                                            <Input type="text" id="userinput1" className="border-primary"  name="firstname" value={this.state.firstname} onChange={this.inputChanged} />
                                        </Col>
                                    </FormGroup>
                                    </Col>
                                    <Col md="6">
                                    <FormGroup row>
                                        <Label for="userinput2" sm={4}>Last Name:</Label>
                                        <Col sm={8}>
                                            <Input type="text" id="userinput2" className="border-primary"  name="lastname" value={this.state.lastname} onChange={this.inputChanged} />
                                        </Col>
                                    </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup row>
                                            <Label for="userinput3" sm={4}>Username:</Label>
                                            <Col sm={8}>
                                                <Input type="text" id="userinput3" className="border-primary"  name="username" value={this.state.username} onChange={this.inputChanged} />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                    <FormGroup row>
                                        <Label for="userinput4" sm={4}>Email:</Label>
                                        <Col sm={8}>
                                            <Input type="email" id="userinput4" className="border-primary"  name="email" value={this.state.email} onChange={this.inputChanged} />
                                        </Col>
                                    </FormGroup>
                                    </Col>
                                </Row>
                                {!this.state.id &&
                                    <Row>
                                        <Col md="6">
                                            <FormGroup row>
                                                <Label for="userinput5" sm={4}>Password:</Label>
                                                <Col sm={8}>
                                                    <Input type="password" id="userinput5" className="border-primary"  name="password" value={this.state.password} onChange={this.inputChanged} />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup row>
                                                <Label for="userinput6" sm={4}>Confirm Password:</Label>
                                                <Col sm={8}>
                                                    <Input type="password" id="userinput6" className="border-primary"  name="cpassword" value={this.state.cpassword} onChange={this.inputChanged} />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                }
                            </div>
                            

                            <div className="form-actions" style={{display:"flex", justifyContent:"space-between"}}>
                                <div>
                                {!this.state.id&&
                                    <Button color="warning" className="mr-1" onClick={this.clearInput}>
                                        <RefreshCw size={15} /> Clear
                                    </Button>
                                }   
                                </div>
                                <div>
                                    <Button color="warning" className="mr-1" onClick={()=>this.props.history.push(LIST_USERS_ROUTE)}>
                                        <X size={16} color="#FFF" /> Cancel
                                    </Button>
                                    <Button color="primary" onClick={this.submitInputData} disabled={this.props.isCreatingUser||this.props.isUpdatingUser}>
                                        <div style={{display:'flex', justifyContent:"center", alignItems:"center"}}>
                                        <span style={{marginRight:5}}><CheckSquare size={16} color="#FFF" /></span>
                                        <span style={{marginRight:5}}> {this.state.id?"Update":"Create"} </span> 
                                        {(this.props.isCreatingUser||this.props.isUpdatingUser) &&
                                            <ClipLoader size={20} color="white" />
                                        }
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </Fragment>
        )
    }
}