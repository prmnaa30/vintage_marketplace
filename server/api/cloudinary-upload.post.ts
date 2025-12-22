export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cloudName = config.public.cloudinaryCloudName
  const apiKey = config.cloudinaryApiKey

  try {
    const formData = await readMultipartFormData(event)
    const file = formData?.find(part => part.name === 'file')

    if (!file) {
      throw createError({ statusCode: 400, message: 'No file uploaded' })
    }

    const timestamp = Date.now()
    const folder = event.context.params?.folder || 'uploads'

    const params = {
      api_key: apiKey,
      timestamp: timestamp,
      folder: folder,
      resource_type: 'image'
    }

    const formDataUpload = new FormData()
    Object.entries(params).forEach(([key, value]) => {
      formDataUpload.append(key, String(value))
    })
    const fileBuffer = Buffer.from(file.data)
    formDataUpload.append('file', new Blob([fileBuffer]), file.filename)

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formDataUpload
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw createError({
        statusCode: response.status,
        message: errorData.message || 'Upload failed'
      })
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Server-side Cloudinary upload error:', error)
    throw error
  }
})
