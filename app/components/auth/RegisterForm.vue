<template>
  <UCard class="w-100 my-10 mx-auto">
    <template #default>
      <div class="mb-6 -mt-2">
        <h1>Sign up</h1>
        <p class="text-sm mt-2">
          Enter your details below
        </p>
      </div>

      <UForm
        :schema="schema"
        :state="registerData"
        @submit="onSubmit"
      >
        <UFormField
          label="Full name"
          name="fullname"
          class="mb-4"
        >
          <UInput
            v-model="registerData.fullname"
            class="w-full"
            :disabled="authStore.isLoading"
          />
        </UFormField>

        <UFormField
          label="Username"
          name="username"
          class="mb-4"
        >
          <UInput
            v-model="registerData.username"
            class="w-full"
            :disabled="authStore.isLoading"
          />
        </UFormField>

        <UFormField
          label="Email"
          name="email"
          class="mb-4"
        >
          <UInput
            v-model="registerData.email"
            class="w-full"
            :disabled="authStore.isLoading"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
          class="relative mt-2 mb-6"
        >
          <UInput
            v-model="registerData.password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full"
            :disabled="authStore.isLoading"
          />
          <UTooltip
            :delay-duration="250"
            :text="showPassword ? 'Hide Password' : 'Show Password'"
            :content="{
              align: 'center',
              side: 'top'
            }"
          >
            <UButton
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              variant="link"
              color="neutral"
              class="cursor-pointer absolute top-0 right-1"
              :disabled="authStore.isLoading"
              :tabindex="-1"
              @click="showPasswordToggle"
            />
          </UTooltip>
        </UFormField>

        <UFormField
          label="Confirm Password"
          name="confirmPassword"
          class="relative mt-2 mb-6"
        >
          <UInput
            v-model="registerData.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="w-full"
            :disabled="authStore.isLoading"
          />
          <UTooltip
            :delay-duration="250"
            :text="showConfirmPassword ? 'Hide Confirmation Password' : 'Show Confirmation Password'"
            :content="{
              align: 'center',
              side: 'top'
            }"
          >
            <UButton
              :icon="
                showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'
              "
              variant="link"
              color="neutral"
              class="cursor-pointer absolute top-0 right-1 text-center"
              :disabled="authStore.isLoading"
              :tabindex="-1"
              @click="showConfirmPasswordToggle"
            />
          </UTooltip>
        </UFormField>

        <UCheckbox v-model="isAgree" name="terms">
          <template #label>
            <span class="text-sm text-gray-600 dark:text-gray-300">
              By clicking sign up, I hereby agree and consent to
              <NuxtLink
                to="/terms"
                class="text-primary-500 hover:underline font-medium z-10 relative"
                @click.stop
              >Term & Conditions</NuxtLink>;
              I confirm that I have read
              <NuxtLink
                to="/privacy"
                class="text-primary-500 hover:underline font-medium z-10 relative"
                @click.stop
              >Privacy policy</NuxtLink>.
            </span>
          </template>
        </UCheckbox>

        <UButton
          type="submit"
          :label="authStore.isLoading ? 'Signing you up...' : 'Sign Up'"
          class="w-full mt-4 cursor-pointer text-center"
          size="lg"
          :loading="authStore.isLoading"
          loading-icon="i-lucide-loader"
          :disabled="authStore.isLoading || !isAgree"
          :ui="{
            base: 'w-full flex justify-center'
          }"
        />
      </UForm>
    </template>
  </UCard>

  <AuthModal :register-success="registerSuccess" />
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const authStore = useAuthStore()
const toast = useToast()
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isAgree = ref(false)
const registerSuccess = ref(false)

const schema = z.object({
  fullname: z.string('Fullname is required').min(1, 'Fullname is required'),
  username: z.string('Username is required').min(1, 'Username is required'),
  email: z.email('Invalid Email'),
  password: z.string('Password is required').min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string('Confirmation Password is required').min(8, 'Confirmation Password must be at least 8 characters')
})
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword']
  })

type Schema = z.output<typeof schema>

const registerData = reactive<Partial<Schema>>({
  email: '',
  password: '',
  fullname: '',
  username: '',
  confirmPassword: ''
})

const onSubmit = async (e: FormSubmitEvent<Schema>) => {
  try {
    await authStore.registerUser({
      email: e.data.email,
      password: e.data.password,
      fullname: e.data.fullname,
      username: e.data.username
    })

    toast.add({
      title: 'Success',
      description: 'Register success',
      color: 'success'
    })

    registerSuccess.value = true
  } catch (error) {
    console.error('Registration error:', error)
    toast.add({
      title: 'Error',
      description: authStore.error || 'Register failed',
      color: 'error'
    })
  } finally {
    registerSuccess.value = false
  }
}

const showPasswordToggle = () => {
  showPassword.value = !showPassword.value
}

const showConfirmPasswordToggle = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>
