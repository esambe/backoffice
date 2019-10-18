// import external modules
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as actions from "../../../actions/auth/login_actions";
import {
   Media,
   Collapse,
   Navbar,
   Nav,
   UncontrolledDropdown,
   DropdownToggle,
   DropdownMenu,
   DropdownItem
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
   Menu,
   MoreVertical,
   Check,
   Bell,
   LogOut
} from "react-feather";
import ReactCountryFlag from "react-country-flag";

import userImage from "../../../assets/img/portrait/small/avatar-s-1.png";
import userImage2 from "../../../assets/img/portrait/small/avatar-s-2.png";

class ThemeNavbar extends Component {
   handleClick = e => {
      this.props.toggleSidebarMenu("open");
   };
   constructor(props) {
      super(props);

      this.toggle = this.toggle.bind(this);
      this.state = {
         isOpen: false
      };
   }
   toggle() {
      this.setState({
         isOpen: !this.state.isOpen
      });
   }

   handleLogout = ()=>{
      this.props.logoutUser()
   }

   render() {
      return (
         <Navbar className="navbar navbar-expand-lg navbar-light bg-faded">
            <div className="container-fluid px-0">
               <div className="navbar-header">
                  <Menu
                     size={14}
                     className="navbar-toggle d-lg-none float-left"
                     onClick={this.handleClick.bind(this)}
                     data-toggle="collapse"
                  />
                  {/* <Moon size={20} color="#333" className="m-2 cursor-pointer"/> */}
                  <MoreVertical
                     className="mt-1 navbar-toggler black no-border float-right"
                     size={50}
                     onClick={this.toggle}
                  />
               </div>

               <div className="navbar-container">
                  <Collapse isOpen={this.state.isOpen} navbar>
                  <Nav className="ml-auto float-right" navbar>
                        <UncontrolledDropdown nav inNavbar className="pr-1">
                           <DropdownToggle nav>
                              <ReactCountryFlag code="us" svg /> EN
                           </DropdownToggle>
                           <DropdownMenu right>
                              <DropdownItem>
                                 <ReactCountryFlag code="us" svg /> English
                              </DropdownItem>
                              <DropdownItem>
                                 <ReactCountryFlag code="fr" svg /> Français
                              </DropdownItem>
                           </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav inNavbar className="pr-1">
                           <DropdownToggle nav>
                              <span className="notification-bell-blink" />
                              <Bell size={21} className="text-dark notification-danger" />
                           </DropdownToggle>
                           <DropdownMenu right className="notification-dropdown">
                              <div className="p-2 text-center  border-bottom-grey border-bottom-lighten-2">
                                 <h6 className="mb-0 text-bold-500">Notifications</h6>
                              </div>
                              <PerfectScrollbar className="noti-list bg-grey bg-lighten-5">
                                 <Media className="px-3 pt-2 pb-2 media  border-bottom-grey border-bottom-lighten-3">
                                    <Media left top href="#">
                                       <Media
                                          object
                                          src={userImage2}
                                          alt="Generic placeholder image"
                                          className="rounded-circle width-35"
                                       />
                                    </Media>
                                    <Media body>
                                       <h6 className="mb-0 text-bold-500 font-small-3">
                                          Selina sent you mail
                                          <span className="text-bold-300 font-small-2 text-muted float-right">9:00 A.M</span>
                                       </h6>
                                       <span className="font-small-3 line-height-2">
                                          Cras sit amet nibh libero, in gravida nulla.
                                       </span>
                                    </Media>
                                 </Media>
                                 <Media className="px-3 pt-2 pb-2 media  border-bottom-grey border-bottom-lighten-3">
                                    <Media left middle href="#" className="mr-2">
                                       <span className="bg-success rounded-circle width-35 height-35 d-block">
                                          <Check size={30} className="p-1 white margin-left-3" />
                                       </span>
                                    </Media>
                                    <Media body>
                                       <h6 className="mb-1 text-bold-500 font-small-3">
                                          <span className="success">Report generated successfully!</span>
                                          <span className="text-bold-300 font-small-2 text-muted float-right">
                                             10:15 A.M
                                          </span>
                                       </h6>
                                       <span className="font-small-3 line-height-2">
                                          This is a dummy notification that probably spans across multiple lines
                                       </span>
                                    </Media>
                                 </Media>
                              </PerfectScrollbar>
                              <div className="p-1 text-center border-top-grey border-top-lighten-2">
                                 <Link to="/">View All</Link>
                              </div>
                           </DropdownMenu>
                        </UncontrolledDropdown>

                        <UncontrolledDropdown nav inNavbar className="pr-1">
                           <DropdownToggle nav>
                              <img src={userImage} alt="logged-in-user" className="rounded-circle width-35" />
                           </DropdownToggle>
                           <DropdownMenu right>
                              <DropdownItem>
                                 <span className="font-small-3">
                                    {this.props.userName} <span className="text-muted">(Role)</span>
                                 </span>
                              </DropdownItem>
                              <DropdownItem divider />
                              <DropdownItem onClick={this.handleLogout}>
                                 <LogOut size={16} className="mr-1" /> Logout
                              </DropdownItem>
                           </DropdownMenu>
                        </UncontrolledDropdown>
                     </Nav>
                  </Collapse>
               </div>
            </div>
         </Navbar>
      );
   }
}

function mapStateToProps(state){
   return {
      userName: state.auth.userName,
   }
}

function mapDispatchToProps(dispatch){
   return bindActionCreators({logoutUser: ()=>actions.logoutUser(dispatch)}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)( ThemeNavbar );
