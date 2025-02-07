import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import { toast } from 'react-toastify'; // For showing toast messages
import axios from 'axios'; // Import axios for API call
import 'react-toastify/dist/ReactToastify.css'; // For styling the toasts
import gym3 from "../images/gym3.png";

const Login = () => {
    const navigate = useNavigate(); // Hook for handling redirection
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle login submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input (basic check)
        if (!email || !password) {
            toast.error('Please fill in both email and password.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/login', { email, password });
            if (response.status === 200) {
                toast.success('Login successful!');
                localStorage.setItem('token', response.data.token);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || 'An error occurred.');
            } else {
                toast.error('Something went wrong. Please try again later.');
            }
            console.error("Error during login:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div className="mt-12 flex flex-col items-center">
                        <div className="w-full flex justify-between">
                            <button
                                className="w-1/2 py-2 font-semibold bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out"
                                onClick={() => navigate('/register')}
                            >
                                Sign Up
                            </button>
                            <button
                                className="w-1/2 py-2 font-semibold bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 ease-in-out"
                                onClick={() => { }}
                            >
                                Login
                            </button>
                        </div>

                        <h1 className="text-2xl xl:text-3xl font-extrabold mt-6">Login</h1>

                        <div className="w-full flex-1 mt-8">
                            <div className="mx-auto max-w-xs">
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                    onClick={handleSubmit}
                                >
                                    <svg
                                        className="w-6 h-6 -ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <path d="M20 8v6M23 11h-6" />
                                    </svg>
                                    <span className="ml-3">Login</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-gray-200 text-center hidden lg:flex">
                    <div
                        className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url(${gym3})`,
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Login;
