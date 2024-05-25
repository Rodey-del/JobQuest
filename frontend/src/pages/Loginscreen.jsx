import React, { useState } from "react";
import { loginApi } from "../api/api";
import logo from "../images/logos/logo.png";

import { toast } from "react-toastify";
import { Navigate, useNavigate, Link } from "react-router-dom";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    console.log(email, password);
    const data = {
      email: email,
      password: password,
    };

    // Check test API
    loginApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          localStorage.setItem("token", res.data.token);
          const jsonDecode = JSON.stringify(res.data.userData);
          localStorage.setItem("user", jsonDecode);
          if (res.data.userData.isSuperAdmin) {
            navigate('/admin/dashboard');
            window.location.reload();
          }
          else if (res.data.userData.isAdmin) {
            navigate('/admin/addjobs');
            window.location.reload();
          }
          else {
            navigate('/');
          } toast.success(res.data.message);
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* <div className="bg-white p-8 rounded shadow-md w-full md:w-96 relative"> */}
      <div className="bg-gradient-to-r from-white-300 to-green-200 p-8 rounded-xl shadow-lg w-full md:w-96 relative transform transition-transform duration-300 hover:scale-105 relative border-2 border-blue-500">
        {/* <img
          src="../images/flags/nepal.png"
          alt="Image"
          className="hidden md:block absolute inset-y-0 right-0 w-1/3"
        /> */}
        <div className="flex justify-center items-center ">
          <img className="logo" src={logo} alt="Logo" />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-blue-500 text-center">Login</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-600 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500 pr-10"
            />
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-green-500" />
              <span className="ml-2 text-gray-600 text-sm">Remember me</span>
            </label>
          </div>
          <button
            type="submit"
            onClick={submitForm}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline-green mb-4"
          >
            Log In
          </button>
          <div className="text-right">
            <button
              type="button"
              className="text-green-500 hover:underline focus:outline-none"
            >
              <Link to={'/forgot-password'} className="hover:underline text-red-500">Forgot password?</Link>
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{' '}
            <Link to={'/register'} className="text-green-500 hover:underline cursor-pointer text-green-500">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
