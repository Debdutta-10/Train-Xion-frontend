import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { FaHome, FaAppleAlt, FaTint, FaBullseye, FaDumbbell, FaSignOutAlt } from 'react-icons/fa';  // Updated icons
import { BsChatLeftText } from 'react-icons/bs';  // Corrected icon import

const Navbar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
    };

    return (
        <div>
            <span
                className="absolute text-white text-4xl top-5 left-4 cursor-pointer"
                onClick={toggleSidebar}
            >
                <BsChatLeftText className="px-2 bg-gray-900 rounded-md" />
            </span>

            <div className={`navbar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-900 ${!isSidebarOpen && 'hidden'}`} style={{ zIndex: 25 }} >
                <div className="text-gray-100 text-xl">
                    <div className="p-2.5 mt-1 flex items-center">
                        <h1 className="font-bold text-gray-200 text-[20px] ml-3">Train-Xion</h1>
                        <button
                            className="bi bi-x cursor-pointer ml-28 lg:hidden"
                            onClick={toggleSidebar}
                        >
                            X
                        </button>
                    </div>
                    <div className="my-2 bg-gray-600 h-[1px]" />
                </div>

                <Link to="/" className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
                    <FaHome />
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Dashboard</span>
                </Link>

                <Link to="/track-nutrition" className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
                    <FaAppleAlt />
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Track Nutrition</span>
                </Link>

                <Link to="/track-water" className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
                    <FaTint />
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Track Water</span>
                </Link>

                <Link to="/track-goals" className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
                    <FaBullseye />
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Track Goals</span>
                </Link>

                <Link to="/track-workouts" className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
                    <FaDumbbell />
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Track Workouts</span>
                </Link>

                <div className="my-4 bg-gray-600 h-[1px]" />

                <Link to="/login"
                    onClick={handleLogout}
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                >
                    <FaSignOutAlt />
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
