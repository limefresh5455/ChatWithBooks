import React from 'react';
import { useAuth } from '../ContextApi/AuthContext/AuthContext';
import BookLoading from '../Pages/Loading/BookLoading';
 
 
const ProtectedRoutes = ({ component: Component, ...rest }) => {
    const { users,loading } = useAuth();

    if (loading) {
        return <BookLoading />; 
    }
     
    if (!users) {
        return <Login />;
    }

    return <Component {...rest} />;
};

export default ProtectedRoutes;
