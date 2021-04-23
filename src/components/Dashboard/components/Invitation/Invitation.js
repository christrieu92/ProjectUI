import React, { Component } from "react";
import { Button, Card, Grid, Typography, withStyles } from "@material-ui/core";
import LoginString from "../../../LoginStrings";
import CalendarString from "../../CalendarStrings";
import APIService from "../../../../services/APIService";
import AuthService from "../../../../services/AuthService/AuthService";

const roundBoxStyles = {
  left: "50%",
  width: "40vw",
  height: "5vw",
  borderRadius: 80,
  border: "1px solid black",
};

const useStyles = (theme) => ({
  root: {
    marginTop: theme.spacing(9),
  },
  heading: {
    textAlign: "center",
  },
  subheading: {
    marginTop: theme.spacing(4),
    textAlign: "center",
  },
  text: {
    margin: theme.spacing(3),
    textAlign: "center",
    lineHeight: 2,
  },
  link: {
    textAlign: "center",
    margin: theme.spacing(5),
  },
  submit: {
    marginTop: theme.spacing(5),
    backgroundColor: theme.palette.primary.stormdust,
  },
  card: {
    margin: theme.spacing(4),
  },
  button: {
    marginRight: theme.spacing(3),
  },
});

class Invitation extends Component {
  render() {
    const { classes } = this.props;

    const Name = localStorage.getItem(LoginString.Name);
    const CalendarName = localStorage.getItem(CalendarString.CalendarName);
    const CalendarId = AuthService.getCalendarId();
    const urlInvitation = APIService.invitationLink(CalendarId);

    return (
      <div className={classes.root}>
        <Typography className={classes.heading} variant="h1">
          Create a Shared Calendar
        </Typography>
        <Typography className={classes.subheading} variant="h3">
          Step 3
        </Typography>
        <Typography className={classes.text} variant="h5">
          Hello {Name}! {CalendarName} Suitability Calendar has been created.
          <br /> Copy the link and send it to anyone you want to go on holiday
          with so they can show you their unavailabilities:
        </Typography>
        <Grid container spacing={0} alignItems="center" justify="center">
          <Card
            variant="outlined"
            style={roundBoxStyles}
            className={classes.card}
          >
            <Typography className={classes.link} variant="h5">
              Link: {urlInvitation}
            </Typography>
          </Card>
        </Grid>
        <Grid container spacing={0} justify="center">
          <Button
            variant="contained"
            href="./dashboard"
            className={classes.button}
          >
            Back to Dashboard
          </Button>
          <Button variant="contained" href="./suitabilitycalendar">
            Go to your shared calendar
          </Button>
        </Grid>
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(Invitation);
