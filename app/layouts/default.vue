<template>
  <div class="min-h-screen flex bg-pastel-green-50">
    <!-- Sidebar -->
    <aside v-if="auth.isLoggedIn" class="w-64 bg-white border-r border-pastel-green-100 flex flex-col fixed h-full z-20">
      <div class="p-6">
        <div class="flex items-center gap-2 text-pastel-green-700 mb-8">
          <div class="w-8 h-8 bg-pastel-green-600 rounded-lg flex items-center justify-center text-white">
            <GraduationCap class="w-5 h-5" />
          </div>
          <span class="font-bold text-lg tracking-tight">AssessMe</span>
        </div>

        <nav class="space-y-2">
          <NuxtLink 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
            :class="[route.path === item.path ? 'bg-pastel-green-600 text-white shadow-md' : 'text-pastel-green-600 hover:bg-pastel-green-50']"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="font-medium">{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </div>

      <div class="mt-auto p-6 border-t border-pastel-green-50">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-pastel-green-200 flex items-center justify-center text-pastel-green-700 font-bold">
            {{ auth.user?.name?.[0] || 'A' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-pastel-green-900 truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-pastel-green-500 truncate">{{ auth.user?.role }}</p>
          </div>
        </div>
        <button @click="auth.logout()" class="w-full btn btn-outline flex items-center justify-center gap-2 text-sm">
          <LogOut class="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main :class="['flex-1 transition-all duration-300', auth.isLoggedIn ? 'ml-64' : '']">
      <header v-if="auth.isLoggedIn" class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pastel-green-100 px-8 py-4 flex items-center justify-between">
        <h2 class="text-xl font-bold">{{ currentPageTitle }}</h2>
        <div class="flex items-center gap-4">
          <button class="p-2 rounded-full hover:bg-pastel-green-50 text-pastel-green-600">
            <Bell class="w-5 h-5" />
          </button>
          <div class="h-8 w-[1px] bg-pastel-green-100"></div>
          <span class="text-sm font-medium text-pastel-green-600">{{ today }}</span>
        </div>
      </header>
      
      <div :class="['p-8', !auth.isLoggedIn ? 'min-h-screen flex items-center justify-center' : '']">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  BarChart3, 
  LogOut, 
  GraduationCap,
  Bell
} from 'lucide-vue-next'

const auth = useAuthStore()
const route = useRoute()

const menuItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Students', path: '/students', icon: Users },
  { label: 'Assessments', path: '/assessments', icon: ClipboardCheck },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
]

const currentPageTitle = computed(() => {
  const item = menuItems.find(m => m.path === route.path)
  if (item) return item.label
  if (route.path.startsWith('/reports/')) return 'Student Report'
  return ''
})

const today = computed(() => {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date())
})
</script>

<style scoped>
.router-link-active {
  @apply bg-pastel-green-600 text-white shadow-md;
}
</style>
