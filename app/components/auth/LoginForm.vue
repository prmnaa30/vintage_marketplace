<template>
  <UCard class="w-100 my-40 mx-auto">
    <template #default>
      <div class="mb-6 -mt-2">
        <h1>Login to Vintage</h1>
        <p class="text-sm mt-2">
          Enter your details below
        </p>
      </div>

      <UForm
        :schema="schema"
        :state="loginData"
        @submit="onSubmit"
      >
        <UFormField
          label="Email"
          name="email"
          class="mb-4"
        >
          <UInput
            v-model="loginData.email"
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
            v-model="loginData.password"
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
              @click="showPasswordToggle"
            />
          </UTooltip>
        </UFormField>

        <UButton
          type="submit"
          :label="authStore.isLoading ? 'Logging in...' : 'Continue'"
          class="w-full mt-2 cursor-pointer text-center"
          size="lg"
          :loading="authStore.isLoading"
          :disabled="authStore.isLoading"
        />
      </UForm>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const authStore = useAuthStore()
const toast = useToast()
const showPassword = ref(false)

const schema = z.object({
  email: z.email('Invalid Email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const loginData = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

const onSubmit = async (e: FormSubmitEvent<Schema>) => {
  try {
    await authStore.loginUser(e.data.email, e.data.password)
    toast.add({
      title: 'Success',
      description: 'Login successful',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Error',
      description: authStore.error || 'Login failed',
      color: 'error'
    })
  }
}

const showPasswordToggle = () => {
  showPassword.value = !showPassword.value
}
</script>
