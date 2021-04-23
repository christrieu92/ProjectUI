import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "../../../Auth";

const PrivateRoute = (props) => {
  const {
    layout: Layout,
    isAuthenticated,
    component: Component,
    ...rest
  } = props;
  const { currentUser } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(matchProps) =>
        currentUser && isAuthenticated ? (
          <Redirect to={"/dashboard"} />
        ) : (
          <Layout>
            <Component {...matchProps} />
          </Layout>
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string,
};

export default PrivateRoute;
