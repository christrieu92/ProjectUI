import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Button, Container } from "@material-ui/core";
import firebase from "../../services/firebase";
import ListCalendar from "./components/ListCalendar/ListCalendar";
import CalendarString from "./CalendarStrings";
import AuthService from "../../services/AuthService";
import APIService from "../../services/APIService";
import FirebaseService from "../../services/FirebaseService";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(9),
  },
  calendar: {
    marginBottom: theme.spacing(3),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [listCalendar, setListCalendar] = useState([]);

  useEffect(() => {
    removeCalendarDetails();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userId = AuthService.getUserId();
        const token = FirebaseService.userToken(false);

        APIService.getCalendars(token, userId).then((response) => {
          setListCalendar(response.data);
        });
      }
    });
  }, []);

  function removeCalendarDetails() {
    AuthService.removeCalendarId();
    localStorage.removeItem(CalendarString.CalendarName);
    localStorage.removeItem(CalendarString.StartMonth);
    localStorage.removeItem(CalendarString.EndMonth);
    localStorage.removeItem("Unavailability");
  }

  return (
    <div>
      <Container component="main" className={classes.root}>
        <Grid container spacing={2} align="center">
          <Grid item xs={12}>
            <Button
              variant="contained"
              href="./addcalendar"
              className={classes.calendar}
            >
              CREATE NEW SHARED CALENDAR
            </Button>
          </Grid>
          <Grid item xs={12}>
            <ListCalendar calendars={listCalendar} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
