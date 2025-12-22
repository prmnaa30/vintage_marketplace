<template>
  <UCard>
    <form @submit.prevent="updateProfile">
      <div class="w-full flex flex-col gap-4">
        <UFormField
          label="Profile Picture"
          description="JPG, JPEG or PNG. 1MB Max."
          name="photoURL"
        >
          <UFileUpload
            v-slot="{ open, removeFile }"
            v-model="selectedFile"
            accept="image/*"
            :max-size="2 * 1024 * 1024"
            @input="handleFileChange"
          >
            <div class="flex flex-wrap items-center gap-3">
              <UAvatar
                :src="previewUrl || profileStore.profile?.photoUrl || undefined"
                size="lg"
                class="w-12 h-12"
                icon="i-lucide-image"
              />

              <UButton
                :label="selectedFile ? 'Change image' : 'Upload image'"
                color="neutral"
                variant="outline"
                @click="open()"
              />
            </div>

            <p
              v-if="selectedFile"
              class="text-xs text-muted mt-1.5"
            >
              {{ selectedFile.name }}

              <UButton
                label="Remove"
                color="error"
                variant="link"
                size="xs"
                class="p-0"
                @click="removeFile()"
              />
            </p>
          </UFileUpload>
        </UFormField>

        <UFormField
          label="Full Name"
          name="fullName"
          required
        >
          <UInput
            v-model="form.fullName"
            placeholder="Enter your full name"
            class="w-full"
            :disabled="isSubmitting"
          />
        </UFormField>

        <UFormField
          label="Username"
          name="username"
          required
        >
          <UInput
            v-model="form.username"
            placeholder="Enter your username"
            class="w-full"
            :disabled="isSubmitting"
          />
        </UFormField>

        <UFormField
          label="Email"
          name="email"
          required
        >
          <UInput
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            class="w-full"
            :disabled="isSubmitting"
          />
        </UFormField>
      </div>

      <div class="mt-6 flex justify-end">
        <UButton
          type="submit"
          :loading="isSubmitting"
          :disabled="(!hasChanges && !selectedFile) || !!imageValidationError"
        >
          Update Profile
        </UButton>
      </div>
    </form>
  </UCard>
</template>

<script setup lang="ts">
import { validateImage } from '~/composables/useImageValidation'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'

const profileStore = useProfileStore()
const toast = useToast()

const isSubmitting = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = computed(() => {
  if (selectedFile.value) {
    return URL.createObjectURL(selectedFile.value)
  }
  return null
})
const imageValidationError = ref<string | null>(null)

const form = reactive({
  photoUrl: profileStore.profile?.photoUrl || '',
  fullName: profileStore.profile?.fullName || '',
  username: profileStore.profile?.username || '',
  email: profileStore.profile?.email || '',
  phone: profileStore.profile?.phone || ''
})

watch(() => profileStore.profile, (newProfile) => {
  if (newProfile) {
    form.photoUrl = newProfile.photoUrl || ''
    form.fullName = newProfile.fullName || ''
    form.username = newProfile.username || ''
    form.email = newProfile.email || ''
    form.phone = newProfile.phone || ''
  }
}, { immediate: true })

const hasChanges = computed(() => {
  return form.photoUrl !== (profileStore.profile?.photoUrl || '')
    || form.fullName !== (profileStore.profile?.fullName || '')
    || form.username !== (profileStore.profile?.username || '')
    || form.email !== (profileStore.profile?.email || '')
    || form.phone !== (profileStore.profile?.phone || '')
})

const handleFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const validationResult = await validateImage(file)
    if (!validationResult.success) {
      let enhancedErrorMessage = validationResult.error as string
      if (validationResult.error?.includes('File size too large')) {
        enhancedErrorMessage = `File size too large. Maximum size is ${formatFileSize(2 * 1024 * 1024)}. You uploaded ${formatFileSize(file.size)}.`
      }

      imageValidationError.value = enhancedErrorMessage
      toast.add({
        title: 'Error',
        description: enhancedErrorMessage,
        color: 'error'
      })
      selectedFile.value = null
      return
    }

    imageValidationError.value = null
    selectedFile.value = file
  } else {
    selectedFile.value = null
    imageValidationError.value = null
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const updateProfile = async () => {
  isSubmitting.value = true

  try {
    const profileUpdates: Partial<UserProfile> = {
      fullName: form.fullName,
      username: form.username,
      email: form.email,
      phone: form.phone
    }

    if (selectedFile.value) {
      const { uploadImage } = useCloudinaryUpload()
      const result = await uploadImage(selectedFile.value)
      profileUpdates.photoUrl = result.secure_url
    }

    await profileStore.updateProfile(profileUpdates)

    toast.add({
      title: 'Success',
      description: 'Profile updated successfully',
      color: 'success'
    })

    selectedFile.value = null
  } catch (error) {
    console.error('Update profile error:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to update profile. Please try again.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
