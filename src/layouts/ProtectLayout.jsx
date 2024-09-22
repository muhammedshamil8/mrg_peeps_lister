import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AuthRoleRequire from '@/components/router/AuthRole';
import { useAuth } from '@/context/AuthContext';
import { Home, BarChart, PlusCircle, LogOut } from 'lucide-react'; // Importing Lucide icons
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const AdminLayout = () => {
    const { handleSignOut } = useAuth();

    const handleLogoutClick = async () => {
        try {
            await handleSignOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthRoleRequire role="admin">
            <div className="flex flex-col h-screen bg-slate-900">
                <header className="hidden md:block bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
                    <nav className="flex justify-around select-none">
                        <NavLink
                            to="/add-data"
                            className={({ isActive }) =>
                                `flex justify-center gap-2 items-center p-2 rounded-lg transition-transform duration-200 
                                ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                            }
                        >
                            <PlusCircle className="h-6 w-6" />
                            Add New
                        </NavLink>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex justify-center gap-2 items-center p-2 rounded-lg transition-transform duration-200 
                                ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                            }
                        >
                            <Home className="h-6 w-6" />
                            List View
                        </NavLink>
                        <NavLink
                            to="/statistics"
                            className={({ isActive }) =>
                                `flex justify-center gap-2 items-center p-2 rounded-lg transition-transform duration-200 
                                ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                            }
                        >
                            <BarChart className="h-6 w-6" />
                            Statistics
                        </NavLink>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button
                                    className="flex justify-center gap-2 items-center p-2 rounded-lg bg-red-500 hover:bg-red-600 transition duration-200"
                                >
                                    <LogOut className="h-6 w-6" />
                                    Sign Out
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to log out? Your current session will be ended.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleLogoutClick}>Log Out</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </nav>
                </header>
                <main className="flex-grow bg-gray-100 overflow-auto">
                    <Outlet />
                </main>
                {/* Bottom Navigation for Mobile */}
                <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 p-4 md:hidden">
                    <div className="flex justify-around">
                        <NavLink 
                            to="/add-data" 
                            className={({ isActive }) => 
                                `flex flex-col items-center p-2 transition rounded-lg duration-200 ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                            }
                        >
                            <PlusCircle className="h-6 w-6 text-white" />
                        </NavLink>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                `flex flex-col items-center p-2 transition rounded-lg duration-200 ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                            }
                        >
                            <Home className="h-6 w-6 text-white" />
                        </NavLink>
                        <NavLink 
                            to="/statistics" 
                            className={({ isActive }) => 
                                `flex flex-col items-center p-2  transition rounded-lg duration-200 ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                            }
                        >
                            <BarChart className="h-6 w-6 text-white" />
                        </NavLink>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button
                                    className="flex flex-col items-center p-2 transition rounded-lg duration-200"
                                >
                                    <LogOut className="h-6 w-6 text-red-500" />
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to log out? Your current session will be ended.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleLogoutClick}>Log Out</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </nav>
            </div>
        </AuthRoleRequire>
    );
};

export default AdminLayout;
