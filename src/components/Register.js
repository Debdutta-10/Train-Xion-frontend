import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import gym3 from "../images/gym3.png";

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!name || !email || !password) {
            toast.error('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post('https://train-xion-backend.onrender.com/api/signup', {
                name,
                email,
                password,
            });

            // Check if the response is successful
            if (response.status === 201) {
                // Show success toast
                toast.success(response.data.message || 'User registered successfully.');
                // Optionally, you can redirect to the login page after successful signup
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                // Show error toast with error message from the response
                const errorMessage = response.data.errors?.[0]?.message || 'Registration failed.';
                toast.error(errorMessage);
            }
        } catch (error) {
            // Catch unexpected errors (network errors, server issues)
            console.error('Error in registration:', error);
            // Check if the error response contains a message
            if (error.response && error.response.data && error.response.data.errors) {
                const errorMessage = error.response.data.errors?.[0]?.message || 'Something went wrong. Please try again later.';
                toast.error(errorMessage);
            } else {
                toast.error('Something went wrong. Please try again later.');
            }
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div className="mt-12 flex flex-col items-center">
                        <div className="w-full flex justify-between">
                            <button
                                className="w-1/2 py-2 font-semibold bg-gray-500 text-white hover:bg-gray-700 transition-all duration-300 ease-in-out rounded-none"
                                onClick={() => { }}
                            >
                                Sign-Up
                            </button>
                            <button
                                className="w-1/2 py-2 font-semibold bg-indigo-500 text-white hover:bg-indigo-700 transition-all duration-300 ease-in-out rounded-none"
                                onClick={handleLoginRedirect}
                            >
                                Login
                            </button>
                        </div>


                        <h1 className="text-2xl xl:text-3xl font-extrabold mt-6">Sign Up</h1>

                        <div className="w-full flex-1 mt-8">
                            <div className="mx-auto max-w-xs">
                                <input
                                    className="w-full px-7 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input
                                    className="w-full px-5 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                    className="w-full px-5 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
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
                                    <span className="ml-3">Sign Up</span>
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

export default Register;
