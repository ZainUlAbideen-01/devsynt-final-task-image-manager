import React from 'react'
import { Navigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'

function ProtectedRoute({ children }: { children: React.ReactNode }) {

    const { isLoading, isError, data } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: authApi.checkAuth,
        retry: false
    })

    if(isLoading) {
        return <div>Loading ...</div>
    }
    
    if(isError || !data) {
        return <Navigate to={'/'} replace/>
    }
    
    return children
}

export default ProtectedRoute