import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Box, Button, Grid, Typography, withStyles } from "@material-ui/core";
import CalendarString from "../Dashboard/CalendarStrings";
import DayPicker, { DateUtils } from "react-day-picker";
import APIService from "../../services/APIService";
import AuthService from "../../services/AuthService";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InvitedUserList from "../CalendarInvite/InvitedCalendarUserList/InvitedUserList";

import DateRange from "../Dashboard/components/Calendar/DateRange/DateRange";

import Header from "../../components/HomePage/Header";

const useStyles = (theme) => ({
  root: {
    marginTop: theme.spacing(13),
  },
  info: {
    textAlign: "center",
  },
  link: {
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
    margin: theme.spacing(4),
  },
  text: {
    margin: theme.spacing(3),
    textAlign: "center",
    lineHeight: 2,
  },
  subheading: {
    marginTop: theme.spacing(3),
    textAlign: "center",
  },
  durationBox: {
    marginRight: theme.spacing(10),
    marginTop: theme.spacing(9),
    position: "absolute",
    right: 0,
  },
  dateListText: {
    marginBottom: theme.spacing(1),
    textAlign: "center",
  },
  borderBox: {
    border: "1px solid #000000",
    padding: theme.spacing(1),
  },
});

class CalendarInvite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      calendarId: this.props.match.params.guid,
      calendarName: "",
      startDate: new Date(),
      endDate: new Date(),
      monthDif: 0,
      selectedDays: [],
      unavailabilities: [],
      availableRanges: [],
      availabilities: [],
      isUnavailableLoad: false,
      duration: "All",
      checkedUser: "",
      durationArray: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
  }

  componentDidMount() {
    var daysArray = ["All"];
    for (var i = 2; i < 31; i++) {
      daysArray.push(i.toString() + " Days");
    }

    AuthService.setCalendarId(this.props.match.params.guid);

    APIService.getInviteCalendar(this.state.calendarId).then((response) => {
      let startDate = new Date(response.data.startMonth);
      let endDate = new Date(response.data.endMonth);

      localStorage.setItem(CalendarString.CalendarName, response.data.name);
      localStorage.setItem(CalendarString.StartMonth, startDate);
      localStorage.setItem(CalendarString.EndMonth, endDate);

      let startMonth = startDate.getMonth();
      let startYear = startDate.getFullYear();
      let endMonth = endDate.getMonth();
      let endYear = endDate.getFullYear();

      let newEndMonth = endMonth + 12 * (endYear - startYear) + 1;

      let monthDif = newEndMonth - startMonth;

      localStorage.setItem(CalendarString.CalendarName, response.data.name);
      localStorage.setItem(CalendarString.StartMonth, startDate);
      localStorage.setItem(CalendarString.EndMonth, endDate);

      this.setState({
        calendarName: response.data.name,
        startDate: startDate,
        endDate: endDate,
        monthDif: monthDif,
        durationArray: daysArray,
      });
    });
  }

  getDatesDate(duration, checkedUser) {
    const { calendarId } = this.state;

    APIService.getInviteCalendarUnavailability(
      calendarId,
      duration,
      checkedUser
    ).then((response) => {
      const items = [];

      for (let idx in response.data) {
        const item = response.data[idx];

        items.push(new Date(item.unavailableDate));
      }

      items.push({
        before: new Date(),
      });

      this.setState({
        unavailabilities: items,
      });
    });
  }

  getAvailableDateRanges(duration, checkedUser) {
    const { calendarId } = this.state;

    if (duration !== "All") {
      APIService.getInvitedAvailabilityRanges(
        calendarId,
        duration,
        checkedUser
      ).then((response) => {
        this.setState({
          availableRanges: response.data,
        });
      });
    } else {
      this.setState({
        availableRanges: null,
      });
    }
  }

  getAvailableDate(duration, checkedUser) {
    const { calendarId } = this.state;

    APIService.getInvitedAvailability(calendarId, duration, checkedUser).then(
      (response) => {
        const items = [];

        for (let idx in response.data) {
          const item = response.data[idx];

          items.push(new Date(item.availableDate));
        }

        this.setState({
          availabilities: items,
        });
      }
    );
  }

  menuDays(durationArray) {
    return durationArray.map((test) => {
      return <MenuItem value={test}>{test}</MenuItem>;
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

  handleChange(event) {
    event.preventDefault();

    this.setState({
      [event.target.name]: event.target.value,
    });

    this.getDatesDate(event.target.value, this.state.checkedUser);
    this.getAvailableDate(event.target.value, this.state.checkedUser);
    this.getAvailableDateRanges(event.target.value, this.state.checkedUser);
  }

  handleCheck = (checkValue) => {
    const stringData = checkValue.reduce((result, user) => {
      return `${result}${user.userId},`;
    }, "");

    this.getDatesDate(this.state.duration, stringData.slice(0, -1));
    this.getAvailableDate(this.state.duration, stringData.slice(0, -1));
    this.setState({ checkedUser: stringData.slice(0, -1) });

    if (this.state.duration !== "All") {
      this.getAvailableDateRanges(this.state.duration, stringData.slice(0, -1));
    }
  };

  dateRangeText() {
    const { classes } = this.props;

    if (this.state.availableRanges && this.state.availableRanges.length > 0) {
      return (
        <Grid>
          <Box ml={5} mt={2}>
            <Typography className={classes.dateListText}>
              Dates selected members are available <br />
              for stated duration.
            </Typography>
            <DateRange data={this.state.availableRanges} />
          </Box>
        </Grid>
      );
    }
  }

  duration() {
    const { classes } = this.props;
    const { duration } = this.state;

    return (
      <Grid>
        <Box className={classes.borderBox}>
          <Box display="flex" justifyContent="center" marginBottom={2}>
            <Typography className={classes.info} variant="h5">
              Change the duration to see when those members that <br /> are
              selected are available for a certain duration:
            </Typography>
          </Box>
          <Grid container justify="center">
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="duration-label">Duration</InputLabel>
              <Select
                labelid="input-duration-label"
                id="duration"
                label="Duration"
                name="duration"
                value={duration}
                onChange={this.handleChange}
              >
                {this.menuDays(this.state.durationArray)}
              </Select>
            </FormControl>
          </Grid>
          {this.dateRangeText()}
        </Box>
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;

    const {
      calendarId,
      calendarName,
      startDate,
      endDate,
      monthDif,
      unavailabilities,
      availabilities,
    } = this.state;

    const modifiers = {
      availableDays: availabilities,
      weekends: { daysOfWeek: [0, 6] },
      disabledDays: unavailabilities,
    };
    const modifiersStyles = {
      availableDays: {
        color: "#548B54",
        backgroundColor: "#8cdd81",
      },
      weekends: {
        color: "white",
        backgroundColor: "#169B1E",
      },
      disabledDays: {
        color: "white",
        backgroundColor: "#EA3C53",
      },
    };
    return (
      <div>
        <Header currentPage="CalendarInvite" />
        <div className={classes.root}>
          <Typography className={classes.link} variant="h1">
            {calendarName}
          </Typography>
          <Box ml={10} mt={9} position="absolute">
            <Typography className={classes.info} variant="h5">
              Filter your calendar by your trips members
            </Typography>
            <InvitedUserList OnSelectChecked={this.handleCheck} />
          </Box>
          <Box className={classes.durationBox}>{this.duration()}</Box>
          <Typography className={classes.text} variant="h5">
            Everyones availabilities are overlapped on your share calendar
            below. <br />
            You can filter this calendar by the invitees (on the left) and by
            your preferred duration (right) <br />
            You can then search and book your perfect holiday and no one gets
            left behind!
          </Typography>
          <Grid container alignItems="center" justify="center">
            <Button
              variant="contained"
              onClick={() =>
                this.props.history.push("/userinvitation/" + calendarId)
              }
            >
              Add Your Unavailable Dates
            </Button>
          </Grid>
          <Typography className={classes.subheading} variant="h3">
            Your Shared availabilities
          </Typography>

          <Grid container className={classes.calendar} justify="center">
            <DayPicker
              firstDayOfWeek={1}
              selectedDays={this.state.selectedDays}
              numberOfMonths={monthDif}
              showOutsideDays
              canChangeMonth={false}
              month={startDate}
              toMonth={endDate}
              disabledDays={unavailabilities}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
          </Grid>
        </div>
      </div>
    );
  }
}

export default withRouter(
  withStyles(useStyles, { withTheme: true })(CalendarInvite)
);
