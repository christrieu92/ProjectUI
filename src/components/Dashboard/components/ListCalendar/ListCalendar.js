import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EventNote from "@material-ui/icons/EventNote";
import CalendarString from "../../CalendarStrings";
import moment from "moment";
import { withRouter } from "react-router";
import AuthService from "../../../../services/AuthService";
import FirebaseService from "../../../../services/FirebaseService";
import APIService from "../../../../services/APIService";
import firebase from "../../../../services/firebase";
import Button from "@material-ui/core/Button";
import { CopyToClipboard } from "react-copy-to-clipboard";

import LinkIcon from "@material-ui/icons/Link";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Listcalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendars: props.calendars,
      calendarId: "",
    };
  }

  selectCalendar(calendarId) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        AuthService.setCalendarId(calendarId);

        const token = FirebaseService.userToken(true);

        APIService.getUserCalendar(token, calendarId).then((response) => {
          if (response) {
            let startDate = new Date(response.data.startMonth);
            let endDate = new Date(response.data.endMonth);

            localStorage.setItem(
              CalendarString.CalendarName,
              response.data.name
            );
            localStorage.setItem(CalendarString.StartMonth, startDate);
            localStorage.setItem(CalendarString.EndMonth, endDate);

            this.props.history.push("/suitabilitycalendar");
          }
        });
      }
    });
  }

  callback = (calendarId) => {
    this.selectCalendar(calendarId);
  };

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
    });

  render() {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                Calendar Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                Sometime in
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                Created By
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                Participants
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.calendars.map((row) => (
              <TableRow key={row.name}>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  onClick={() => this.callback(row.calendarId)}
                >
                  {row.name}
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => this.callback(row.calendarId)}
                >
                  {moment(row.startMonth).format("MMMM YYYY") +
                    " - " +
                    moment(row.endMonth).format("MMMM YYYY")}
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => this.callback(row.calendarId)}
                >
                  {row.createdByName}
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => this.callback(row.calendarId)}
                >
                  {row.participants}
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => this.selectCalendar(row.calendarId)}
                >
                  <EventNote />
                </TableCell>
                <TableCell align="center">
                  <CopyToClipboard
                    //text={"localhost:3000/calendarinvite/" + row.calendarId}
                    text={
                      "https://yortrips.xyz/calendarinvite/" + row.calendarId
                    }
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
                </TableCell>
                <div align="center">
                  <ToastContainer />
                </div>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default withRouter(Listcalendar);
