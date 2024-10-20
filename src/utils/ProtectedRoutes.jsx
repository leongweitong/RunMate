import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
    let user = null;
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
        user = JSON.parse(storedUserInfo);
    }

    return user ? <Outlet /> : <Navigate to="/initialuser" />
}

export default ProtectedRoutes