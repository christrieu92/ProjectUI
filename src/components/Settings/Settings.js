import React, { Component } from "react";
import { Grid, Paper, Typography, withStyles } from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";

const useStyles = (theme) => ({
  root: {
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(6),
  },
  paper: {
    padding: theme.spacing(13),
    textAlign: "center",
    border: "0px none #000000",
    boxShadow: "0 0 0 #fff",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    margin: theme.spacing(4),
  },
});

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  FormRow() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Grid item xs={4} className={classes.cell}>
          <Paper className={classes.paper}></Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}></Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}></Paper>
        </Grid>
      </React.Fragment>
    );
  }

  SettingsInfo() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Grid item xs={4}>
          <Paper className={classes.paper}></Paper>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.title} variant="h4">
            This hasn't been designed for the prototype, we will add in the
            features here in the next round of development (this includes
            changing username, password, delete account etc.)
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}></Paper>
        </Grid>
      </React.Fragment>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid container item xs={12} spacing={3}>
            {this.FormRow()}
          </Grid>
          <Grid container item xs={12} spacing={3}>
            {this.SettingsInfo()}
          </Grid>
          <Grid container item xs={12} spacing={3}>
            {this.FormRow()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(Settings);
