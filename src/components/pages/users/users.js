import React, {Fragment} from "react";
import {Card, Col, CardBody, CardHeader, Button} from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { withRouter } from 'react-router-dom';
import {CREATE_USER_ROUTE, EDIT_USER_ROUTE} from "../../../constants/app_utils";
import {RefreshCcw} from "react-feather";

class UsersListView extends React.Component{
    handleCreateNewUser = ()=>{
        this.props.history.push(CREATE_USER_ROUTE)
    }
    handleRefreshTable = ()=>{
        this.props.refreshUsersTable()
    }
    render(){
        return (
            <Fragment>
                <div className="d-flex justify-content-between">
                    <ContentHeader>Users</ContentHeader>
                    {this.props.location.pathname !== CREATE_USER_ROUTE &&
                        <Button size="sm" outline onClick={this.handleCreateNewUser}>Add New User</Button>
                    }
                </div>
                <Card>
                    <div className="ml-1">
                        <a onClick={()=>this.handleRefreshTable()} disabled={this.props.isFetchingUsers}> 
                            <RefreshCcw 
                                size={16} 
                                color="#E64A19" 
                                className={`${this.props.isFetchingUsers?"animate-spin":""}`}/>
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

export default withRouter(UsersListView)