<template>
  <div class="space-y-8">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="card flex items-center gap-4">
        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm', stat.color]">
          <component :is="stat.icon" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-xs font-bold text-pastel-green-500 uppercase tracking-wider">{{ stat.label }}</p>
          <p class="text-2xl font-bold">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Assessments -->
      <div class="card overflow-hidden">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold">Recent Assessments</h3>
          <NuxtLink to="/assessments" class="text-sm font-bold text-pastel-green-600 hover:text-pastel-green-700 underline underline-offset-4 decoration-2">View All</NuxtLink>
        </div>
        
        <div class="space-y-4">
          <div v-for="assessment in recentAssessments" :key="assessment.id" class="flex items-center gap-4 p-4 rounded-xl border border-pastel-green-50 hover:bg-pastel-green-50/50 transition-colors">
            <div class="w-10 h-10 rounded-full bg-pastel-green-100 flex items-center justify-center text-pastel-green-700 font-bold">
              {{ assessment.subject[0] }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-pastel-green-900 truncate">{{ studentName(assessment.studentId) }}</p>
              <p class="text-xs text-pastel-green-500 font-medium">{{ assessment.subject }} • {{ formatDate(assessment.date) }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold" :class="scoreColor(assessment.score, assessment.totalScore)">
                {{ assessment.score }}/{{ assessment.totalScore }}
              </p>
              <p class="text-[10px] font-bold text-pastel-green-400 uppercase tracking-tight">Score</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card bg-pastel-green-600 text-white border-none shadow-xl flex flex-col justify-between">
        <div>
          <h3 class="text-2xl font-bold mb-4">Quick Actions</h3>
          <p class="text-pastel-green-100 mb-8 max-w-xs">Easily manage your students and their academic progress with our collection of shortcuts.</p>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink to="/students" class="bg-white/10 backdrop-blur-md rounded-2xl p-4 hover:bg-white/20 transition-all group flex flex-col gap-3">
            <Users class="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span class="font-bold">Add Student</span>
          </NuxtLink>
          <NuxtLink to="/assessments" class="bg-white/10 backdrop-blur-md rounded-2xl p-4 hover:bg-white/20 transition-all group flex flex-col gap-3">
            <ClipboardPlus class="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span class="font-bold">New Assessment</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Users, 
  GraduationCap, 
  ClipboardCheck, 
  TrendingUp,
  ClipboardPlus
} from 'lucide-vue-next'

const studentStore = useStudentStore()
const assessmentStore = useAssessmentStore()

const stats = computed(() => [
  { label: 'Total Students', value: studentStore.students.length, icon: Users, color: 'bg-pastel-green-500' },
  { label: 'Total Assessments', value: assessmentStore.assessments.length, icon: ClipboardCheck, color: 'bg-emerald-500' },
  { label: 'Avg. Score (%)', value: avgScore.value + '%', icon: TrendingUp, color: 'bg-green-600' },
  { label: 'Classes', value: '3', icon: GraduationCap, color: 'bg-teal-600' },
])

const avgScore = computed(() => {
  if (assessmentStore.assessments.length === 0) return 0
  const total = assessmentStore.assessments.reduce((acc, a) => acc + (a.score / a.totalScore), 0)
  return Math.round((total / assessmentStore.assessments.length) * 100)
})

const recentAssessments = computed(() => {
  return [...assessmentStore.assessments].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4)
})

const studentName = (id) => studentStore.students.find(s => s.id === id)?.name || 'Unknown'

const formatDate = (dateStr) => {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(dateStr))
}

const scoreColor = (score, total) => {
  const percent = (score / total) * 100
  if (percent >= 80) return 'text-pastel-green-700'
  if (percent >= 60) return 'text-amber-600'
  return 'text-rose-600'
}
</script>
