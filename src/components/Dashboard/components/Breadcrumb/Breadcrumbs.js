import React from "react";
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link,
  Typography,
} from "@material-ui/core/";

import { withRouter } from "react-router-dom";
import AuthService from "../../../../services/AuthService";
import { makeStyles } from "@material-ui/core/styles";

const userId = AuthService.getUserId();

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(3),
  },
}));

const Breadcrumbs = (props) => {
  const {
    history,
    location: { pathname },
  } = props;

  const classes = useStyles();

  function returnName(name) {
    let nameConvention = [
      {
        linkName: "addcalendar",
        breadcrumbName: "Add Calendar",
      },
      {
        linkName: "calendaravailability",
        breadcrumbName: "Calendar Availability",
      },
    ];

    for (var i = 0; i < nameConvention.length; i++) {
      if (nameConvention[i].linkName === name) {
        return nameConvention[i].breadcrumbName;
      }
    }
  }

  function returnLink() {
    if (userId != null) {
      history.push("/dashboard");
    } else {
      history.push("/");
    }
  }

  function returnLinkName() {
    if (userId != null) {
      return "Suitability Calendar";
    } else {
      return "Home Page";
    }
  }

  function routeToPage(routeTo) {
    if (routeTo == "/addcalendar") {
      localStorage.setItem(
        "Unavailability",
        JSON.stringify(props.unavaiabilities)
      );
    }
    history.push(routeTo);
  }

  const pathnames = pathname
    .replace("/calendarguest", "")
    .split("/")
    .filter((x) => x);

  return (
    <div className={classes.root}>
      <MUIBreadcrumbs aria-label="breadcrumb">
        {pathnames.length > 0 ? (
          <Link onClick={() => returnLink()}>{returnLinkName()}</Link>
        ) : (
          <Typography>{returnLinkName()}</Typography>
        )}
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <Typography key={name}>{returnName(name)}</Typography>
          ) : (
            <Link key={name} onClick={() => routeToPage(routeTo)}>
              {returnName(name)}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
    </div>
  );
};

export default withRouter(Breadcrumbs);
