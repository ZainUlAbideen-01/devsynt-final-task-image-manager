import React from 'react'
import { Link } from 'react-router'

function Verification() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-87.5 bg-white border border-gray-300 shadow-lg rounded-xl p-8 flex flex-col items-center gap-6">

        <img src="/logo.svg" className="w-24 h-auto mb-2" alt="Logo" />

        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-lime-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-lime-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 12l-4 4-4-4m8-4l-4 4-4-4"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Verify your email
        </h2>

        <p className="text-sm text-gray-600 text-center leading-relaxed">
          We've sent a verification link to your email address.
          <br />
          Please check your inbox and click the link to activate your account.
        </p>

        <p className="text-xs text-gray-500 text-center">
          Didn't receive the email? Check your spam folder.
        </p>

        <Link
          to="/"
          className="w-full text-center bg-lime-500 text-white font-medium py-2 rounded-lg hover:bg-lime-600 transition-colors"
        >
          Back to Login
        </Link>

      </div>
    </div>
  )
}

export default Verification