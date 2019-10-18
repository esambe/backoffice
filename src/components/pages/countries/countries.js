import React, {Fragment} from "react";
import {Card, Col, CardBody, CardHeader, Button} from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { withRouter } from 'react-router-dom';
import {LIST_COUNTRIES_ROUTE, ADD_COUNTRY_ROUTE} from "../../../constants/app_utils";
import {RefreshCcw} from "react-feather";

class CountriesListView extends React.Component{
    handleAddCountry = ()=>{
        this.props.history.push(ADD_COUNTRY_ROUTE)
    }
    handleRefreshTable = ()=>{
        this.props.refreshCountriesTable()
    }
    render(){
        return (
            <Fragment>
                <div className="d-flex justify-content-between">
                    <ContentHeader>Countries</ContentHeader>
                    {this.props.location.pathname !== ADD_COUNTRY_ROUTE &&
                        <Button size="sm" outline onClick={this.handleAddCountry}>Add Country</Button>
                    }
                </div>
                <Card>
                    <div className="ml-1">
                        <a onClick={()=>this.handleRefreshTable()} disabled={this.props.isFetchingCountries}> 
                            <RefreshCcw 
                                size={16} 
                                color="#E64A19" 
                                className={`${(this.props.isFetchingAppCountries||this.props.isFetchingAllCountries)?"animate-spin":""}`}/>
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

export default withRouter(CountriesListView)