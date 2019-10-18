import React, {Fragment} from "react";
import {Card, Col, CardBody, CardHeader, Button} from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import "react-table/react-table.css";
import UserList from "./users";
import UserManage from "./manage_user";
import {Route} from "react-router-dom";
import {CREATE_USER_ROUTE, EDIT_USER_ROUTE} from "../../../constants/app_utils";

export default class UserManagementView extends React.Component{
    state = {showUserEdit:false}
    handleToggleUserEdit = (toggleState)=>{
        this.setState({
            showUserEdit: toggleState
        });
    }
    handleSubmitUserData = (userData, userId, callback)=>{
        this.props.submitUserData(userData, userId, callback);
    }
    render(){
        return (
            <Fragment>
                <div>
                    <Route
                        exact
                        path={CREATE_USER_ROUTE}
                        render={matchprops => (
                            <UserManage 
                                {...this.props} 
                                {...matchprops}
                                editData={null}
                                submitUserData={this.handleSubmitUserData} />
                        )}
                    />
                    <Route
                        exact
                        path={EDIT_USER_ROUTE}
                        render={matchprops => (
                            <UserManage 
                                {...this.props} 
                                {...matchprops}
                                editData={this.props.editData}
                                submitUserData={this.handleSubmitUserData} />
                        )}
                    />
                    <UserList {...this.props} />
                </div>
            </Fragment>
        )
    }
}