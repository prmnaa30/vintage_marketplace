interface CloudinaryUploadOptions {
  folder?: string
  uploadPreset?: string
  publicId?: string
  overwrite?: boolean
  resourceType?: 'image' | 'video' | 'raw'
}

export const useCloudinaryUpload = () => {
  const config = useRuntimeConfig()

  const uploadImageDirectly = async (file: File, options: CloudinaryUploadOptions = {}) => {
    const cloudName = config.public.cloudinaryCloudName
    const apiKey = config.public.cloudinaryApiKey

    const timestamp = Date.now()
    const folder = options.folder || 'profile_pictures'

    // Prepare upload parameters
    const params = {
      api_key: apiKey,
      timestamp: timestamp,
      folder: folder,
      public_id: options.publicId || `${Date.now()}_${file.name.replace(/\.[^/.]+$/, '')}`,
      resource_type: options.resourceType || 'image',
      upload_preset: 'vintage-app'
    }

    // Generate signature if we had a secret (for server-side signing)
    // For client-side, we'll use unsigned upload with upload preset

    const formData = new FormData()
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    formData.append('file', file)

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw error
    }
  }

  return {
    uploadImage: uploadImageDirectly // Using the direct method with API key
  }
}
