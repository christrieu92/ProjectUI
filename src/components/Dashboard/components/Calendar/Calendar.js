import React, { Component } from "react";
import CalendarString from "../../CalendarStrings";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  withStyles,
} from "@material-ui/core";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-datepicker/dist/react-datepicker.css";
import firebase from "../../../../services/firebase";
import FirebaseService from "../../../../services/FirebaseService";
import APIService from "../../../../services/APIService";
import AuthService from "../../../../services/AuthService";
import UserList from "../UserList/UserList";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import DateRange from "./DateRange/DateRange";
import LinkIcon from "@material-ui/icons/Link";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = (theme) => ({
  root: {
    marginTop: theme.spacing(6),
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
    margin: theme.spacing(4),
  },
  heading: {
    textAlign: "center",
  },
  text: {
    margin: theme.spacing(3),
    textAlign: "center",
    lineHeight: 2,
  },
  durationBox: {
    marginRight: theme.spacing(4),
    position: "absolute",
    right: 0,
  },

  subheading: {
    marginTop: theme.spacing(4),
    textAlign: "center",
  },
  info: {
    textAlign: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
  },
  submit: {
    marginTop: theme.spacing(5),
    backgroundColor: theme.palette.primary.stormdust,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  dateListText: {
    marginBottom: theme.spacing(1),
    textAlign: "center",
  },
  paper: {
    padding: theme.spacing(6),
    textAlign: "center",
    border: "0px none #000000",
    boxShadow: "0 0 0 #fff",
  },
  boxes: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(6),
    textAlign: "center",
    border: "1px solid #000000",
    boxShadow: "0 0 0 #fff",
  },
  borderBox: {
    border: "1px solid #000000",
    padding: theme.spacing(1),
  },
});

const calendarId = AuthService.getCalendarId();

const startDate = new Date(localStorage.getItem(CalendarString.StartMonth));
const endDate = new Date(localStorage.getItem(CalendarString.EndMonth));

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      calendarName: "",
      monthDif: 0,
      error: null,
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
    this.monthDif();

    var daysArray = ["All"];
    for (var i = 2; i < 31; i++) {
      daysArray.push(i.toString() + " Days");
    }

    this.setState({
      calendarName: localStorage.getItem(CalendarString.CalendarName),
      durationArray: daysArray,
    });
  }

  monthDif() {
    let startMonth = startDate.getMonth();
    let startYear = startDate.getFullYear();
    let endMonth = endDate.getMonth();
    let endYear = endDate.getFullYear();

    let newEndMonth = endMonth + 12 * (endYear - startYear) + 1;

    let monthDif = newEndMonth - startMonth;

    this.setState({
      monthDif: monthDif,
    });
  }

  getDatesDate(duration, checkedUser) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const token = FirebaseService.userToken(true);

        APIService.getUnavailabilities(
          token,
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
    });
  }

  getAvailableDateRanges(duration, checkedUser) {
    if (duration !== "All") {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          const token = FirebaseService.userToken(true);

          APIService.getAvailabilityRanges(
            token,
            calendarId,
            duration,
            checkedUser
          ).then((response) => {
            this.setState({
              availableRanges: response.data,
            });
          });
        }
      });
    } else {
      this.setState({
        availableRanges: null,
      });
    }
  }

  getAvailableDate(duration, checkedUser) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const token = FirebaseService.userToken(true);

        APIService.getAvailability(
          token,
          calendarId,
          duration,
          checkedUser
        ).then((response) => {
          const items = [];

          for (let idx in response.data) {
            const item = response.data[idx];

            items.push(new Date(item.availableDate));
          }

          this.setState({
            availabilities: items,
          });
        });
      }
    });
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

    if (this.state.durationArray !== "All") {
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
              Dates that selected members are available <br />
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

  FormRow() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Grid item xs={4}>
          <Paper className={classes.paper}></Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.boxes}>
            <Typography>
              Once the calendar tool has been perfected we will approach online
              travel agencies and their adverts and search boxes will sit here
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}></Paper>
        </Grid>
      </React.Fragment>
    );
  }

  notify = () =>
    toast.info("Link Copied", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      newestOnTop: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      rtl: false,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
    });

  render() {
    const { classes } = this.props;

    const {
      calendarName,
      monthDif,
      unavailabilities,
      selectedDays,
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
      <div className={classes.root}>
        <Typography className={classes.title} variant="h1">
          {calendarName}
        </Typography>
        <Box ml={5} position="absolute">
          <Typography className={classes.info} variant="h5">
            Filter your calendar by your trips members
          </Typography>
          <UserList OnSelectChecked={this.handleCheck} />
        </Box>
        <Box className={classes.durationBox}>{this.duration()}</Box>
        <Typography className={classes.text} variant="h5">
          Everyones availabilities are overlapped on your share calendar below.{" "}
          <br />
          You can filter this calendar by the invitees (on the left) and by your
          preferred duration (right) <br />
          You can then search and book your perfect holiday and no one gets left
          behind!
        </Typography>
        <Grid container alignItems="center" justify="center">
          <CopyToClipboard
            //text={"localhost:3000/calendarinvite/" + calendarId}
            text={"https://yortrips.xyz/calendarinvite/" + calendarId}
            onCopy={() => this.setState({ copied: true })}
          >
            <Button
              variant="contained"
              onClick={this.notify}
              endIcon={<LinkIcon />}
            >
              Invite
            </Button>
          </CopyToClipboard>
          <div align="center">
            <ToastContainer />
          </div>
        </Grid>
        <Grid container justify="center">
          <Grid item xs={6}>
            <DayPicker
              firstDayOfWeek={1}
              disabledDays={unavailabilities}
              selectedDays={selectedDays}
              numberOfMonths={monthDif}
              //onDayClick={this.handleDayClick}
              showOutsideDays
              canChangeMonth={false}
              month={startDate}
              toMonth={endDate}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid container item xs={12} spacing={3}>
            {this.FormRow()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(Calendar);
