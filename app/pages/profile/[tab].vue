<template>
  <UContainer class="py-8">
    <div class="flex gap-8">
      <!-- Sidebar dengan UTabs vertikal -->
      <div class="flex flex-col gap-4">
        <h1 class="font-bold text-2xl">
          Settings
        </h1>

        <UTabs
          v-model="activeTab"
          :items="tabItems"
          :orientation="'vertical'"
          variant="link"
          class="w-full"
          :ui="{
            indicator: 'hidden',
            list: 'border-0',
            trigger: 'my-2 cursor-pointer'
          }"
        />
      </div>

      <!-- Konten utama berdasarkan tab yang aktif -->
      <div class="flex-1">
        <UCard>
          <template #header>
            <h1 class="text-xl font-bold">
              {{ tabItems[activeTab]?.label }}
            </h1>
          </template>

          <!-- Profile Details Tab -->
          <ProfileDetails
            v-if="tabItems[activeTab]?.key === 'profile'"
            :user="profileStore.profile || {}"
          />

          <!-- Change Password Tab -->
          <ChangePassword v-else-if="tabItems[activeTab]?.key === 'password'" />

          <!-- Transaction History Tab -->
          <TransactionHistory v-else-if="tabItems[activeTab]?.key === 'history'" />
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import ProfileDetails from '~/components/profile/ProfileDetails.vue'
import ChangePassword from '~/components/profile/ChangePassword.vue'
import TransactionHistory from '~/components/profile/TransactionHistory.vue'

// definePageMeta({
//   middleware: ['auth']
// })

const route = useRoute()
const activeTab = ref(0)

const tabItems = [
  {
    key: 'profile',
    label: 'Profile Details',
    icon: 'i-lucide-user'
  },
  {
    key: 'password',
    label: 'Change Password',
    icon: 'i-lucide-lock'
  },
  {
    key: 'history',
    label: 'Transaction History',
    icon: 'i-lucide-history'
  }
]

const profileStore = useProfileStore()

// Determine SEO meta based on route
const setSeoMeta = () => {
  const tabParam = route.params.tab
  if (tabParam === 'transaction-history') {
    useSeoMeta({
      title: 'Transaction History - Profile - Vintage Marketplace',
      description: 'View your transaction history'
    })
  } else if (tabParam === 'change-password') {
    useSeoMeta({
      title: 'Change Password - Profile - Vintage Marketplace',
      description: 'Change your account password'
    })
  } else if (tabParam === 'profile-details') {
    useSeoMeta({
      title: 'Profile Details - Profile - Vintage Marketplace',
      description: 'Manage your profile details'
    })
  } else {
    useSeoMeta({
      title: 'Profile - Vintage Marketplace',
      description: 'Manage your profile, password and transaction history'
    })
  }
}

// Set active tab based on route parameter
const setActiveTabFromRoute = () => {
  const tabParam = route.params.tab
  let tabIndex

  if (tabParam === 'transaction-history') {
    tabIndex = tabItems.findIndex(item => item.key === 'history')
  } else if (tabParam === 'change-password') {
    tabIndex = tabItems.findIndex(item => item.key === 'password')
  } else if (tabParam === 'profile-details') {
    tabIndex = tabItems.findIndex(item => item.key === 'profile')
  } else {
    // Default to profile if invalid tab
    tabIndex = tabItems.findIndex(item => item.key === 'profile')
  }

  // Ensure tabIndex is valid before setting
  activeTab.value = tabIndex === -1 ? 0 : tabIndex
}

// Set initial SEO meta and active tab
setSeoMeta()
setActiveTabFromRoute()

// Ambil profile pengguna saat halaman dimuat
onMounted(async () => {
  try {
    await profileStore.fetchProfile()
    setActiveTabFromRoute()
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
})

// Watch for route changes to update tab and SEO meta
watch(() => route.params.tab, () => {
  setSeoMeta()
  setActiveTabFromRoute()
})
</script>
