// src/pages/Login.jsx
import React from 'react';

const Login = ({ onLogin }) => {
    // In a real app, you'd have state for email/password and a submit handler
    return (
        <section className="py-20 bg-gray-50 min-h-[50vh] flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={onLogin} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                            Sign In
                        </button>
                        <a className="inline-block align-baseline font-bold text-sm text-green-500 hover:text-green-800" href="#">
                            Forgot Password?
                        </a>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Login;