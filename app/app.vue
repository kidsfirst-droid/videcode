<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const auth = useAuthStore()

onMounted(() => {
  auth.initAuth()
})
</script>
