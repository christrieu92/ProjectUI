/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import Logo from "../../images/YorTrips-logo.png";
import moment from "moment";
import LoginString from "../LoginStrings";

import {
  ValidateName,
  ValidateEmail,
  ValidatePassword,
} from "../../services/Validation";
import FirebaseService from "../../services/FirebaseService";
import APIService from "../../services/APIService";
import AuthService from "../../services/AuthService/AuthService";
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
  emailError: {
    marginTop: theme.spacing(2),
    color: "red",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
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

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      name: "",
      created: moment().format("YYYY-MM-DD"),
      validation: {
        name: false,
        email: false,
        password: false,
      },
      error: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // custom rule will have name 'isPasswordMatch'
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

    ValidatorForm.addValidationRule("isPasswordValidated", (value) => {
      var passwordValidate = ValidatePassword(value);

      this.setState({
        validation: {
          ...this.state.validation,
          password: passwordValidate,
        },
      });

      return passwordValidate;
    });
  }

  handleChange(event) {
    event.preventDefault();

    this.setState({
      [event.target.name]: event.target.value,
      error: false,
    });
  }

  async handleSubmit(event) {
    const { name, email, password, created } = this.state;

    event.preventDefault();
    try {
      FirebaseService.createUserWithEmailAndPassword(email, password)
        .then(async (result) => {
          const tokenResponse = FirebaseService.userToken(true);

          console.log(tokenResponse);

          APIService.postUser(
            tokenResponse,
            name,
            email,
            result.user.uid,
            created
          )
            .then((response) => {
              if (response.status == 201) {
                this.setUser(name, email);

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
                  ).then(() => {
                    localStorage.setItem("isAuthenticated", true);
                    this.props.history.push("/dashboard");
                  });
                } else {
                  localStorage.setItem("isAuthenticated", true);
                  this.props.history.push("/dashboard");
                }
              }
            })
            .catch(() => {
              console.log("Error storing user credentials");
            });
        })
        .catch(() => {
          this.setState({
            error: true,
          });
        });
    } catch (error) {
      document.getElementById("1").innerHTML =
        "Error in signing up please try again";
    }
  }

  setUser = (name, email) => {
    localStorage.setItem(LoginString.Name, name);
    localStorage.setItem(LoginString.Email, email);
  };

  duplicateEmail() {
    const { classes } = this.props;
    const { error } = this.state;

    if (error) {
      return (
        <Grid>
          <Typography variant="h5" className={classes.emailError}>
            Email already in use, Log in below
          </Typography>
        </Grid>
      );
    }
  }

  render() {
    const { classes } = this.props;
    const { name, email, password } = { ...this.state.validation };
    const enabled = name === true && email === true && password === true;

    return (
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline>
            <Grid
              item
              xs
              component={Card}
              className={classes.root}
              variant="outlined"
            >
              <CardContent>
                <div className={classes.paper}>
                  <Box display="flex" justifyContent="center" m={1} p={1}>
                    <Grid className={classes.image}>
                      <img className={classes.img} alt="Logo" src={Logo} />
                    </Grid>
                  </Box>
                  <Typography component="h1" variant="h5">
                    Sign up
                  </Typography>
                  {this.duplicateEmail()}
                  <ValidatorForm
                    className={classes.form}
                    ref={(r) => (this.form = r)}
                    onSubmit={this.handleSubmit}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
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
                      <Grid item xs={12}>
                        <TextValidator
                          variant="outlined"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          validators={["isEmailValidated", "required"]}
                          onChange={this.handleChange}
                          value={this.state.email}
                          errorMessages={["Email is invalid"]}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextValidator
                          variant="outlined"
                          required
                          fullWidth
                          id="password"
                          label="Password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          validators={["isPasswordValidated", "required"]}
                          onChange={this.handleChange}
                          value={this.state.password}
                          errorMessages={["Please enter your password"]}
                          helperText={[
                            "Password must be at least 8 characters",
                          ]}
                        />
                      </Grid>
                      <div className="error">
                        <p id="1" style={{ color: "red" }}></p>
                      </div>
                    </Grid>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      disabled={!enabled}
                    >
                      Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                      <Grid item>
                        <Link
                          style={{ color: "blue" }}
                          to="/login"
                          variant="body2"
                        >
                          Already have an account? Sign in
                        </Link>
                      </Grid>
                    </Grid>
                  </ValidatorForm>
                </div>
              </CardContent>
            </Grid>
          </CssBaseline>
          <Box mt={5}>
            <Copyright />
          </Box>
        </Container>
      </div>
    );
  }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(SignUp));
