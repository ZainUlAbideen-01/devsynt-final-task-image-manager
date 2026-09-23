import React, { useState } from 'react'
import { Link } from 'react-router'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { ApiError } from '../api/client'

function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('hidden')
  const [verify_error, setVerify_error] = useState('hidden')

  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      navigate('/home')
    },
    onError: (err: ApiError) => {
      if (err.status === 401 || err.status === 404) {
        setError('')
      } else if (err.status === 403) {
        setVerify_error('')
      }
    }
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    setError('hidden')
    setVerify_error('hidden')
    
    loginMutation.mutate({ email, password })
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-50'>
      <form onSubmit={handleLogin}>
        <div className='w-87.5 bg-white border border-gray-300 shadow-lg rounded-xl p-8 flex flex-col items-center gap-6'>

          <img src="/logo.svg" className='w-24 h-auto mb-2' alt="Logo" />

          <div className='w-full flex flex-col gap-5'>

            <div className='flex items-center gap-3 border-b border-gray-300 pb-2'>
              <img src="/person.svg" className='w-6 h-6' alt="Email Icon" />
              <input
                type="text"
                placeholder='Enter Email Address'
                className='flex-1 text-sm outline-none placeholder-gray-400'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className='flex items-center gap-3 border-b border-gray-300 pb-2'>
              <img src="/password.svg" className='w-6 h-6' alt="Password Icon" />
              <input
                type="password"
                placeholder='Enter Password'
                className='flex-1 text-sm outline-none placeholder-gray-400'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Link
              to="/signup"
              className="text-sm text-lime-600 underline cursor-pointer text-center"
            >
              Sign up
            </Link>
            <Link
              to="/forgot-password"
              className="text-sm text-lime-600 underline cursor-pointer text-center"
            >
              Forgot Password ?
            </Link>

            <div className={`text-red-800 text-center ${error}`}>Invalid Credentials</div>
            <div className={`text-red-800 text-center ${verify_error}`}>Please verify your account before logging in</div>

            <button
              type="submit"
              className="w-full bg-lime-500 text-white font-medium py-2 rounded-lg hover:bg-lime-600 transition-colors flex justify-center items-center gap-2"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Log In"
              )}
            </button>

          </div>
        </div>
      </form>
    </div>
  )
}

export default Login
