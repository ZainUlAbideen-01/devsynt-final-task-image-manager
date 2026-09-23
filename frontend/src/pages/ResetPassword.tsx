import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'

function ResetPassword() {

  const { token } = useParams()
  const navigate = useNavigate()

  const [password_01, setPassword_01] = useState('')
  const [password_02, setPassword_02] = useState('')
  const [error, setError] = useState('hidden')

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { token: string, password: string }) => 
      authApi.resetPassword(data.token, { password: data.password }),
    onSuccess: () => {
      navigate('/')
    },
    onError: () => {
      setError('')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password_01 !== password_02) {
      setError('')
      return
    }

    setError('hidden')

    if (token) {
      resetPasswordMutation.mutate({ token, password: password_01 })
    }
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-50'>
      <form onSubmit={handleSubmit} className='w-87.5 bg-white border border-gray-300 shadow-lg rounded-xl p-8 flex flex-col items-center gap-6'>

        <img src="/logo.svg" className='w-24 h-auto mb-2' alt="Logo" />

        <div className='w-full flex flex-col gap-5'>

          <div className='flex items-center gap-3 border-b border-gray-300 pb-2'>
            <img src="/password.svg" className='w-6 h-6' alt="Password Icon" />
            <input
              type="password"
              placeholder='New Password'
              className='flex-1 text-sm outline-none placeholder-gray-400'
              required
              value={password_01}
              onChange={(e) => setPassword_01(e.target.value)}
            />
          </div>

          <div className='flex items-center gap-3 border-b border-gray-300 pb-2'>
            <img src="/password.svg" className='w-6 h-6' alt="Confirm Password Icon" />
            <input
              type="password"
              placeholder='Confirm Password'
              className='flex-1 text-sm outline-none placeholder-gray-400'
              required
              value={password_02}
              onChange={(e) => setPassword_02(e.target.value)}
            />
          </div>

          <div className={`text-red-800 text-center ${error}`}>
            Passwords do not match or request failed
          </div>

          <button
            type="submit"
            className="w-full bg-lime-500 text-white font-medium py-2 rounded-lg hover:bg-lime-600 transition-colors flex justify-center items-center gap-2"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Reset Password"
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

export default ResetPassword