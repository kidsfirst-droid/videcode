export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  
  if (!auth.isLoggedIn && to.path !== '/login') {
    return navigateTo('/login')
  }
})
