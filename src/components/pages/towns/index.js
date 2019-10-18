import React, {Fragment} from "react";
import "react-table/react-table.css";
import TownList from "./towns";
import TownManage from "./manage_towns";
import {Route} from "react-router-dom";
import { ADD_TOWN_ROUTE, EDIT_TOWN_ROUTE } from "../../../constants/app_utils";

export default class CountryManagementView extends React.Component{
    state = {showTownEdit:false}
    handleToggleCountryEdit = (toggleState)=>{
        this.setState({
            showTownEdit: toggleState
        });
    }
    handleSubmitTownData = (townData, townId, callback)=>{
        this.props.submitTownData(townData, townId, callback);
    }
    render(){
        return (
            <Fragment>
                <div>
                    <Route
                        path={ADD_TOWN_ROUTE}
                        render={matchprops => (
                            <TownManage 
                                {...this.props} 
                                {...matchprops}
                                editData={null}
                                submitTownData={this.handleSubmitTownData} />
                        )}
                    />
                    <Route
                        exact
                        path={EDIT_TOWN_ROUTE}
                        render={matchprops => (
                            <TownManage 
                                {...this.props} 
                                {...matchprops}
                                editData={this.props.editData}
                                submitTownData={this.handleSubmitTownData} />
                        )}
                    />
                    <TownList {...this.props} />
                </div>
            </Fragment>
        )
    }
}