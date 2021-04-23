import React, { Component } from "react";
import { Box, CardMedia, withStyles } from "@material-ui/core";
import Instructions from "../../images/InstructionPage.png";
import Header from "./Header";
import Footer from "./Footer";
import "../../styles/Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Helmet } from "react-helmet";
import CalendarString from "../Dashboard/CalendarStrings";
import AuthService from "../../services/AuthService";

const styles = (theme) => ({
  root: {
    position: "relative",
    marginTop: theme.spacing(9),
    backgroundColor: theme.palette.primary.stormdust,
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(1),
  },
  img: {
    margin: "auto",
    minWidth: "100%",
    maxHeight: "802px",
    backgroundSize: "cover",
  },
  content: {
    flex: "1 0 auto",
  },
  homepage: {
    margin: "auto",
    maxHeight: "802px",
    width: "80%",
  },
  media: {
    [theme.breakpoints.up("sm")]: {
      margin: "auto",
      width: "calc(50%)",
    },
    [theme.breakpoints.up("md")]: {
      margin: "auto",
      width: "calc(43%)",
    },
    [theme.breakpoints.up("lg")]: {
      margin: "auto",
      width: "calc(65%)",
    },
    [theme.breakpoints.up("xl")]: {
      margin: "auto",
      width: "calc(67%)",
    },
  },
  card: {
    boxShadow: "none",
    backgroundColor: "#4472C4",
  },
  footer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
  },
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    AuthService.removeCalendarId();
    localStorage.removeItem(CalendarString.CalendarName);
    localStorage.removeItem(CalendarString.StartMonth);
    localStorage.removeItem(CalendarString.EndMonth);
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Yortrips</title>
        </Helmet>
        <Header />
        <div className={classes.root}>
          <div>
            <Box>
              <CardMedia
                component="img"
                className={classes.media}
                image={Instructions}
              />
            </Box>
          </div>
        </div>
        <div className={classes.footer}>
          <Footer />
        </div>
      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(Home);
