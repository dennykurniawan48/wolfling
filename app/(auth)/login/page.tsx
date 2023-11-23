"use client"
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { StatusLoading } from '../../util/enum/StatusLoading';
import { signIn } from 'next-auth/react';
import LoginSchema from '../../util/schema/yupSchema/login';
import Link from 'next/link';

function Page() {
    const [statusLogin, setStatusLogin] = useState(StatusLoading.Idle)
    const [errorLogin, setErrorLogin] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const login = useFormik({
        initialValues: {
          username: "",
          password: "",
        },
        onSubmit: async (values) => {
          if (statusLogin == StatusLoading.Loading) {
            // do nothing on loading to login
            return;
          }
          setStatusLogin(StatusLoading.Loading);
          try {
            const user = await signIn("credentials", values);
          } catch (e) {
            setStatusLogin(StatusLoading.Error);
            setErrorLogin("Wrong credentials");
          }
        },
        validationSchema: LoginSchema,
      });
  return (
    <div className='w-full h-screen'>
    <div className='w-full h-6 bg-slate-600 flex justify-center items-center'>
        <span className='text-sm text-white'>Portfolio Denny Kurniawan</span>
    </div>
    <div className='w-full h-[calc(100%_-_1.5rem)] flex items-center justify-center'>
        <form method='POST' onSubmit={login.handleSubmit} className='flex flex-col w-72'>
        <span className="text-xl w-full text-center">Login</span>
            <div className="flex flex-row items-center mt-2 justify-center space-x-2">
              <span className="text-sm text-center">Don&apos;t have account? </span>
              <Link
                href={"/register"}
                className="text-sm text-center text-blue-600"
              >
                Sign up
              </Link>
            </div>
            <div className=" mt-4">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </span>
                </div>
                <input
                  type="text"
                  name="username"
                  id="username"
                  onBlur={login.handleBlur}
                  onChange={login.handleChange}
                  value={login.values.username}
                  className="outline-none block w-full rounded-md border-0 py-1.5 pl-12 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Username"
                />
              </div>
              {login.touched.username && login.errors.username && (
                <span className="text-xs text-red-500">
                  {login.errors.username}
                </span>
              )}
            </div>
            <div className=" mt-3">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </span>
                </div>
                <input
                  type={!showPassword ? "password" : "text"}
                  name="password"
                  id="password"
                  onBlur={login.handleBlur}
                  onChange={login.handleChange}
                  value={login.values.password}
                  className="outline-none block w-full rounded-md border-0 py-1.5 pl-12 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center mr-4">
                  <button
                    type="button"
                    onClick={() => setShowPassword((state) => !state)}
                  >
                    {!showPassword && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                    {showPassword && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {login.touched.password && login.errors.password && (
                <span className="text-xs text-red-500">
                  {login.errors.password}
                </span>
              )}
            </div>
            {statusLogin === StatusLoading.Error && (
              <div
                className="bg-red-100 border mt-2 border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{errorLogin}</span>
              </div>
            )}
            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-2"
            >
              {statusLogin === StatusLoading.Loading ? "Loading..." : "Login"}
            </button>
            <button
              onClick={() => {
                signIn("google");
              }}
              type="button"
              className="mt-6 w-full bg-white text-blue-600 border border-blue-600 py-2"
            >
              Login With Google
            </button>
        </form>
    </div>
    </div>
  )
}

export default Page