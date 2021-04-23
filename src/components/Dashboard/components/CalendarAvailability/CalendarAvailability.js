import React, { Component } from "react";
import Breadcrumbs from "../Breadcrumb/Breadcrumbs";

import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import "./customCSS.css";
import firebase from "../../../../services/firebase";
import CalendarString from "../../CalendarStrings";

import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  withStyles,
} from "@material-ui/core";
import FirebaseService from "../../../../services/FirebaseService";
import AuthService from "../../../../services/AuthService/AuthService";
import APIService from "../../../../services/APIService";
import Header from "../../../HomePage/Header";

const useStyles = (theme) => ({
  root: {
    marginTop: theme.spacing(12),
  },
  heading: {
    textAlign: "center",
  },
  subheading: {
    marginTop: theme.spacing(4),
    textAlign: "center",
  },
  text: {
    margin: theme.spacing(1),
    textAlign: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
  },
  box: {
    position: "relative",
    marginTop: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  calendar: {
    marginTop: theme.spacing(3),
  },
  submit: {
    marginTop: theme.spacing(5),
    backgroundColor: theme.palette.primary.stormdust,
  },
});

let startDate = new Date(localStorage.getItem(CalendarString.StartMonth));
let endDate = new Date(localStorage.getItem(CalendarString.EndMonth));

let startMonth = startDate.getMonth();
let startYear = startDate.getFullYear();
let endMonth = endDate.getMonth();
let endYear = endDate.getFullYear();

let newEndMonth = endMonth + 12 * (endYear - startYear) + 1;

let monthDif = newEndMonth - startMonth;

class CalendarAvailability extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      selectedDays: [],
      userId: AuthService.getUserId(),
    };

    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user: user });
    });

    if (JSON.parse(localStorage.getItem("Unavailability")) != null) {
      this.setState({
        selectedDays: JSON.parse(localStorage.getItem("Unavailability")).map(
          (a) => new Date(a)
        ),
      });
    }
  }

  handleDayClick(day, { selected }) {
    const { selectedDays } = this.state;
    if (selected) {
      const selectedIndex = selectedDays.findIndex((selectedDay) =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }

    this.setState({ selectedDays });
  }

  async handleSubmit(event) {
    const { selectedDays, userId } = this.state;
    const calendarName = localStorage.getItem(CalendarString.CalendarName);

    event.preventDefault();

    if (userId != null) {
      try {
        const token = FirebaseService.userToken(true);

        APIService.postCalendar(
          token,
          calendarName,
          userId,
          selectedDays,
          startDate,
          endDate
        ).then((response) => {
          AuthService.setCalendarId(response.data.calendarId);

          this.props.history.push("/invitation");
        });
      } catch (error) {
        document.getElementById("1").innerHTML =
          "Error in signing up please try again";
      }
    } else {
      localStorage.setItem("Unavailability", JSON.stringify(selectedDays));

      this.props.history.push("/signup");
    }
  }

  render() {
    const { classes } = this.props;

    const modifiers = {
      weekends: { daysOfWeek: [0, 6] },
    };
    const modifiersStyles = {
      weekends: {
        color: "#0063B2FF",
        backgroundColor: "#9BDDFF",
      },
    };

    return (
      <div>
        {console.log(this.state.selectedDays)}
        <Header />
        <div className={classes.root}>
          <Breadcrumbs unavaiabilities={this.state.selectedDays} />
          <Typography className={classes.heading} variant="h1">
            Create a Shared Calendar
          </Typography>
          <Typography className={classes.subheading} variant="h3">
            Step 2
          </Typography>
          <Container component="main" maxWidth="md">
            <Grid item xs className={classes.box} variant="outlined">
              <div className={classes.paper}>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                  <Typography className={classes.text} variant="h5">
                    Enter in the dates you're unavailable for a holiday
                  </Typography>
                  <Typography className={classes.text} variant="h6">
                    <b>
                      Think birthdays, anniversaries, festivals, deadlines,
                      other holidays etc.
                    </b>
                  </Typography>
                  <Typography className={classes.text} variant="h6">
                    (We'll overlap your unavailabilities with your friends to
                    find when everyone is available for whatever duration you
                    choose)
                  </Typography>
                  <Grid container className={classes.calendar} justify="center">
                    <DayPicker
                      firstDayOfWeek={1}
                      selectedDays={this.state.selectedDays}
                      numberOfMonths={monthDif}
                      onDayClick={this.handleDayClick}
                      showOutsideDays
                      canChangeMonth={false}
                      month={startDate}
                      toMonth={endDate}
                      disabledDays={{ before: new Date() }}
                      modifiers={modifiers}
                      modifiersStyles={modifiersStyles}
                    />
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Confirm + Next Step
                  </Button>
                </form>
              </div>
            </Grid>
            <Box mt={5}></Box>
          </Container>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(CalendarAvailability);
