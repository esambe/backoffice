import React, {Fragment} from "react";
import "react-table/react-table.css";
import CountryList from "./countries";
import CountryManage from "./manage_countries";
import {Route} from "react-router-dom";
import {ADD_COUNTRY_ROUTE, EDIT_COUNTRY_ROUTE} from "../../../constants/app_utils";

export default class CountryManagementView extends React.Component{
    state = {showCountryEdit:false}
    handleToggleCountryEdit = (toggleState)=>{
        this.setState({
            showCountryEdit: toggleState
        });
    }
    handleSubmitCountryData = (countryData, countryId, callback)=>{
        this.props.submitCountryData(countryData, countryId, callback);
    }
    render(){
        return (
            <Fragment>
                <div>
                    <Route
                        exact
                        path={ADD_COUNTRY_ROUTE}
                        render={matchprops => (
                            <CountryManage 
                                {...this.props} 
                                {...matchprops}
                                editData={null}
                                submitCountryData={this.handleSubmitCountryData} />
                        )}
                    />
                    <Route
                        exact
                        path={EDIT_COUNTRY_ROUTE}
                        render={matchprops => (
                            <CountryManage 
                                {...this.props} 
                                {...matchprops}
                                editData={this.props.editData}
                                submitCountryData={this.handleSubmitCountryData} />
                        )}
                    />
                    <CountryList {...this.props} />
                </div>
            </Fragment>
        )
    }
}