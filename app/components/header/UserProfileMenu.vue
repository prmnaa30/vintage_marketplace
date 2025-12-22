<template>
  <UDropdownMenu :items="items">
    <UButton
      variant="link"
      trailing-icon="i-lucide-chevron-down"
      class="cursor-pointer"
    >
      <UTooltip
        :delay-duration="150"
        :text="displayName"
      >
        <UAvatar :src="avatarSrc" />
      </UTooltip>
    </UButton>
  </UDropdownMenu>

  <UModal
    v-model:open="isModalOpen"
    title="Logout"
    description="Are you sure want to logout from Vintage?"
  >
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          label="Close"
          variant="outline"
          color="neutral"
          @click="modalClose"
        />
        <UButton
          label="Logout"
          variant="solid"
          color="error"
          @click="logout"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const authStore = useAuthStore()
const user = useCurrentUser()

const avatarSrc = computed(() => user.value?.photoURL || '')
const displayName = computed(() => user.value?.displayName || '')
const isModalOpen = ref(false)

const logout = () => {
  authStore.logoutUser()
}

const modalClose = () => {
  isModalOpen.value = false
}

const items: DropdownMenuItem[][] = [
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      href: '/profile/profile-details'
    },
    {
      label: 'Order',
      icon: 'i-lucide-receipt-text',
      href: '/profile/transaction-history'
    },
    {
      type: 'separator'
    },
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      color: 'error',
      onSelect: () => {
        isModalOpen.value = true
      }
    }
  ]
]
</script>
