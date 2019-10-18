// import external modules
import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";

import {MAIN_VIEW_ROUTE} from "../../constants/app_utils";
import {GET_TOKEN_URL} from "../../constants/endpoints";
import {apiHttpPOST} from "../../utility/request_helper";
import { connect } from "react-redux";
import * as actions from "../../actions/auth/login_actions";
import {bindActionCreators} from "redux";
import {retrieveLocalStorageUser} from "../../utility/misc"

function mapStateToProps(state){
    return {
        isUserAuthenticated: state.auth.isUserAuthenticated
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actions, dispatch)
}

class ProtectedRoute extends React.Component {
    state = {
        authorized:true,
        loading:false
    }
    componentWillMount(){
        this.checkAuth();
        window.browserHistory = this.props.history;
    }

    componentWillReceiveProps(nextProps){
        this.checkAuth(nextProps)
    }

    checkAuth = (props = this.props)=>{
        const userCred = retrieveLocalStorageUser();
        if(props.isUserAuthenticated){
            this.setState({authorized:false})
        }
        else if(userCred.username && userCred.password){
            this.setState({loading:true});
            apiHttpPOST(GET_TOKEN_URL, null, userCred)
            .then(response=>{
                if(response.status>=200 && response.status<=299){
                    this.setState({authorized:false, loading:false})
                }
                else{
                    this.setState({loading:false})
                }
            }).catch(err=>{
                console.log(err)
                this.setState({loading:false})
            });
        }
    }
    render(){
        const {render, ...rest} = this.props;
        return (
            this.state.loading?
                <div><h4><b>Loading...</b></h4></div>
                :
            this.state.authorized?
                <Route
                    {...rest}
                    render={matchProps => (
                        render(matchProps)
                    )}
                />
            :
                <Redirect to={MAIN_VIEW_ROUTE} />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( withRouter(ProtectedRoute) );
