import React, {Fragment} from "react";
import {Card, Col, CardBody, Label, Button, Row, UncontrolledAlert, Form, CustomInput, FormGroup, Input} from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import "react-table/react-table.css";
import {X, CheckSquare, RefreshCw} from "react-feather";
import {ClipLoader} from "react-spinners"
import {LIST_COUNTRIES_ROUTE} from "../../../constants/app_utils"
import {fromUrlToBase64, fromUrlToBase64WithConversion, convertSvgToPngData} from "../../../utility/misc";
import {toastr} from "react-redux-toastr";
import CreateableSelect from "react-select/creatable";

export default class CountryManagementView extends React.Component{
    constructor(props){
        super(props);
        this.state={};
        let data = props.editData?props.editData:{};
        this.state = this.getFormData(data);
    }
    getFormData=(data)=>{
        return {
            nameFr:data.nameFr?data.nameFr:data.name?data.name.fr:"",
            nameEn:data.nameEn?data.nameEn:data.name?data.name.en:"",
            description: data.description?data.description:"",
            flag:data.flag && data.flag.picture?data.flag.picture: data.flag?data.flag:"",
            id: data.id?data.id:null,
            countryCode: data.countryCode?data.countryCode:data.country_code,
            selectedCountry: this.getCountryFromName(data.nameEn?data.nameEn:data.name?data.name.en:"")
        }
    }
    getCountryFromName = (name)=>{
        return this.props.allCountries.reduce((acc, elt)=>{
            if(elt && elt.en === name){   return elt;  }
            return acc;
        }, "")
    }
    inputChanged = (e)=>{
        this.setState({
            [e.target.name] : e.target.value
        });
    }
    handleCountryInputChanged(elt){
        console.log("triggered elt is ", elt)
        this.setState({
            selectedCountry: elt,
            nameEn: elt.en,
            nameFr: elt.fr,
            flag: elt.flag,
            countryCode: elt.countryCode
        });
    }
    setData = (data)=>{
        this.setState( this.getFormData(data) );
    }
    componentWillReceiveProps = (nextProps)=>{
        this.setData(nextProps.editData && nextProps.editData.id === this.state.id? this.state:
                        nextProps.editData?nextProps.editData:this.state.username?this.state:{});
    }
    componentDidMount(){
        window.scrollTo(0,0);
    }

    checkData = ()=>{
        let error = null;
        let isUpdate = this.state.id?true:false;

        if(this.state.nameEn.trim().length==0 || this.state.nameFr.trim().length==0){
             error = "No country selected!";
        }
        else if(this.state.countryCode.trim().length==0){
            error = "Country Code is required!";
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
            this.setState({uploadingImage:true})
            convertSvgToPngData(this.state.flag, (flagData)=>{
                console.log("flag data ", flagData)
                this.setState({uploadingImage:false})
                let data = {
                    name:{
                        en: this.state.nameEn,
                        fr: this.state.nameFr
                    },
                    description: this.state.description,
                    flag:{
                        picture: flagData
                    },
                    country_code: this.state.countryCode
                };
                this.props.submitCountryData(
                    data, this.state.id, (success, errors)=>{
                        if(!success){
                            this.displayMessage(errors?errors:"Operation Failed", "error");
                        }else{
                            const message = this.state.id? "Country was successfully Updated":"Country was successfully added";
                            toastr.success(message);
                            this.props.history.push(LIST_COUNTRIES_ROUTE);
                        }  
                    }
                );
            })
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
                    <ContentHeader>{this.state.id?"Edit Country":"Add Country"}</ContentHeader>
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
                                        <Label for="userinput1" sm={4}>Country Name (en):</Label>
                                        <Col sm={8}>
                                            <CreateableSelect
                                                options={this.props.allCountries}
                                                getOptionLabel={(elt)=>elt.en}
                                                getOptionValue={(elt)=>elt.en}
                                                value={this.state.selectedCountry}
                                                onChange={(elt)=>this.handleCountryInputChanged(elt)}
                                            />
                                        </Col>
                                    </FormGroup>
                                    </Col>
                                    <Col md="6">
                                    <FormGroup row>
                                        <Label for="userinput2" sm={4}>Country Name (fr):</Label>
                                        <Col sm={8}>
                                            <CreateableSelect
                                                options={this.props.allCountries}
                                                getOptionLabel={(elt)=>elt.fr}
                                                getOptionValue={(elt)=>elt.fr}
                                                value={this.state.selectedCountry}
                                                onChange={(elt)=>this.handleCountryInputChanged(elt)}
                                            />
                                        </Col>
                                    </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <Row>
                                            <Col md="12">
                                                <FormGroup row>
                                                    <Label for="userinput3" sm={4}>Country Code:</Label>
                                                    <Col sm={8}>
                                                        <Input type="text" id="userinput3" className="border-primary"  name="countryCode" value={this.state.countryCode} onChange={this.inputChanged} />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col md="12">
                                                <FormGroup row>
                                                    <Label for="userinput4" sm={4}>Description:</Label>
                                                    <Col sm={8}>
                                                        <Input type="textarea" rows={4} id="userinput4" className="border-primary"  name="description" value={this.state.description} onChange={this.inputChanged} />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>    
                                    </Col>
                                    <Col md="6">
                                        <FormGroup row>
                                            <Label for="userinput5" sm={4}>Flag:</Label>
                                            {this.state.flag&&
                                                <Col sm={8}>
                                                    <img src={this.state.flag} alt="Loading..." width={"100%"}/>
                                                </Col>
                                            }
                                        </FormGroup>
                                    </Col>
                                </Row>
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
                                    <Button color="warning" className="mr-1" onClick={()=>this.props.history.push(LIST_COUNTRIES_ROUTE)}>
                                        <X size={16} color="#FFF" /> Cancel
                                    </Button>
                                    <Button color="primary" onClick={this.submitInputData} disabled={this.props.isAddingCountry||this.props.isUpdatingCountry}>
                                        <div style={{display:'flex', justifyContent:"center", alignItems:"center"}}>
                                        <span style={{marginRight:5}}><CheckSquare size={16} color="#FFF" /></span>
                                        <span style={{marginRight:5}}> {this.state.id?"Update":"Add"} </span> 
                                        {(this.props.isAddingCountry||this.props.isUpdatingCountry||this.state.uploadingImage) &&
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