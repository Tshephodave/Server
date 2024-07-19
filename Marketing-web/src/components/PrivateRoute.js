import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, user, ...rest }) => {
  return user ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
