// import external modules
import React, { Component } from "react";

import { Home, ChevronRight, BarChart2, Users } from "react-feather";
import { NavLink } from "react-router-dom";
import {
  MAIN_VIEW_ROUTE,
  ADD_COUNTRY_ROUTE,
  LIST_COUNTRIES_ROUTE,
  LIST_USERS_ROUTE,
  LIST_TOWNS_ROUTE,
  LIST_PICKUP_AREAS_ROUTE,
  LIST_DRIVER_ROUTE,
  LIST_TAXI_ROUTE,
  LIST_TAXI_DRIVER,
  LIST_DRIVERS_APP,
  LIST_SUBSCRIPTION_PLAN, 
  LIST_CLIENTS,
  LIST_REQUESTS
} from "../../../../constants/app_utils";

// Styling
import "../../../../assets/scss/components/sidebar/sidemenu/sidemenu.scss";
// import internal(own) modules
import SideMenu from "../sidemenuHelper";

class SideMenuContent extends Component {
  render() {
    return (
      <SideMenu
        className="sidebar-content"
        toggleSidebarMenu={this.props.toggleSidebarMenu}
      >
        <SideMenu.MenuSingleItem>
          <NavLink to={MAIN_VIEW_ROUTE} activeClassName="active">
            <i className="menu-icon">
              <BarChart2 size={18} />
            </i>
            <span className="menu-item-text">Dashboard</span>
          </NavLink>
        </SideMenu.MenuSingleItem>
        <SideMenu.MenuSingleItem>
          <NavLink to={LIST_USERS_ROUTE} activeClassName="active">
            <i className="menu-icon">
              <Users size={18} />
            </i>
            <span className="menu-item-text">Users</span>
          </NavLink>
        </SideMenu.MenuSingleItem>
        <SideMenu.MenuMultiItems
          name="Manage"
          Icon={<Home size={18} />}
          ArrowRight={<ChevronRight size={16} />}
          collapsedSidebar={this.props.collapsedSidebar}
        >
          <NavLink
            to={LIST_COUNTRIES_ROUTE}
            exact
            className="item"
            activeClassName="active"
          >
            <span className="menu-item-text">Countries</span>
          </NavLink>
          <NavLink
            to={LIST_TOWNS_ROUTE}
            exact
            className="item"
            activeClassName="active"
          >
            <span className="menu-item-text">Towns</span>
          </NavLink>
          <NavLink
            to={LIST_DRIVER_ROUTE}
            exact
            className="item"
            activeClassName="active"
          >
            <span className="menu-item-text">Drivers</span>
          </NavLink>
          <NavLink
            to={LIST_DRIVERS_APP}
            exact
            className="item"
            activeClassName="active"
          >
            <span className="menu-item-text">Drivers Applications</span>
          </NavLink>
          <NavLink
            to={LIST_TAXI_ROUTE}
            exact
            className="item"
            activeClassName="active"
          >
            <span className="menu-item-text">Taxis</span>
          </NavLink>
          <NavLink
            to={LIST_TAXI_DRIVER}
            exact
            className="item"
            activeClassName="active"
          >
            <span className="menu-item-text">Taxis Drivers</span>
          </NavLink>
          <NavLink
            to={LIST_PICKUP_AREAS_ROUTE}
            exact
            className="item"
            activeClassName="active"
          >
            <span className="menu-item-text">Pickup Areas</span>
          </NavLink>
          <NavLink
            to={LIST_SUBSCRIPTION_PLAN}
            exact
            className="item"
            activeClassName="active"
          >
            <span className="menu-item-text">Subscription Plans</span>
          </NavLink>
          <NavLink
            to={LIST_CLIENTS}
            exact
            className="item"
            activeClassName="active"
          >
            <span className="menu-item-text">Clients</span>
          </NavLink>
          <NavLink
            to={LIST_REQUESTS}
            exact
            className="item"
            activeClassName="active"
          >
            <span className="menu-item-text">Requests</span>
          </NavLink>
        </SideMenu.MenuMultiItems>
      </SideMenu>
    );
  }
}

export default SideMenuContent;
