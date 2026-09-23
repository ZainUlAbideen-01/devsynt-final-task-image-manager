import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { imageApi } from '../api/image.api'
import { authApi } from '../api/auth.api'
import { ImageType } from '../types/api.types'

function Home() {

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | undefined>()
  const [error, setError] = useState('')

  const { data: images = [], isFetching: refreshing, refetch: fetchImages } = useQuery<ImageType[]>({
    queryKey: ['images'],
    queryFn: imageApi.getImages,
  })

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear()
      navigate('/')
    },
    onError: () => {
      console.log('Logout failure')
    }
  })

  const uploadMutation = useMutation({
    mutationFn: imageApi.uploadImage,
    onSuccess: (newImage) => {
      queryClient.setQueryData<ImageType[]>(['images'], (oldData) => {
        return [newImage, ...(oldData || [])]
      })
      setFile(undefined)
    },
    onError: (err) => {
      console.log("Error while uploading", err)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: imageApi.deleteImage,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ImageType[]>(['images'], (oldData) => {
        return oldData?.filter((img) => img._id !== deletedId && img.public_id !== deletedId) || []
      })
    },
    onError: (err) => {
      console.error("Delete failed:", err);
      alert("Could not delete the image. Try again.");
    }
  })

  const logout = () => {
    logoutMutation.mutate()
  }

  const upload = () => {
    if (!file) {
      setError('Please Select An Image !')
      return
    }
    setError('')
    uploadMutation.mutate(file)
  }

  const deleteImage = (id: string) => {
    deleteMutation.mutate(id)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8 gap-8">

      <div className="w-full max-w-3xl bg-white border border-gray-300 shadow-lg rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" className="w-10 h-auto" alt="Logo" />
          <h1 className="text-lg font-semibold text-gray-700">
            Image Dashboard
          </h1>
        </div>

        <button className="text-sm text-red-600 underline cursor-pointer" onClick={logout}>
          <img src="/logout.svg" alt="" className='w-7' />
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white border border-gray-300 shadow-lg rounded-xl p-6 sm:p-8 flex flex-col gap-6">

        <div className="flex justify-between items-center">
          <h2 className="text-base font-medium text-gray-700">
            Your Images
          </h2>

          <button
            onClick={() => fetchImages()}
            disabled={refreshing}
            className="text-sm text-lime-600 hover:text-lime-700 flex items-center gap-2 disabled:opacity-50"
          >
            {refreshing ? (
              <div className="w-4 h-4 border-2 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <img src="/refresh.svg" alt="Refresh" className="w-5 h-5" />
            )}
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-gray-300 pb-2">
          <img src="/image.svg" className="w-6 h-6" alt="Image Icon" />
          <input
            type="file"
            accept="image/*"
            className="flex-1 text-sm text-gray-500 outline-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
            required
          />
        </div>
        <div className={`text-red-800 text-center ${error ? '' : 'hidden'}`}>{error}</div>
        <button 
          className="w-full bg-lime-500 text-white font-medium py-2 rounded-lg hover:bg-lime-600 transition-colors flex justify-center items-center gap-2" 
          onClick={upload}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Upload to Cloudinary"
          )}
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white border border-gray-300 shadow-lg rounded-xl p-6 sm:p-8 flex flex-col gap-6">

        <h2 className="text-base font-medium text-gray-700 text-center">
          Your Images
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.length > 0 ? (
            images.map(image => (
              <div
                key={image._id || image.public_id || image.url}
                className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <div className="relative w-full h-40 rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-lg scale-105"
                    style={{ backgroundImage: `url(${image.url})` }}
                  ></div>

                  <img
                    src={image.url}
                    alt="Uploaded"
                    className="relative w-full h-full object-contain"
                  />
                </div>
                <div className="p-3 flex justify-between items-center">
                  <button className="text-sm text-lime-600 cursor-pointer underline">
                    <img src="/view.svg" className='w-7' alt="" />
                  </button>
                  <button className="text-sm text-red-600 underline cursor-pointer" onClick={() => deleteImage(image._id)} disabled={deleteMutation.isPending && deleteMutation.variables === image._id}>
                    {deleteMutation.isPending && deleteMutation.variables === image._id ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <img src="/delete.svg" className='w-6' alt="" />
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-700">
              {refreshing ? 'Loading images...' : 'Upload some images first :D'}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Home