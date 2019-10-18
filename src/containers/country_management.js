import React from "react";
import CountryView from "../components/pages/countries";
import * as fetchActions from "../actions/country/fetch_country_actions";
import * as addActions from "../actions/country/add_country_actions";
import * as updateActions from "../actions/country/update_country_actions";
import * as deleteActions from "../actions/country/delete_country_actions";
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import { Edit, Trash2, Loader, PlusSquare } from 'react-feather';
import {EDIT_COUNTRY_ROUTE, ADD_TOWN_ROUTE} from "../constants/app_utils";
import {toastr} from "react-redux-toastr";


function mapStateToProps(state){
    return {
        token: state.auth.userToken,
        userId: state.auth.userId,
        appCountries: state.countries.appCountries,
        allCountries: state.countries.allCountries,

        isFetchingAppCountries: state.countries.isFetchingAppCountries,
        isLoadedAppCountries: state.countries.isLoadedAppCountries,

        isFetchingAllCountries: state.countries.isFetchingAllCountries,
        isLoadedAllCountries: state.countries.isLoadedAllCountries,

        isAddingCountry: state.countries.isAddingCountry,
        isAddedCountry: state.countries.isAddedCountry,

        isUpdatingCountry: state.countries.isUpdatingCountry,
        isUpdatedCountry: state.countries.isUpdatedCountry,

        isDeletingCountry: state.countries.isDeletingCountry,
        isDeletedCountry: state.countries.isDeletedCountry,
        deletingCountryId: state.countries.deletingCountryId,
        
        fetchCountriesError: state.countries.fetchCountriesError,
        loadCountriesError: state.countries.loadCountriesError,
        addCountryError: state.countries.addCountryError
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({...fetchActions, ...addActions, ...updateActions, ...deleteActions}, dispatch)
}

function CellItem(props){
    return (
        <div style={{width:"100%", height:"100%", backgroundColor:props.deleted?"#ef9a9a":""}}>
            {props.item?props.item:props.children}
        </div>
    )
}

class CountryListView extends React.Component{
    state={
        countryIdEdit:null,
        countryDataEdit:null
    }

    componentDidMount(){
        if (!this.props.isLoadedAllCountries){
            this.props.loadExtCountries();
        }
        this.props.fetchAppCountries(this.props.token);
    }

    setEditCountry = (countryId, countryData)=>{
        this.setState({
            countryDataEdit: countryData,
            countryIdEdit: countryId
        }, ()=>{
            this.props.history.push(EDIT_COUNTRY_ROUTE)
            setTimeout(() => {
                window.scrollTo(0,0);
            }, 25);
        });
    }

    setAddTown = (countryId)=>{
        this.props.history.push(`${ADD_TOWN_ROUTE}/${countryId}`);
    }

    deleteCountry = (countryId)=>{
        this.props.deleteCountry(this.props.token, countryId);
    }

    handleSumbitCountryData = (countryData, countryId, callback)=>{
        if(countryId){
            this.props.updateCountry(this.props.token, {...countryData, manager_id:this.props.userId}, countryId, callback);
        }else{
            this.props.addCountry(this.props.token, {...countryData, manager_id:this.props.userId}, callback)
        }
    }
    
    render(){
        return(
            <CountryView
                data = {this.props.appCountries}
                allCountries = {this.props.allCountries}
                editData = {this.state.countryDataEdit}
                isFetchingAllCountries = {this.props.isFetchingAllCountries}
                isFetchingAppCountries = {this.props.isFetchingAppCountries}
                fetchCountriesError = {this.props.isCreatingUser}
                isAddingCountry = {this.props.isAddingCountry}
                isUpdatingCountry = {this.props.isUpdatingCountry}
                addCountryError = {this.props.addCountryError}
                loadCountriesError = {this.props.isCreatedUser}
                submitCountryData = {this.handleSumbitCountryData}
                refreshCountriesTable = {()=>this.props.fetchAppCountries(this.props.token)}
                columns={[
                    {Header: "", accessor:"flag.picture", width:50, 
                                    Cell: props=>
                                            <CellItem deleted={(this.props.isDeletedCountry && this.props.deletingCountryId == props.original.id)}>
                                                <img src={props.value} width="100%" height="100%" alt=" "/>
                                            </CellItem>},
                    {Header: "Name (En)", accessor:"name.en", Cell: props=><CellItem deleted={(this.props.isDeletedCountry && this.props.deletingCountryId == props.original.id)} item={props.value} />},
                    {Header: "Name (Fr)", accessor:"name.fr", Cell: props=><CellItem deleted={(this.props.isDeletedCountry && this.props.deletingCountryId == props.original.id)} item={props.value} />},
                    {Header: "Description", accessor:"description", Cell: props=><CellItem deleted={(this.props.isDeletedCountry && this.props.deletingCountryId == props.original.id)} item={props.value} />},
                    {Header:"",
                                Cell:props=> <span> 
                                                <PlusSquare size={18} className="mr-2 hand-cursor" color="#00897B" onClick={()=>this.setAddTown(props.original.id)}/> 
                                                <Edit size={18} className="mr-2 hand-cursor" color="#1565C0" onClick={()=>this.setEditCountry(props.original.id, props.original)}/> 
                                                { ((this.props.isDeletingCountry||this.props.isDeletedCountry) && this.props.deletingCountryId == props.original.id)?
                                                    <Loader size={18}
                                                        className="hand-cursor animate-spin" 
                                                        color="#FF586B"/>
                                                    :
                                                    <Trash2 size={18}
                                                        className="hand-cursor" 
                                                        color="#FF586B" onClick={()=>this.deleteCountry(props.original.id)} />    

                                                }
                                             </span>,
                                                      width:100, filterable:false, sortable:false}
                ]} />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountryListView);