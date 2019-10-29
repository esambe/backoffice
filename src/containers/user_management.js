import React from "react";
import UsersView from "../components/pages/users";
import * as fetchActions from "../actions/users/fetch_user_actions";
import * as fetchRoleActions from "../actions/roles/fetch_user_role_actions";
import * as createActions from "../actions/users/create_user_actions";
import * as updateActions from "../actions/users/update_user_actions";
import * as deleteActions from "../actions/users/delete_user_actions";
import {logoutUser} from "../actions/auth/login_actions";
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import { Edit, Trash2, Loader } from 'react-feather';
import {EDIT_USER_ROUTE} from "../constants/app_utils";
import {toastr} from "react-redux-toastr";


function mapStateToProps(state){
    return {
        token: state.auth.userToken,
        users: state.users.allUsers,
        appRoles: state.appRoles.appRoles,
        isFetchingUsers: state.users.isFetchingUsers,
        isLoadedUsers: state.users.isLoadedUsers,
        isCreatingUser: state.users.isCreatingUser,
        isCreatedUser: state.users.isCreatedUser,
        isUpdatingUser: state.users.isUpdatingUser,
        isUpdatedUser: state.users.isUpdatedUser,
        isDeletingUser: state.users.isDeletingUser,
        isDeletedUser: state.users.isDeletedUser,
        deletingUserId: state.users.deletingUserId,
        createUserError: state.users.createUserError,
        fetchUserError: state.users.createUserError,
        updateUserError: state.users.createUserError
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({...fetchActions, ...createActions, ...updateActions, ...deleteActions, ...fetchRoleActions, logoutUser:()=>logoutUser(dispatch)}, dispatch)
}

function CellItem(props){
    return (
        <div style={{width:"100%", height:"100%", backgroundColor:props.deleted?"#ef9a9a":""}}>
            {props.item}
        </div>
    )
}

class UsersListView extends React.Component{
    state={
        userIdEdit:null,
        userDataEdit:null
    }

    componentDidMount(){
        this.props.fetchAllUsers(this.props.token);
    }

    setEditUser = (userId, userData)=>{
        this.setState({
            userDataEdit: userData,
            userIdEdit: userId
        }, ()=>{
            this.props.history.push(EDIT_USER_ROUTE)
            setTimeout(() => {
                window.scrollTo(0,0);
            }, 25);
        });
    }

    deleteUserData = (userId)=>{
        if(window.currentCtx.cred.userId == userId){
            toastr.confirm("You are currently logged in as this user and you will be automatically logged out if you proceed with this operation. Continue?",
            {
                onOk: ()=>{
                    this.props.deleteUserData(this.props.token, userId);
                    this.props.logoutUser();
                }
            })
        }else{
            this.props.deleteUserData(this.props.token, userId);
        }
        
    }

    handleSumbitUserData = (userData, userId, callback)=>{
        if(userId){
            this.props.updateUserData(this.props.token, userData, userId, callback);
        }else{
            this.props.createNewUser(this.props.token, userData, callback)
        }
    }
    
    render(){
        return(
            <UsersView
                data = {this.props.users}
                editData = {this.state.userDataEdit}
                isFetchingUsers = {this.props.isFetchingUsers}
                isLoadedUsers = {this.props.isLoadedUsers}
                isCreatingUser = {this.props.isCreatingUser}
                isCreatedUser = {this.props.isCreatedUser}
                isUpdatingUser = {this.props.isUpdatingUser}
                isUpdatedUser = {this.props.isUpdatedUser}
                createUserError = {this.props.createUserError}
                updateUserError = {this.props.updateUserError}
                submitUserData = {this.handleSumbitUserData}
                refreshUsersTable = {()=>this.props.fetchAllUsers(this.props.token)}
                columns={[
                    {Header: "First Name", accessor:"firstname", Cell: props=><CellItem deleted={(this.props.isDeletedUser && this.props.deletingUserId == props.original.id)} item={props.value} />},
                    {Header: "Last Name", accessor:"lastname", Cell: props=><CellItem deleted={(this.props.isDeletedUser && this.props.deletingUserId == props.original.id)} item={props.value} />},
                    {Header: "User Name", accessor:"username", Cell: props=><CellItem deleted={(this.props.isDeletedUser && this.props.deletingUserId == props.original.id)} item={props.value} />},
                    {Header: "Email", accessor:"email", Cell: props=><CellItem deleted={(this.props.isDeletedUser && this.props.deletingUserId == props.original.id)} item={props.value} />},
                    {Header:"",
                                Cell:props=> <span> 
                                                <Edit size={18} className="mr-2 hand-cursor" color="#1565C0" onClick={()=>this.setEditUser(props.original.id, props.original)}/> 
                                                { (this.props.isDeletingUser||this.props.isDeletedUser) && this.props.deletingUserId == props.original.id?
                                                    <Loader size={18}
                                                        className="hand-cursor animate-spin" 
                                                        color="#FF586B"/>
                                                    :
                                                    <Trash2 size={18}
                                                        className="hand-cursor" 
                                                        color="#FF586B" onClick={()=>this.deleteUserData(props.original.id)} />    

                                                }
                                             </span>,
                                                      width:70, filterable:false, sortable:false}
                ]} />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersListView);