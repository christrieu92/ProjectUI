import React, { Component } from "react";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import CalendarString from "../Dashboard/CalendarStrings";
import { ValidateName, ValidateEmail } from "../../services/Validation";

import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
  withStyles,
} from "@material-ui/core";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import AuthService from "../../services/AuthService/AuthService";
import APIService from "../../services/APIService";
import Header from "../HomePage/Header";

import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = (theme) => ({
  root: {
    marginTop: theme.spacing(12),
  },
  heading: {
    textAlign: "center",
  },
  headingText: {
    margin: theme.spacing(3),
    textAlign: "center",
  },
  text: {
    margin: theme.spacing(1),
    textAlign: "center",
  },
  textfields: {
    padding: theme.spacing(3),
  },
  box: {
    position: "relative",
    marginTop: theme.spacing(3),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
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
  text1: {
    marginLeft: theme.spacing(22),
  },
  button: {
    marginTop: theme.spacing(3),
  },
});

class UserInvitation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarId: this.props.match.params.guid,
      name: "",
      email: "",
      calendarName: "",
      startDate: new Date(),
      endDate: new Date(),
      monthDif: 0,
      selectedDays: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    AuthService.setCalendarId(this.props.match.params.guid);

    ValidatorForm.addValidationRule("isNameValidated", (value) => {
      var nameValidate = ValidateName(value);

      this.setState({
        validation: {
          ...this.state.validation,
          name: nameValidate,
        },
      });

      return nameValidate;
    });

    ValidatorForm.addValidationRule("isEmailValidated", (value) => {
      var emailValidate = ValidateEmail(value);

      this.setState({
        validation: {
          ...this.state.validation,
          email: emailValidate,
        },
      });

      return emailValidate;
    });

    let startDate = new Date(localStorage.getItem(CalendarString.StartMonth));
    let endDate = new Date(localStorage.getItem(CalendarString.EndMonth));

    let startMonth = startDate.getMonth();
    let startYear = startDate.getFullYear();
    let endMonth = endDate.getMonth();
    let endYear = endDate.getFullYear();

    let newEndMonth = endMonth + 12 * (endYear - startYear) + 1;

    let monthDif = newEndMonth - startMonth;

    this.setState({
      calendarName: localStorage.getItem(CalendarString.CalendarName),
      startDate: startDate,
      endDate: endDate,
      monthDif: monthDif,
    });
  }

  handleChange(event) {
    event.preventDefault();

    this.setState({
      [event.target.name]: event.target.value,
    });
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
    const { calendarId, name, email, selectedDays } = this.state;

    event.preventDefault();

    APIService.postInviteUser(calendarId, name, email, selectedDays).then(
      (response) => {
        if (response) {
          AuthService.setUserId(response.data.userId);

          APIService.addNotifications(calendarId, response.data.userId).then(
            () => {
              localStorage.setItem("Invited", true);
              this.props.history.push("/calendarinvite/" + calendarId);
            }
          );
        }
      }
    );
  }

  render() {
    const { classes } = this.props;

    const {
      calendarName,
      calendarId,
      startDate,
      endDate,
      monthDif,
    } = this.state;

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
        <Header />
        <div className={classes.root}>
          <Typography className={classes.heading} variant="h1">
            Welcome to - {calendarName}
          </Typography>
          <Grid container spacing={0} alignItems="center" justify="center">
            <Button
              className={classes.button}
              variant="contained"
              onClick={() =>
                this.props.history.push("/calendarinvite/" + calendarId)
              }
            >
              View Calendar
            </Button>
          </Grid>
          <Container component="main" maxWidth="md">
            <CssBaseline>
              <Grid item xs className={classes.box} variant="outlined">
                <div className={classes.paper}>
                  <ValidatorForm
                    className={classes.form}
                    onSubmit={this.handleSubmit}
                  >
                    <Typography className={classes.headingText} variant="h5">
                      You've been invited to fill out your unavailabilities for{" "}
                      {calendarName}
                    </Typography>
                    <Typography className={classes.text1} variant="h6">
                      <b>Please enter the following information:</b>
                    </Typography>
                    <Grid
                      container
                      className={classes.textfields}
                      spacing={5}
                      justify="center"
                    >
                      <Grid item xs={4}>
                        <TextValidator
                          variant="outlined"
                          required
                          fullWidth
                          id="name"
                          label="Your Name"
                          name="name"
                          autoComplete="name"
                          autoFocus
                          onChange={this.handleChange}
                          value={this.state.name}
                          validators={["isNameValidated", "required"]}
                          helperText={"Name must be at least 5 characters"}
                          errorMessages={["Please enter your name"]}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextValidator
                          variant="outlined"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          validators={["isEmailValidated", "required"]}
                          helperText={"Use email in the future for sign up"}
                          onChange={this.handleChange}
                          value={this.state.email}
                          errorMessages={["Email is invalid"]}
                        />
                      </Grid>
                      <Tooltip
                        title={
                          "Adding your email here means in the future you can sign up / log in from anywhere and any shared calendars linked to this email will be shown in your dashboard"
                        }
                      >
                        <InfoIcon style={{ fontSize: "24px" }} />
                      </Tooltip>
                    </Grid>
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
                    <Grid
                      container
                      className={classes.calendar}
                      justify="center"
                    >
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
                  </ValidatorForm>
                </div>
              </Grid>
              <Box mt={5}></Box>
            </CssBaseline>
          </Container>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(UserInvitation);
