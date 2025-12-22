<template>
  <UCard>
    <UForm
      :schema="schema"
      :state="form"
      @submit="changePassword"
    >
      <div class="grid grid-cols-1 gap-4">
        <UFormField
          label="Current Password"
          name="currentPassword"
          class="relative"
        >
          <UInput
            v-model="form.currentPassword"
            :type="showCurrentPassword ? 'text' : 'password'"
            placeholder="Enter your current password"
            :disabled="isSubmitting"
            class="w-full"
          />
          <UTooltip
            :delay-duration="250"
            :text="showCurrentPassword ? 'Hide Password' : 'Show Password'"
            :content="{
              align: 'center',
              side: 'top'
            }"
          >
            <UButton
              :icon="showCurrentPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              variant="link"
              color="neutral"
              class="cursor-pointer absolute top-0 right-1"
              :disabled="isSubmitting"
              @click="toggleCurrentPasswordVisibility"
            />
          </UTooltip>
        </UFormField>

        <UFormField
          label="New Password"
          name="newPassword"
          class="relative"
        >
          <UInput
            v-model="form.newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            placeholder="Enter your new password"
            :disabled="isSubmitting"
            class="w-full"
          />
          <UTooltip
            :delay-duration="250"
            :text="showNewPassword ? 'Hide Password' : 'Show Password'"
            :content="{
              align: 'center',
              side: 'top'
            }"
          >
            <UButton
              :icon="showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              variant="link"
              color="neutral"
              class="cursor-pointer absolute top-0 right-1"
              :disabled="isSubmitting"
              @click="toggleNewPasswordVisibility"
            />
          </UTooltip>
        </UFormField>

        <UFormField
          label="Confirm New Password"
          name="confirmNewPassword"
          class="relative"
        >
          <UInput
            v-model="form.confirmNewPassword"
            :type="showConfirmNewPassword ? 'text' : 'password'"
            placeholder="Confirm your new password"
            :disabled="isSubmitting"
            class="w-full"
          />
          <UTooltip
            :delay-duration="250"
            :text="showConfirmNewPassword ? 'Hide Password' : 'Show Password'"
            :content="{
              align: 'center',
              side: 'top'
            }"
          >
            <UButton
              :icon="showConfirmNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              variant="link"
              color="neutral"
              class="cursor-pointer absolute top-0 right-1"
              :disabled="isSubmitting"
              @click="toggleConfirmNewPasswordVisibility"
            />
          </UTooltip>
        </UFormField>
      </div>

      <div class="mt-6 flex justify-end">
        <UButton
          type="submit"
          :loading="isSubmitting"
        >
          Change Password
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const authStore = useAuthStore()
const toast = useToast()

const isSubmitting = ref(false)

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmNewPassword = ref(false)

const schema = z.object({
  currentPassword: z.string('Current password is required').min(6, 'Password must be at least 6 characters'),
  newPassword: z.string('New password is required').min(6, 'Password must be at least 6 characters'),
  confirmNewPassword: z.string('Confirmation password is required').min(6, 'Password must be at least 6 characters')
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword']
})

type Schema = z.output<typeof schema>

const form = reactive<Partial<Schema>>({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

const toggleCurrentPasswordVisibility = () => {
  showCurrentPassword.value = !showCurrentPassword.value
}

const toggleNewPasswordVisibility = () => {
  showNewPassword.value = !showNewPassword.value
}

const toggleConfirmNewPasswordVisibility = () => {
  showConfirmNewPassword.value = !showConfirmNewPassword.value
}

const changePassword = async (e: FormSubmitEvent<Schema>) => {
  isSubmitting.value = true

  try {
    // Panggil fungsi change password dari auth store
    await authStore.changePassword(e.data.currentPassword!, e.data.newPassword!)

    // Reset form
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmNewPassword = ''

    toast.add({
      title: 'Success',
      description: 'Password changed successfully',
      color: 'success'
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Change password error:', error)

    let errorMessage = 'Failed to change password. Please try again.'
    if (error.code === 'auth/wrong-password') {
      errorMessage = 'Current password is incorrect'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'New password is too weak'
    }

    toast.add({
      title: 'Error',
      description: errorMessage,
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
