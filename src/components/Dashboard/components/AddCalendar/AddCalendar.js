import React, { Component } from "react";
import Breadcrumbs from "../Breadcrumb/Breadcrumbs";
import CalendarString from "../../CalendarStrings";

import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./customCSS.css";
import AuthService from "../../../../services/AuthService";
import Header from "../../../HomePage/Header";

const useStyles = (theme) => ({
  root: {
    marginTop: theme.spacing(13),
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
  submit: {
    marginTop: theme.spacing(5),
    backgroundColor: theme.palette.primary.stormdust,
  },
});

var today = new Date();
var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

const calendarNameStorage = localStorage.getItem(CalendarString.CalendarName);
const startDateStorage = localStorage.getItem(CalendarString.StartMonth);
const endDateStorage = localStorage.getItem(CalendarString.EndMonth);

class AddCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarname: "",
      startDate: today,
      endDate: lastDay,
      error: null,
      userId: AuthService.getUserId(),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (calendarNameStorage !== null) {
      this.setState({ calendarname: calendarNameStorage });
    }

    if (startDateStorage !== null) {
      this.setState({ startDate: new Date(startDateStorage) });
    }

    if (endDateStorage !== null) {
      this.setState({ endDate: new Date(endDateStorage) });
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleStartDate(date) {
    const { endDate } = this.state;

    const date2 = new Date(new Date(date).setMonth(date.getMonth() + 3, 0));

    this.setState({
      startDate: date < today ? today : date,
      endDate: endDate < date ? date : endDate > date2 ? date2 : endDate,
    });
  }

  handleEndDate(date) {
    this.setState({
      endDate: new Date(new Date(date).setMonth(date.getMonth() + 1, 0)),
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (
      startDateStorage != this.state.startDate ||
      endDateStorage != this.state.endDate
    ) {
      localStorage.removeItem("Unavailability");
    }

    localStorage.setItem(CalendarString.CalendarName, this.state.calendarname);
    localStorage.setItem(CalendarString.StartMonth, this.state.startDate);
    localStorage.setItem(CalendarString.EndMonth, this.state.endDate);

    this.setState({
      calendarname: this.state.calendarname,
    });

    if (this.state.userId != null) {
      this.props.history.push("/addcalendar/calendaravailability");
    } else {
      this.props.history.push(
        "/calendarguest/addcalendar/calendaravailability"
      );
    }
  }

  render() {
    const { classes } = this.props;

    const { startDate, endDate, userId } = this.state;

    let header;
    if (userId == null) {
      header = <Header />;
    }

    return (
      <div>
        {header}
        <div className={classes.root}>
          <Breadcrumbs />
          <Typography className={classes.heading} variant="h1">
            Create a Shared Calendar
          </Typography>
          <Typography className={classes.subheading} variant="h3">
            Step 1
          </Typography>
          <Container component="main" maxWidth="xs">
            <Grid item xs className={classes.box} variant="outlined">
              <div className={classes.paper}>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                  <Grid container>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="calendarname"
                        label="Calendar Name"
                        name="calendarname"
                        autoComplete="calendarname"
                        onChange={this.handleChange}
                        value={this.state.calendarname}
                        helperText={"E.g. Surf Trip 2021"}
                      />
                    </Grid>
                    <div className="error">
                      <p id="1" style={{ color: "red" }}></p>
                    </div>
                  </Grid>
                  <Typography className={classes.text} variant="h5">
                    State the months your holiday is likely to be in: (Max of 3
                    in a row)
                  </Typography>
                  <Grid item xs={12}>
                    <Grid container justify="center">
                      <Grid item xs={6}>
                        <Typography align="center">Start Date</Typography>
                        <Grid container justify="center">
                          <DatePicker
                            selected={startDate}
                            minDate={
                              new Date(today.getFullYear(), today.getMonth(), 1)
                            }
                            onChange={this.handleStartDate}
                            selectsStart
                            startDate={startDate}
                            dateFormat="MMMM yyyy"
                            showMonthYearPicker
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="center">End Date</Typography>
                        <Grid container justify="center">
                          <DatePicker
                            selected={endDate}
                            onChange={this.handleEndDate}
                            selectsEnd
                            endDate={endDate}
                            minDate={new Date(startDate)}
                            maxDate={
                              new Date(
                                new Date(startDate).setMonth(
                                  startDate.getMonth() + 3,
                                  0
                                )
                              )
                            }
                            dateFormat="MMMM yyyy"
                            showMonthYearPicker
                          />
                        </Grid>
                      </Grid>
                    </Grid>
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
          </Container>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(AddCalendar);
