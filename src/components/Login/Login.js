import React, { Component } from "react";
import { Link } from "react-router-dom";
import FirebaseService from "../../services/FirebaseService";

import "../../styles/Login.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

import Logo from "../../images/YorTrips-logo.png";
import { withStyles } from "@material-ui/core/styles";
import LoginString from "../LoginStrings";

import AuthService from "../../services/AuthService/AuthService";
import APIService from "../../services/APIService";
import CalendarString from "../Dashboard/CalendarStrings";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Copyright &copy;{" "}
      <Link color="inherit" to="/">
        YorTrips
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = (theme) => ({
  root: {
    position: "relative",
    marginTop: "25%",
  },
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.info.light,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  image: {
    width: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();

    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async handleSubmit(event) {
    const { email, password } = this.state;

    event.preventDefault();

    try {
      await FirebaseService.signInWithEmailAndPassword(email, password)
        .then(async (userCredentials) => {
          //console.log(result.user.emailVerified);
          const tokenResponse = FirebaseService.userToken();

          if (tokenResponse) {
            // Store the token in our cookie

            APIService.getUserByEmail(
              tokenResponse,
              userCredentials.user.email
            ).then((response) => {
              localStorage.setItem(
                LoginString.Email,
                userCredentials.user.email
              );
              localStorage.setItem(LoginString.Name, response.data.name);

              AuthService.handleLoginSuccess(
                tokenResponse,
                response.data.userId
              );

              if (localStorage.getItem(CalendarString.CalendarName) != null) {
                let startDate = new Date(
                  localStorage.getItem(CalendarString.StartMonth)
                );
                let endDate = new Date(
                  localStorage.getItem(CalendarString.EndMonth)
                );

                APIService.postCalendar(
                  tokenResponse,
                  localStorage.getItem(CalendarString.CalendarName),
                  response.data.userId,
                  JSON.parse(localStorage.getItem("Unavailability")),
                  startDate,
                  endDate
                ).then((response) => {
                  AuthService.setCalendarId(response.data.calendarId);

                  localStorage.setItem("isAuthenticated", true);
                  this.props.history.push("/invitation");
                });
              } else {
                localStorage.setItem("isAuthenticated", true);
                this.props.history.push("/dashboard");
              }
            });
          } else {
            alert("Token Failed");
          }
        })
        .catch((error) => {
          this.setState({
            error: "Error while signing in please try again",
          });
        });
    } catch (error) {
      document.getElementById("1").innerHTML =
        "Error in logging in please try again";
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline>
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <div className={classes.paper}>
                  <Box display="flex" justifyContent="center" m={1} p={1}>
                    <Grid className={classes.image}>
                      <img className={classes.img} alt="Logo" src={Logo} />
                    </Grid>
                  </Box>
                  <Typography component="h1" variant="h5">
                    Sign in
                  </Typography>
                  <form
                    className={classes.form}
                    noValidate
                    onSubmit={this.handleSubmit}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          onChange={this.handleChange}
                          value={this.state.email}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                          onChange={this.handleChange}
                          value={this.state.password}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Sign In
                    </Button>
                    <Grid container>
                      <Grid item xs>
                        <Link to="/" variant="body2">
                          Forgot password?
                        </Link>
                      </Grid>

                      <Grid item>
                        <Link
                          style={{ color: "blue" }}
                          to="/signup"
                          variant="body2"
                        >
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </CardContent>
            </Card>
          </CssBaseline>
          <Box mt={5}>
            <Copyright />
          </Box>
        </Container>
      </div>
    );
  }
}
export default withStyles(useStyles, { withTheme: true })(Login);
