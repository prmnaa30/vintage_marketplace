import { z } from 'zod'

export const imageSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      return validTypes.includes(file.type)
    },
    {
      message: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
    }
  ).refine(
    (file) => {
      const maxSize = 2 * 1024 * 1024 // 2MB
      return file.size <= maxSize
    },
    {
      message: 'File size too large. Maximum size is 2MB.'
    }
  ).refine(
    async (file) => {
      return new Promise<boolean>((resolve) => {
        const img = new Image()
        img.onload = () => {
          const isValidDimension = img.width >= 200 && img.height >= 200 && img.width <= 4096 && img.height <= 4096
          resolve(isValidDimension)
        }
        img.onerror = () => resolve(false)
        img.src = URL.createObjectURL(file)
      })
    },
    {
      message: 'Image dimensions are invalid. Please upload an image between 200x200 and 4096x4096 pixels.'
    }
  )
})

export type ImageValidationData = z.infer<typeof imageSchema>

// Fungsi untuk memvalidasi file gambar
export const validateImage = async (file: File) => {
  try {
    const validatedData = await imageSchema.parseAsync({ file })
    return { success: true, data: validatedData, error: null }
  } catch (error) {
    const zodError = error as z.ZodError
    return {
      success: false,
      data: null,
      error: zodError.issues.map(issue => issue.message).join(', ')
    }
  }
}
