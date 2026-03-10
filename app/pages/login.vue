<template>
  <div class="w-full max-w-sm">
    <div class="card p-8">
      <div class="flex flex-col items-center mb-10">
        <div class="w-16 h-16 bg-pastel-green-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
          <GraduationCap class="w-10 h-10" />
        </div>
        <h1 class="text-3xl font-bold text-center">Welcome Back</h1>
        <p class="text-pastel-green-500 text-sm mt-2 text-center font-medium">Student Assessment System</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="label">Username</label>
          <input 
            v-model="username" 
            type="text" 
            class="input" 
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <label class="label">Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="input" 
            placeholder="••••••••"
            required
          />
        </div>

        <button 
          type="submit" 
          class="w-full btn btn-primary py-3 text-lg font-bold flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="mt-8 pt-8 border-t border-pastel-green-50 text-center">
        <p class="text-xs text-pastel-green-400 font-medium">Demo access: Any username/password</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { GraduationCap } from 'lucide-vue-next'

definePageMeta({
  layout: 'default'
})

const auth = useAuthStore()
const router = useRouter()

const username = ref('Admin')
const password = ref('password')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  auth.login(username.value)
  loading.value = false
  router.push('/')
}

onMounted(() => {
  if (auth.isLoggedIn) {
    router.push('/')
  }
})
</script>
