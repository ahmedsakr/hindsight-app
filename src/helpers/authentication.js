import React from 'react';
import { Redirect } from 'react-router';

/**
 * Wrapper React component for creating views that require
 * a state to be provided (e.g., OTP page, insights page)
 * @param {*} view 
 * @returns 
 */
const AuthenticatedView = (view) => {
  return (props) => {
    // Move back to the login page if we don't have tokens
    // (user might have manually navigated to this view)
    if (!props.location.state) {
      return (
        <Redirect
          to={{
            pathname: "/"
          }}
        />
      );
    }

    return view(props);
  }
}

export default AuthenticatedView;