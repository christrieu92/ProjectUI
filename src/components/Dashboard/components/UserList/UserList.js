import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import { withRouter } from "react-router-dom";
import firebase from "../../../../services/firebase";
import AuthService from "../../../../services/AuthService";
import FirebaseService from "../../../../services/FirebaseService";
import APIService from "../../../../services/APIService";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    width: 50,
    height: 50,
    fontSize: "20px",
  },
  listItem: {
    marginTop: theme.spacing(2),
  },
  listItemText: {
    fontSize: "20px",
    marginLeft: theme.spacing(3),
  },
}));

function UserList(props) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([1]);
  //const [checkedlist, setCheckedlist] = useState([]);
  const [listUsers, setUsers] = useState([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const token = FirebaseService.userToken(true);
        const calendarId = AuthService.getCalendarId();

        APIService.getUsersByCalendar(token, calendarId).then((response) => {
          setUsers(response.data);
          setChecked(response.data);
          //setCheckedlist(response.data);
          props.OnSelectChecked(response.data);
        });
      }
    });
  }, []);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    //setCheckedlist(newChecked);

    props.OnSelectChecked(newChecked);
  };

  return (
    <List dense className={classes.root}>
      {listUsers.map((value) => {
        const labelId = `checkbox-list-secondary-label-${value.userId}`;
        return (
          <ListItem key={value.userId} className={classes.listItem}>
            <ListItemAvatar>
              <Avatar alt="No Image" className={classes.avatar}>
                {value.name.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              id={labelId}
              classes={{ primary: classes.listItemText }}
              primary={`${value.name}`}
            />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                onChange={handleToggle(value)}
                checked={checked.indexOf(value) !== -1}
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}

export default withRouter(UserList);
