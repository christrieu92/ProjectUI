import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Avatar, Typography } from "@material-ui/core";

import LoginString from "../../../../../../components/LoginStrings";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "fit-content",
  },
  avatar: {
    width: 60,
    height: 60,
    margin: theme.spacing(1),
  },
}));

const Profile = (props) => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const currentUserName = localStorage.getItem(LoginString.Name);

  const user = {
    avatar: "/images/avatars/avatar_11.png",
    name: currentUserName,
  };

  function getUserIntials() {
    if (currentUserName.indexOf(" ") >= 0) {
      const arr = currentUserName.split(" ");
      return arr[0].charAt(0) + " " + arr[arr.length - 1].charAt(0);
    }
    return currentUserName.charAt(0);
  }

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Avatar
        alt="No Image"
        name={currentUserName}
        className={classes.avatar}
        component={RouterLink}
        src={user.avatar}
        to="/settings"
      >
        {getUserIntials()}
      </Avatar>
      <Typography className={classes.name} variant="h4">
        {user.name}
      </Typography>
      <Typography variant="body2">{user.bio}</Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
};

export default Profile;
