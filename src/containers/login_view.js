import { connect } from "react-redux";
import * as actions from "../actions/auth/login_actions";
import { bindActionCreators } from 'redux'
import LoginView from '../components/pages/login'

function mapStateToProps(state){
    return {
        isAuthenticatingUser: state.auth.isAuthenticatingUser,
        isUserAuthenticated: state.auth.isUserAuthenticated,
        userToken: state.auth.userToken,
        authError: state.auth.authError
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)( LoginView );