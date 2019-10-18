// import external modules
import React, { Component } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import Spinner from "./components/spinner/spinner";
import AllUsersDisplay from "./containers/userManagement";
import CountriesDisplay from "./containers/country_management";
import TownsDisplay from "./containers/town_management";
import PickupAreasDisplay from "./containers/pickup_area_management";
import DriversDisplay from "./containers/driver_management";
import TaxisDisplay from "./containers/taxi_management";
import TaxiDriverDisplay from "./containers/taxi_drivers_management";
import DriversAppDisplay from "./containers/drivers_app_management";
import SubscriptionPlanDisplay from "./containers/subscription_plan_management";
import ClientDisplay from './containers/client_mamanagement';

// import internal(own) modules
import ProtectedRoute from "./layouts/routes/protectedRoute";
import NoAuthRoute from "./layouts/routes/unProtectedRoute";
import ErrorLayoutRoute from "./layouts/routes/errorRoutes";
import ProtectedComponentWrapper from "./containers/auth_component";
import App from "./containers/app/app";
import LoginView from "./containers/login_view";
import MainLayout from "./layouts/mainLayout";
import FullPageLayout from "./layouts/fullpageLayout";
import { FullPageOverlayLayout } from "./layouts/fullpageLayout";
import {
  LIST_USERS_ROUTE,
  MAIN_VIEW_ROUTE,
  LOGIN_VIEW_ROUTE,
  LIST_COUNTRIES_ROUTE,
  LIST_TOWNS_ROUTE,
  LIST_PICKUP_AREAS_ROUTE,
  LIST_DRIVER_ROUTE,
  LIST_TAXI_ROUTE,
  LIST_TAXI_DRIVER,
  LIST_DRIVERS_APP,
  LIST_SUBSCRIPTION_PLAN,
  LIST_CLIENTS
} from "./constants/app_utils";

class ApplicationRouter extends Component {
  render() {
    return (
      // Set the directory path if you are deplying in sub-folder
      <BrowserRouter basename="/">
        <Switch>
          {/* Dashboard Views */}
          <ProtectedRoute
            path={LIST_USERS_ROUTE}
            render={matchprops => (
              <MainLayout>
                {" "}
                <AllUsersDisplay {...matchprops} />{" "}
              </MainLayout>
            )}
          />
          <ProtectedRoute
            path={LIST_COUNTRIES_ROUTE}
            render={matchprops => (
              <MainLayout>
                {" "}
                <CountriesDisplay {...matchprops} />{" "}
              </MainLayout>
            )}
          />
          <ProtectedRoute
            path={LIST_TOWNS_ROUTE}
            render={matchprops => (
              <MainLayout>
                {" "}
                <TownsDisplay {...matchprops} />{" "}
              </MainLayout>
            )}
          />
          <ProtectedRoute
            path={LIST_PICKUP_AREAS_ROUTE}
            render={matchprops => (
              <MainLayout>
                {" "}
                <PickupAreasDisplay {...matchprops} />{" "}
              </MainLayout>
            )}
          />
          <ProtectedRoute
            path={LIST_DRIVER_ROUTE}
            render={matchprops => (
              <MainLayout>
                {" "}
                <DriversDisplay {...matchprops} />{" "}
              </MainLayout>
            )}
          />
          <ProtectedRoute
            path={LIST_DRIVERS_APP}
            render={matchprops => (
              <MainLayout>
                {" "}
                <DriversAppDisplay {...matchprops} />{" "}
              </MainLayout>
            )}
          />
          <ProtectedRoute
            path={LIST_TAXI_ROUTE}
            render={matchprops => (
              <MainLayout>
                {" "}
                <TaxisDisplay {...matchprops} />{" "}
              </MainLayout>
            )}
          />
          <ProtectedRoute
            path={LIST_TAXI_DRIVER}
            render={matchprops => (
              <MainLayout>
                {" "}
                <TaxiDriverDisplay {...matchprops} />{" "}
              </MainLayout>
            )}
          />
          <ProtectedRoute
            path={LIST_SUBSCRIPTION_PLAN}
            render={matchprops => (
              <MainLayout>
                {" "}
                <SubscriptionPlanDisplay {...matchprops} />{" "}
              </MainLayout>
            )}
          />
          <ProtectedRoute
            path={LIST_CLIENTS}
            render={matchprops => (
              <MainLayout>
                {" "}
                <ClientDisplay {...matchprops} />{" "}
              </MainLayout>
            )}
          />
          <ProtectedRoute
            exact
            path={MAIN_VIEW_ROUTE}
            render={matchprops => (
              <MainLayout>
                {" "}
                <App {...matchprops} />{" "}
              </MainLayout>
            )}
          />
          <NoAuthRoute
            exact
            path={LOGIN_VIEW_ROUTE}
            render={matchprops => (
              <FullPageOverlayLayout>
                {" "}
                <LoginView {...matchprops} />{" "}
              </FullPageOverlayLayout>
            )}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default ApplicationRouter;
