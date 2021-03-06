import React, {Fragment} from "react";
import {Card, Col, CardBody, CardHeader, Button, Input} from "reactstrap";
import ContentHeader from "../../contentHead/contentHeader";
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { withRouter } from 'react-router-dom';
//import {LIST_COUNTRIES_ROUTE, ADD_COUNTRY_ROUTE} from "../../../constants/app_utils";
import {RefreshCcw} from "react-feather";
import Select from "react-select";

class ClientsListView extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
          countryId: -1,
          selectedCountryTowns: this.props.towns,
          selectedClients: this.props.data,
          search: ''
        };
        // this.filterBy = this.filterBy.bind(this);
      }


      showTownsFor = townId => {
        this.setState({
          townId: townId,
          selectedClients: Number.isInteger(townId)
            ? this.props.data.filter(client => client.town_id === townId)
            : this.props.data
        });
      };

      filterBy = e => {
        const updatedList = this.props.data.filter( client => client.firstname  === e.target.value || client.laststname  === e.target.value );
        this.setState({ selectedClients : [] ? updatedList : this.props.data });
      };

      showCountriesFor = countryId => {
        //console.log("val:", evt.target.value);
        this.setState({
          countryId: countryId,
          selectedCountryTowns: this.props.towns.filter(
            town => town.country_id === countryId
          )
        });
      };
    
      componentWillReceiveProps = nextProps => {
        this.setState(
          {
            selectedCountryTowns:
              this.state.selectedCountryTowns.length > 0
                ? this.state.selectedCountryTowns
                : nextProps.towns,
            selectedClients:
              this.state.selectedClients.length > 0
                ? this.state.selectedClients
                : nextProps.data
          },
          () => {
            this.showCountriesFor(this.state.countryId);
            this.showTownsFor(this.state.townId);
          }
        );
    };

    handleRefreshTable = ()=>{
        this.props.refreshClientsTable()
    };

    render(){
        return (
            <Fragment>
                <div className="d-flex justify-content-between">
                    <ContentHeader>Clients</ContentHeader>
                </div>
                <div className="row py-3">
                    <div className="col-sm-3">
                    <Input
                        type="select"
                        style={{
                        border: "none",
                        boxShadow: "0px 0px 2px rgba(0,0,0,0.3)"
                        }}
                        id="userinput1"
                        className="border-primary"
                        name="nameEn"
                        onChange={evt => this.showCountriesFor(+evt.target.value)}
                    >
                        <option>All countries...</option>
                        {this.props.countries &&
                        this.props.countries.map(elt => (
                            <option value={elt.id}>
                            {elt.name.en + " || " + elt.name.fr}
                            </option>
                        ))}
                    </Input>
                    </div>
                    <div className="col-sm-3">
                        <Input
                            type="select"
                            style={{
                            border: "none",
                            boxShadow: "0px 0px 2px rgba(0,0,0,0.3)"
                            }}
                            id="userinput1"
                            className="border-primary"
                            name="nameEn"
                            onChange={evt => this.showTownsFor(+evt.target.value)}
                        >
                            <option>All Towns...</option>
                            {this.state.selectedCountryTowns &&
                            this.state.selectedCountryTowns.map(elt => (
                                <option value={elt.id}>
                                {elt.name.en + " || " + elt.name.fr}
                                </option>
                            ))}
                        </Input>
                    </div>
                    <div className="col-sm-3 ml-auto">
                    <Input
                            type="text"
                            style={{
                            border: "none",
                            boxShadow: "0px 0px 2px rgba(0,0,0,0.3)"
                            }}
                            id="userinput1"
                            className="border-primary"
                            name="nameEn"
                            onChange={this.filterBy}
                        />
                    </div>
                </div>
                <Card>
                    <div className="ml-1">
                        <a onClick={()=>this.handleRefreshTable()} disabled={this.props.isFetchingClient}> 
                            <RefreshCcw 
                                size={16} 
                                color="#E64A19" 
                                className={`${( this.props.isFetchingClient )?"animate-spin":""}`}/>
                        </a>
                    </div>
                    <CardBody>
                        <ReactTable
                            data = {this.state.selectedClients}
                            columns = {this.props.columns}
                            defaultPageSize = {this.props.defaultPageSize?this.props.defaultPageSize:10}
                            className="-striped -highlight"
                            // filterable
                        />
                    </CardBody>
                </Card>
            </Fragment>
        )
    }
}

export default withRouter(ClientsListView)