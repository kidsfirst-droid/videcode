<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="student in studentStore.students" :key="student.id" class="card group hover:border-pastel-green-400 transition-all">
        <div class="flex items-start justify-between mb-6">
          <div class="w-12 h-12 rounded-2xl bg-pastel-green-100 flex items-center justify-center text-pastel-green-700 font-bold text-xl group-hover:bg-pastel-green-600 group-hover:text-white transition-colors">
            {{ student.name[0] }}
          </div>
          <div class="text-right">
            <span class="text-[10px] font-black uppercase tracking-widest text-pastel-green-400 block mb-1">Grade</span>
            <span class="px-2 py-1 rounded-lg bg-pastel-green-50 text-pastel-green-700 font-bold text-xs">{{ student.grade }}</span>
          </div>
        </div>
        
        <h3 class="text-lg font-bold text-pastel-green-950 mb-1">{{ student.name }}</h3>
        <p class="text-sm text-pastel-green-500 mb-6 flex items-center gap-1 italic">
          <TrendingUp class="w-3 h-3" /> Avg. Score: {{ getAvgScore(student.id) }}%
        </p>

        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-[10px] font-black uppercase text-pastel-green-400 mb-1">
              <span>Attendance</span>
              <span>{{ getAttendance(student) }}%</span>
            </div>
            <div class="h-1.5 w-full bg-pastel-green-50 rounded-full overflow-hidden">
              <div class="h-full bg-pastel-green-500" :style="{ width: `${getAttendance(student)}%` }"></div>
            </div>
          </div>
        </div>

        <NuxtLink :to="`/reports/${student.id}`" class="w-full btn btn-primary mt-8 flex items-center justify-center gap-2 py-2.5">
          <BarChart3 class="w-4 h-4" />
          Full Report
        </NuxtLink>
      </div>
    </div>

    <div v-if="studentStore.students.length === 0" class="card p-12 text-center">
      <Users class="w-16 h-16 mx-auto mb-4 text-pastel-green-100" />
      <h3 class="text-xl font-bold text-pastel-green-900">No Students Found</h3>
      <p class="text-pastel-green-500">Add students to start generating academic reports.</p>
    </div>
  </div>
</template>

<script setup>
import { BarChart3, TrendingUp, Users } from 'lucide-vue-next'

const studentStore = useStudentStore()
const assessmentStore = useAssessmentStore()

const getAvgScore = (studentId) => {
  const assessments = assessmentStore.assessments.filter(a => a.studentId === studentId)
  if (assessments.length === 0) return 0
  const total = assessments.reduce((acc, a) => acc + (a.score / a.totalScore), 0)
  return Math.round((total / assessments.length) * 100)
}

const getAttendance = (student) => {
  return Math.round(((student.totalDays - student.absent) / student.totalDays) * 100)
}
</script>
