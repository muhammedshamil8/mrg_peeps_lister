import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AuthRoleRequire from '@/components/router/AuthRole';

const AdminLayout = () => {
    return (
        <AuthRoleRequire role="admin">
            <div className="flex flex-col h-screen">
                <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
                    <nav className="flex justify-around">
                        <NavLink 
                            to="/add-data" 
                            className={({ isActive }) => 
                                `p-3 rounded-lg transition-transform duration-200 
                                ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                            }
                        >
                            Add New
                        </NavLink>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                `p-3 rounded-lg transition-transform duration-200 
                                ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                            }
                        >
                            List View
                        </NavLink>
                        <NavLink 
                            to="/statistics" 
                            className={({ isActive }) => 
                                `p-3 rounded-lg transition-transform duration-200 
                                ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                            }
                        >
                            Statistics
                        </NavLink>
                    </nav>
                </header>
                <main className="flex-grow bg-gray-100  overflow-auto">
                    <Outlet />
                </main>
            </div>
        </AuthRoleRequire>
    );
};

export default AdminLayout;
