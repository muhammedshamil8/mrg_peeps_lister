import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AuthRoleRequire = ({ role, children }) => {
    const authContext = useAuth();
    const { user, role: userRole, handleSignOut } = authContext || {};
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('User:', user);
        console.log('User Role:', userRole);
        console.log('Required Role:', role);

        if (user !== null) {
            if (userRole !== role) {
                navigate('/login');
            }
            setLoading(false);
        } else {
            navigate('/login');
        }
    }, [user, userRole, role, navigate]);


    if (loading) {
        return (
            <div className='fixed top-0 left-0 w-full h-full bg-slate-900 flex items-center justify-center z-50'>
                <p className='text-center font-semibold text-white flex items-center justify-center'>Loading...</p>
            </div>
        );
    }

    return userRole === role ? children : <Navigate to="/login" replace />;
};

export default AuthRoleRequire;
