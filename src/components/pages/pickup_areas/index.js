import React, {Fragment} from "react";
import "react-table/react-table.css";
import PickupAreaList from "./pickup_areas";
import PickupAreaManage from "./manage_pickup_areas";
import {Route} from "react-router-dom";
import { ADD_PICKUP_AREA_ROUTE, EDIT_PICKUP_AREA_ROUTE } from "../../../constants/app_utils";

export default class PickupAreaManagementView extends React.Component{
    handleSubmitPickupAreaData = (pickupAreaData, pickupAreaId, callback)=>{
        this.props.submitPickupAreaData(pickupAreaData, pickupAreaId, callback);
    }
    render(){
        return (
            <Fragment>
                <div>
                    <Route
                        path={ADD_PICKUP_AREA_ROUTE}
                        render={matchprops => (
                            <PickupAreaManage 
                                {...this.props} 
                                {...matchprops}
                                editData={null}
                                submitPickupAreaData={this.handleSubmitPickupAreaData} />
                        )}
                    />
                    <Route
                        exact
                        path={EDIT_PICKUP_AREA_ROUTE}
                        render={matchprops => (
                            <PickupAreaManage 
                                {...this.props} 
                                {...matchprops}
                                editData={this.props.editData}
                                submitPickupAreaData={this.handleSubmitPickupAreaData} />
                        )}
                    />
                    <PickupAreaList {...this.props} />
                </div>
            </Fragment>
        )
    }
}