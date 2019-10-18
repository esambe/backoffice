import React, {Fragment} from "react";
import {Card, Col, CardBody, CardHeader, Button} from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { withRouter } from 'react-router-dom';
//import {LIST_COUNTRIES_ROUTE, ADD_COUNTRY_ROUTE} from "../../../constants/app_utils";
import {RefreshCcw} from "react-feather";
import Select from "react-select";

class ClientsListView extends React.Component{
    // handleAddCountry = ()=>{
    //     this.props.history.push(ADD_COUNTRY_ROUTE)
    // }
    handleRefreshTable = ()=>{
        this.props.refreshClientsTable()
    }

    render(){
        return (
            <Fragment>
                <div className="d-flex justify-content-between">
                    <ContentHeader>Clients</ContentHeader>
                </div>
                <div className="row py-3">
                    <div className="col-sm-3">
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            // defaultValue={this.props.countryOptions[0]}
                            name="color"
                            options={this.props.countryOptions}
                        />
                    </div>
                    <div className="col-sm-3">
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            // defaultValue={colourOptions[0]}
                            name="color"
                            // options={colourOptions}
                        />
                    </div>
                    <div className="col-sm-3 ml-auto">
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            // defaultValue={colourOptions[0]}
                            name="color"
                            // options={colourOptions}
                        />
                    </div>
                </div>
                <Card>
                    <div className="ml-1">
                        <a onClick={()=>this.handleRefreshTable()} disabled={this.props.isFetchingClient}> 
                            <RefreshCcw 
                                size={16} 
                                color="#E64A19" 
                                className={`${( this.props.isFetchingClient )?"animate-spin":""}`}/>
                        </a>
                    </div>
                    <CardBody>
                        <ReactTable
                            data = {this.props.data}
                            columns = {this.props.columns}
                            defaultPageSize = {this.props.defaultPageSize?this.props.defaultPageSize:10}
                            className="-striped -highlight"
                            // filterable
                        />
                    </CardBody>
                </Card>
            </Fragment>
        )
    }
}

export default withRouter(ClientsListView)