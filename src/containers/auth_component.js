import React from "react";
import {LOGIN_VIEW_ROUTE, LOCAL_STORAGE_TOKEN_KEY} from "../constants/app_utils";
import {CHECK_TOKEN_URL} from "../constants/endpoints";
import {apiHttpPOST} from "../utility/request_helper";
import { connect } from "react-redux";
import * as actions from "../actions/auth/login_actions";
import {bindActionCreators} from "redux";

function mapStateToProps(state){
    return {
        isUserAuthenticated: state.auth.isUserAuthenticated
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actions, dispatch)
}

export default function ProtectedComponent(Component, props){
    const userSavedToken = window.localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    class AuthenticatedComponent extends React.Component{
        componentWillMount(){
            console.log("checking in")
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps){
            console.log("next props called")
            this.checkAuth(nextProps)
        }

        checkAuth = (props = this.props)=>{
            if(!userSavedToken){
                window.browserHistory.push(LOGIN_VIEW_ROUTE);
            }
            else if(!props.isUserAuthenticated){
                apiHttpPOST(CHECK_TOKEN_URL, null, {token:userSavedToken})
                .then(response=>{
                    if(response.status>=200 && response.status<=299){
                        this.props.loginUserSuccess(userSavedToken);
                    }
                    else{
                        window.localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
                        window.browserHistory.push(LOGIN_VIEW_ROUTE);
                    }
                }).catch(err=>{
                    if(err && err.response && err.response.status == 403){
                        window.browserHistory.push(LOGIN_VIEW_ROUTE);
                    }else{
                        console.log("this should not happen")
                    }
                })
            }
        }
        render(){
            return (
                <div>
                    { this.props.isUserAuthenticated?
                        <Component {...props} /> : null
                    }
                </div>
            )
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}