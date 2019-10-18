import React from "react";
import PickupAreaView from "../components/pages/pickup_areas/index";
import * as fetchTownsActions from "../actions/town/fetch_town_actions";
import * as fetchActions from "../actions/pickup_areas/fetch_pickup_areas_actions";
import * as addActions from "../actions/pickup_areas/add_pickup_area_actions";
import * as updateActions from "../actions/pickup_areas/update_pickup_area_actions";
import * as deleteActions from "../actions/pickup_areas/delete_pickup_area_actions";
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import { Edit, Trash2, Trash, PlusCircle, Loader } from 'react-feather';
import { EDIT_PICKUP_AREA_ROUTE } from "../constants/app_utils";


function mapStateToProps(state){
    return {
        token: state.auth.userToken,
        userId: state.auth.userId,
        towns: state.towns.towns,

        pickupAreas: state.pickup_areas.pickupAreas,
        
        isFetchingTowns: state.towns.isFetchingTowns,
        isLoadedTowns: state.towns.isLoadedTowns,

        isFetchingPickupAreas: state.pickup_areas.isFetchingPickupAreas,
        isLoadedPickupAreas: state.pickup_areas.isLoadedPickupAreas,

        isAddingPickupArea: state.pickup_areas.isAddingPickupArea,
        isAddedPickupArea: state.pickup_areas.isAddedPickupArea,

        isUpdatingPickupArea: state.pickup_areas.isUpdatingPickupArea,
        isUpdatedPickupArea: state.pickup_areas.isUpdatedPickupArea,
    
        isDeletingPickupArea: state.pickup_areas.isDeletingPickupArea,
        isDeletedPickupArea: state.pickup_areas.isDeletedPickupArea,
        deletingPickupAreaId: state.pickup_areas.deletingPickupAreaId,
        
        fetchPickupAreasError: state.pickup_areas.fetchPickupAreasError,
        loadPickupAreasError: state.pickup_areas.loadPickupAreaError,
        addPickupAreasError: state.pickup_areas.addPickupAreaError
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({...fetchActions, ...addActions, ...updateActions, ...deleteActions, ...fetchTownsActions}, dispatch)
}

function CellItem(props){
    return (
        <div style={{width:"100%", height:"100%", backgroundColor:props.deleted?"#ef9a9a":""}}>
            {props.item||typeof props.item === "number" ?props.item:props.children}
        </div>
    )
}

class PickupAreaListView extends React.Component{
    state={
        townId:null,
        pickupAreaIdEdit:null,
        pickupAreaDataEdit:null
    }

    componentDidMount(){
        this.refreshPickupAreasTable();
    }

    setEditPickupArea = (pickupAreaData)=>{
        let townId = pickupAreaData.town_id;
        let townName = this.props.towns.reduce((acc, elt)=>{
            if(elt.id == townId){
                return elt.name.en+" || "+elt.name.fr;
            }
            return acc;
        }, "");
        this.setState({
            pickupAreaDataEdit: {...pickupAreaData, townId, townName},
        }, ()=>{
            this.props.history.push(EDIT_PICKUP_AREA_ROUTE)
            setTimeout(() => {
                window.scrollTo(0,0);
            }, 25);
        });
    }

    deletePickupArea = (pickupId)=>{
        this.props.deletePickupArea(this.props.token, pickupId);
    }

    handleSubmitPickupAreaData = (pickupAreaData, pickupId, callback)=>{
        if(pickupId){
            this.props.updatePickupArea(this.props.token, {...pickupAreaData, manager_id:this.props.userId}, pickupId, callback);
        }else{
            this.props.addPickupArea(this.props.token, {...pickupAreaData, manager_id:this.props.userId}, callback)
        }
    }
    refreshPickupAreasTable = ()=>{
        if (!this.props.isLoadedTowns){
            this.props.fetchTowns(this.props.token);
        }
        this.props.fetchPickupAreas(this.props.token)
    }
    
    render(){
        return(
            <PickupAreaView
                data = {this.props.pickupAreas}
                towns = {this.props.towns}
                editData = {this.state.pickupAreaDataEdit}
                isFetchingPickupAreas = {this.props.isFetchingPickupAreas}
                fetchPickupAreasError = {this.props.fetchPickupAreasError}
                isAddingPickupArea = {this.props.isAddingPickupArea}
                isUpdatingPickupArea = {this.props.isUpdatingPickupArea}
                isDeletingPickupArea = {this.props.isDeletingPickupArea}
                deletingPickupAreaId = {this.props.deletingPickupAreaId}
                addPickupAreaError = {this.props.addPickupAreaError}
                submitPickupAreaData = {this.handleSubmitPickupAreaData}
                refreshPickupAreasTable = {()=>this.props.fetchPickupAreas(this.props.token)}
                columns={[
                    {Header: "Pickup Area", accessor:"name", Cell: props=><CellItem deleted={(this.props.isDeletedPickupArea && this.props.deletingPickupAreaId == props.original.id)} item={props.value} />},
                    {Header: "Longitude", accessor:"location.lng", Cell: props=><CellItem deleted={(this.props.isDeletedPickupArea && this.props.deletingPickupAreaId == props.original.id)} item={props.value} />},
                    {Header: "Latitude", accessor:"location.lat", Cell: props=><CellItem deleted={(this.props.isDeletedPickupArea && this.props.deletingPickupAreaId == props.original.id)} item={props.value} />},
                    {Header: "Description", accessor:"description", Cell: props=><CellItem deleted={(this.props.isDeletedPickupArea && this.props.deletingPickupAreaId == props.original.id)} item={props.value} />},
                    {Header:"",
                                Cell:props=> <span> 
                                                <Edit size={18} className="mr-2 hand-cursor" color="#1565C0" onClick={()=>this.setEditPickupArea(props.original)}/> 
                                                { ((this.props.isDeletingPickupArea||this.props.isDeletedPickupArea) && this.props.deletingPickupAreaId == props.original.id)?
                                                    <Loader size={18}
                                                        className="hand-cursor animate-spin" 
                                                        color="#FF586B"/>
                                                    :
                                                    <Trash2 size={18}
                                                        className="hand-cursor" 
                                                        color="#FF586B" onClick={()=>this.deletePickupArea(props.original.id)} />    

                                                }
                                             </span>,
                                                      width:100, filterable:false, sortable:false}
                ]} />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PickupAreaListView);