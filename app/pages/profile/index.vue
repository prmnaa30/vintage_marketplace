<script setup lang="ts">
const router = useRouter()

// Redirect to profile-details by default
onMounted(async () => {
  await router.replace('/profile/profile-details')
})
</script>
