import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Hidden, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import Grid from "@material-ui/core/Grid";
import Logo from "../../../../images/YorTrips-logo.png";

import NotifyMe from "react-notification-timeline";
import AuthService from "../../../../services/AuthService";
import APIService from "../../../../services/APIService";
import moment from "moment-timezone";

import "./Topbar.css";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
    backgroundColor: theme.palette.primary.stormdust,
  },
  flexGrow: {
    flexGrow: 1,
  },
  signOutButton: {
    marginLeft: theme.spacing(1),
  },
  image: {
    marginTop: theme.spacing(1),
    width: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));
const Topbar = (props) => {
  const [listNotifications, setNotifications] = useState([]);

  useEffect(() => {
    const userId = AuthService.getUserId();

    APIService.getNotificationKey(userId).then((response) => {
      if (response.data != "") {
        localStorage.setItem(
          "notific_key",
          JSON.stringify({ id: response.data })
        );
      } else {
        localStorage.removeItem("notific_key");
      }
    });

    APIService.getNotifications(userId).then((response) => {
      let notificationsList = [];

      response.data.forEach((element) => {
        notificationsList.push({
          update: element.message,
          timestamp: moment(element.createdDate).valueOf(),
        });
      });

      setNotifications(notificationsList);
    });
  }, []);

  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();

  return (
    <AppBar {...rest} className={clsx(classes.root, className)}>
      <Toolbar>
        <RouterLink to="/">
          <Grid className={classes.image}>
            <img className={classes.img} alt="Logo" src={Logo} />
          </Grid>
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <NotifyMe
            data={listNotifications}
            storageKey="notific_key"
            notific_key="timestamp"
            notific_value="update"
            heading="Notification Alerts"
            sortedByKey={false}
            showDate={false}
            size={24}
            color="white"
          />
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onSidebarOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
};

export default Topbar;
