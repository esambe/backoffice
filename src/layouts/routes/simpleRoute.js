// import external modules
import React from "react";
import { Route } from "react-router-dom";

export default class SimpleRoute extends React.Component {
    componentWillMount(){
        window.browserHistory = this.props.history;
    }

    componentWillReceiveProps(nextProps){
        window.browserHistory = nextProps.history;
    }

    render(){
        const {render, ...rest} = this.props;
        return (
            <Route
                {...rest}
                render={matchProps => (
                    render(matchProps)
                )}
            />
        );
    }
}