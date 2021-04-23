import React from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider } from "@material-ui/core";

import theme from "./theme";
import Routes from "./Routes";
import { AuthProvider } from "./Auth";

const browserHistory = createBrowserHistory({ forceRefresh: true });

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
