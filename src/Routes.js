import React from "react";
import { Switch } from "react-router-dom";

import Login from "./components/Login/Login";
import Home from "./components/HomePage/Home";
import SignUp from "./components/SignUp/SignUp";
import AddCalendar from "./components/Dashboard/components/AddCalendar/AddCalendar";
import CalendarAvailability from "./components/Dashboard/components/CalendarAvailability/CalendarAvailability";
import {
  RouteWithLayout,
  PrivateRoute,
  PublicRoute,
} from "./components/Routing";
import { Main as MainLayout, Minimal as MinimalLayout } from "./layouts";
import { Dashboard } from "./components";

import Calendar from "./components/Dashboard/components/Calendar/Calendar";

import Invitation from "./components/Dashboard/components/Invitation/Invitation";

import UserInvitation from "./components/UserInvitation/UserInvitation";
import CalendarInvite from "./components/CalendarInvite/CalendarInvite";
import Settings from "./components/Settings/Settings";

const isAuthenticated = localStorage.getItem("isAuthenticated");

const Routes = () => {
  return (
    <Switch>
      <PrivateRoute
        component={Home}
        exact
        path="/"
        layout={MinimalLayout}
        isAuthenticated={isAuthenticated}
      />

      <PrivateRoute
        component={SignUp}
        exact
        layout={MinimalLayout}
        path="/signup"
        isAuthenticated={isAuthenticated}
      />

      <PrivateRoute
        component={Login}
        exact
        layout={MinimalLayout}
        path="/login"
        isAuthenticated={isAuthenticated}
      />

      <RouteWithLayout
        component={Dashboard}
        exact
        layout={MainLayout}
        path="/dashboard"
        isAuthenticated={isAuthenticated}
      />

      <RouteWithLayout
        component={AddCalendar}
        exact
        layout={MainLayout}
        path="/addcalendar"
        isAuthenticated={isAuthenticated}
      />

      <RouteWithLayout
        component={CalendarAvailability}
        exact
        layout={MainLayout}
        path="/addcalendar/calendaravailability"
        isAuthenticated={isAuthenticated}
      />

      <RouteWithLayout
        component={Settings}
        exact
        layout={MainLayout}
        path="/settings"
        isAuthenticated={isAuthenticated}
      />

      <RouteWithLayout
        component={Invitation}
        exact
        layout={MainLayout}
        path="/invitation"
      />

      <RouteWithLayout
        component={Calendar}
        exact
        layout={MainLayout}
        path="/suitabilitycalendar"
        isAuthenticated={isAuthenticated}
      />

      <PublicRoute
        component={UserInvitation}
        exact
        layout={MinimalLayout}
        path="/userinvitation/:guid"
      />
      <RouteWithLayout
        component={CalendarInvite}
        exact
        layout={MinimalLayout}
        path="/calendarinvite/:guid"
      />
      <RouteWithLayout
        component={AddCalendar}
        exact
        layout={MinimalLayout}
        path="/calendarguest/addcalendar"
      />

      <RouteWithLayout
        component={CalendarAvailability}
        exact
        layout={MinimalLayout}
        path="/calendarguest/addcalendar/calendaravailability"
      />
    </Switch>
  );
};

export default Routes;
