import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { ApiError } from '../api/client'

function Signup() {

  const navigate = useNavigate()

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password_01, setPassword_01] = useState('')
  const [password_02, setPassword_02] = useState('')
  const [error_password, setError_password] = useState('hidden')
  const [error_email, setError_email] = useState('hidden')

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      navigate('/verification')
    },
    onError: (err: ApiError) => {
      if (err.status === 409) {
        setError_email('')
      }
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password_01 !== password_02) {
      setError_password('')
      return
    }
    setError_email('hidden')
    setError_password('hidden')

    signupMutation.mutate({
      firstname,
      lastname,
      email,
      password: password_01
    })
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-50'>
      <form onSubmit={handleSubmit} className='w-87.5 bg-white border border-gray-300 shadow-lg rounded-xl p-8 flex flex-col items-center gap-6'>

        <img src="/logo.svg" className='w-24 h-auto mb-2' alt="Logo" />

        <div className='w-full flex flex-col gap-5'>
          <div className='flex gap-4 w-full'>
            <div className='flex items-center gap-3 border-b border-gray-300 pb-2 flex-1 min-w-0'>
              <img src="/person.svg" className='w-6 h-6' alt="Name Icon" />
              <input
                type="text"
                placeholder='First Name'
                className='w-full text-sm outline-none placeholder-gray-400'
                required
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>

            <div className='flex items-center gap-3 border-b border-gray-300 pb-2 flex-1 min-w-0'>
              <img src="/person.svg" className='w-6 h-6' alt="Name Icon" />
              <input
                type="text"
                placeholder='Last Name'
                className='w-full text-sm outline-none placeholder-gray-400'
                required
                onChange={(e) => setLastname(e.target.value)}
                value={lastname}
              />
            </div>
          </div>

          <div className='flex items-center gap-3 border-b border-gray-300 pb-2'>
            <img src="/person.svg" className='w-6 h-6' alt="Email Icon" />
            <input
              type="email"
              placeholder='Email Address'
              className='flex-1 text-sm outline-none placeholder-gray-400'
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className='flex items-center gap-3 border-b border-gray-300 pb-2'>
            <img src="/password.svg" className='w-6 h-6' alt="Password Icon" />
            <input
              type="password"
              placeholder='Create Password'
              className='flex-1 text-sm outline-none placeholder-gray-400'
              required
              onChange={(e) => setPassword_01(e.target.value)}
              value={password_01}
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
              minLength={8}
            />
          </div>

          <Link
            to="/"
            className="text-sm text-lime-600 underline cursor-pointer text-center"
          >
            Already have an account? Login
          </Link>
          <div className={`text-red-800 text-center ${error_password}`}>Passwords Do Not Match !</div>
          <div className={`text-red-800 text-center ${error_email}`}>Email Already in Use !</div>

          <button
            type="submit"
            className="w-full bg-lime-500 text-white font-medium py-2 rounded-lg hover:bg-lime-600 transition-colors flex justify-center items-center gap-2"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign Up"
            )}
          </button>

        </div>
      </form>
    </div>
  )
}

export default Signup
