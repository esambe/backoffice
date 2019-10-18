import React, {Fragment} from "react";
import {Card, Col, CardBody, CardHeader, Button} from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { withRouter } from 'react-router-dom';
//import {LIST_COUNTRIES_ROUTE, ADD_COUNTRY_ROUTE} from "../../../constants/app_utils";
import {RefreshCcw} from "react-feather";

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
                        />
                    </CardBody>
                </Card>
            </Fragment>
        )
    }
}

export default withRouter(ClientsListView)