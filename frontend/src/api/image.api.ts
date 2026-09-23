import { apiClient } from './client';
import { ImageType } from '../types/api.types';

export const imageApi = {
  getImages: async (): Promise<ImageType[]> => {
    const res = await apiClient('/images/my-images');
    return res.json();
  },

  uploadImage: async (file: File): Promise<ImageType> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await apiClient('/images/upload', {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  deleteImage: async (id: string): Promise<void> => {
    await apiClient(`/images/${id}`, {
      method: 'DELETE'
    });
  }
};
