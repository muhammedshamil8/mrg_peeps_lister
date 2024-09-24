import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, BarChart, PlusCircle, LogIn, BadgePlus } from 'lucide-react'; // Importing Lucide icons

const PublicLayout = () => {
    return (
        <div className="flex flex-col h-screen bg-slate-900 ">
            {/* <header className="hidden md:block bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
                <nav className="flex justify-around select-none">
                    <NavLink
                        to="/add-data"
                        className={({ isActive }) =>
                            `flex justify-center gap-2 items-center p-2 rounded-lg transition duration-200 
                            ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                        }
                    >
                        <PlusCircle className="h-6 w-6" />
                        Add New
                    </NavLink>
                    <NavLink
                        to="/add-categories"
                        className={({ isActive }) =>
                            `flex justify-center gap-2 items-center p-2 rounded-lg transition duration-200 
                            ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                        }
                    >
                        
                        <BadgePlus className="h-6 w-6" />
                        Add Category
                    </NavLink>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex justify-center gap-2 items-center p-2 rounded-lg transition duration-200 
                            ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                        }
                    >
                        <Home className="h-6 w-6" />
                        List View
                    </NavLink>
                    <NavLink
                        to="/statistics"
                        className={({ isActive }) =>
                            `flex justify-center gap-2 items-center p-2 rounded-lg transition duration-200 
                            ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                        }
                    >
                        <BarChart className="h-6 w-6" />
                        Statistics
                    </NavLink>
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `flex justify-center gap-2 items-center p-2 rounded-lg transition duration-200 
                            ${isActive ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'}`
                        }
                    >
                        <LogIn className="h-6 w-6" />
                        Log In
                    </NavLink>
                </nav>
            </header> */}
            <h1 className='text-xl text-white text-center p-4'>Wedding Calling Lister</h1>
            <main className="flex-grow bg-gray-100 overflow-auto">
                <Outlet />
            </main>
            {/* Bottom Navigation for Mobile */}
            {/* <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:hidden">
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
                        to="/add-categories" 
                        className={({ isActive }) => 
                            `flex flex-col items-center p-2 transition rounded-lg duration-200 ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                        }
                    >
                        <BadgePlus className="h-6 w-6 text-white" />
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
                            `flex flex-col items-center p-2 transition rounded-lg duration-200 ${isActive ? 'bg-blue-500 scale-105' : 'hover:bg-blue-500'}`
                        }
                    >
                        <BarChart className="h-6 w-6 text-white" />
                    </NavLink>
                    <NavLink 
                        to="/login" 
                        className={({ isActive }) => 
                            `flex flex-col items-center p-2 transition rounded-lg duration-200 ${isActive ? 'bg-blue-600' : ' hover:bg-blue-600'}`
                        }
                    >
                        <LogIn className="h-6 w-6 text-white" />
                    </NavLink>
                </div>
            </nav> */}
            <div className="flex flex-col items-center justify-center p-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <p className="text-sm md:text-base">
                    &copy; {new Date().getFullYear()} | Built with ❤️ by
                    <a href="https://zamil.me" className="ml-1 underline hover:text-gray-200 transition-colors">
                        Zamil
                    </a>
                </p>
            </div>

        </div>
    );
};

export default PublicLayout;
