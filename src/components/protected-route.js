import React from 'react';
import {Route, Redirect} from 'react-router-dom';

const ProtectedRoute = ({ component: Comp, loggedIn, path, redirectDest = "/", ...rest }) => {

  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        return loggedIn ? (
          <Comp loggedIn={loggedIn} {...props} {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: redirectDest, //supply redirectDest in App.js to choose location to send user when redirect occurs
              state: {
                prevLocation: path,
                error: "You must Login to access this page.",
              },
            }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;