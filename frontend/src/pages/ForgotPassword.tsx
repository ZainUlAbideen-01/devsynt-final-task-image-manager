import React, { useState } from 'react'
import { Link } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'

function ForgotPassword() {

  const [email, setEmail] = useState('')
  const [error, setError] = useState('hidden')
  const [success, setSuccess] = useState('hidden')

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      setSuccess('')
    },
    onError: () => {
      setError('')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('hidden')
    setSuccess('hidden')

    forgotPasswordMutation.mutate({ email })
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-50'>
      <form onSubmit={handleSubmit} className='w-87.5 bg-white border border-gray-300 shadow-lg rounded-xl p-8 flex flex-col items-center gap-6'>

        <img src="/logo.svg" className='w-24 h-auto mb-2' alt="Logo" />

        <div className='w-full flex flex-col gap-5'>

          <div className='flex items-center gap-3 border-b border-gray-300 pb-2'>
            <img src="/person.svg" className='w-6 h-6' alt="Email Icon" />
            <input
              type="email"
              placeholder='Enter Email Address'
              className='flex-1 text-sm outline-none placeholder-gray-400'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={`text-red-800 text-center ${error}`}>
            Email not found
          </div>

          <div className={`text-green-700 text-center ${success}`}>
            Password reset link sent to your email
          </div>

          <button
            type="submit"
            className="w-full bg-lime-500 text-white font-medium py-2 rounded-lg hover:bg-lime-600 transition-colors flex justify-center items-center gap-2"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <Link
            to="/"
            className="text-sm text-lime-600 underline cursor-pointer text-center"
          >
            Back to Login
          </Link>

        </div>
      </form>
    </div>
  )
}

export default ForgotPassword