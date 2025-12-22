interface CloudinaryUploadOptions {
  folder?: string
  uploadPreset?: string
  publicId?: string
  overwrite?: boolean
  resourceType?: 'image' | 'video' | 'raw'
}

export const useCloudinaryUpload = () => {
  const uploadImageDirectly = async (file: File, options: CloudinaryUploadOptions = {}) => {
    const folder = options.folder || 'profile_pictures'

    const formData = new FormData()
    formData.append('file', file)
    if (folder) {
      formData.append('folder', folder)
    }

    try {
      const result = await $fetch('/api/cloudinary-upload', {
        method: 'POST',
        body: formData
      })

      return result
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw error
    }
  }

  return {
    uploadImage: uploadImageDirectly
  }
}
