import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { LoggedInUserContext } from "../../../App";

const StaffRoute = ({ children, ...rest }) => {
  const { loggedInUser } = useContext(LoggedInUserContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedInUser &&
        (loggedInUser.role === "admin" || loggedInUser.role === "staff") ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/auth",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default StaffRoute;
