import React, { Component } from "react";
import {
  AppBar,
  Box,
  Grid,
  List,
  ListItem,
  SwipeableDrawer,
  Toolbar,
  Typography,
  withStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Logo from "../../images/YorTrips-logo.png";
import "../../styles/Header.css";
import { Helmet } from "react-helmet";
import AuthService from "../../services/AuthService";
import CalendarString from "../Dashboard/CalendarStrings";
import { Link } from "react-router-dom";

const useStyles = (theme) => ({
  root: {
    backgroundColor: theme.palette.primary.stormdust,
    boxShadow: "none",
  },
  list: {
    width: 150,
  },
  sideBarIcon: {
    padding: 0,
    color: "white",
    cursor: "pointer",
  },
  Toolbar: {
    minHeight: 70,
  },
  image: {
    width: 150,
    flexGrow: 1,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerActivate: false, drawer: false };
    this.createDrawer = this.createDrawer.bind(this);
    this.destroyDrawer = this.destroyDrawer.bind(this);
  }

  componentWillMount() {
    if (window.innerWidth <= 600) {
      this.setState({ drawerActivate: true });
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth <= 600) {
        this.setState({ drawerActivate: true });
      } else {
        this.setState({ drawerActivate: false });
      }
    });
  }

  removeDetail(page) {
    if (page === "CalendarInvite") {
      AuthService.removeCalendarId();
      localStorage.removeItem(CalendarString.CalendarName);
      localStorage.removeItem(CalendarString.StartMonth);
      localStorage.removeItem(CalendarString.EndMonth);
    }
  }

  //Small Screens
  createDrawer() {
    const { classes } = this.props;

    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Yortrips</title>
        </Helmet>
        <AppBar className={classes.root}>
          <Toolbar className={classes.Toolbar}>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <MenuIcon
                className={this.props.classes.sideBarIcon}
                onClick={() => {
                  this.setState({ drawer: true });
                }}
              />
              <Box>
                <Grid className={classes.image}>
                  <img className={classes.img} alt="Logo" src={Logo} />
                </Grid>
              </Box>
              <Typography color="inherit" variant="headline"></Typography>
            </Grid>
          </Toolbar>
        </AppBar>

        <SwipeableDrawer
          open={this.state.drawer}
          onClose={() => {
            this.setState({ drawer: false });
          }}
          onOpen={() => {
            this.setState({ drawer: true });
          }}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={() => {
              this.setState({ drawer: false });
            }}
            onKeyDown={() => {
              this.setState({ drawer: false });
            }}
          >
            <List className={this.props.classes.list}>
              <ListItem key={1} button divider>
                Log In
              </ListItem>
              <ListItem key={2} button divider>
                Sign Up
              </ListItem>
            </List>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }

  //Larger Screens
  destroyDrawer() {
    const { classes } = this.props;

    return (
      <AppBar className={classes.root}>
        <Toolbar>
          <Box style={{ maxWidth: "100%", maxHeight: "100px", flexGrow: 1 }}>
            <Grid className={classes.image}>
              <img className={classes.img} alt="Logo" src={Logo} />
            </Grid>
          </Box>
          <nav className="header-button">
            <ul>
              <li>
                <a href="/calendarguest/addcalendar">Create Shared Calendar</a>
              </li>
              <li>
                <a href="/signup">Sign Up</a>
              </li>
              <li>
                <Link
                  onClick={() => this.removeDetail(this.props.currentPage)}
                  to={{
                    pathname: "/login",
                    state: { lastPage: this.props.currentPage },
                  }}
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </Toolbar>
      </AppBar>
    );
  }

  render() {
    return (
      <div>
        {this.state.drawerActivate ? this.createDrawer() : this.destroyDrawer()}
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(Header);
