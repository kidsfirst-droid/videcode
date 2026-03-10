<template>
  <div v-if="student" class="space-y-8 pb-12">
    <!-- Header with Student Info -->
    <div class="flex items-end justify-between">
      <div class="flex items-center gap-6">
        <div class="w-24 h-24 rounded-3xl bg-pastel-green-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
          {{ student.name[0] }}
        </div>
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-4xl font-bold tracking-tight text-pastel-green-950">{{ student.name }}</h1>
            <span class="px-3 py-1 rounded-full bg-pastel-green-100 text-pastel-green-700 text-sm font-bold">{{ student.grade }}</span>
          </div>
          <p class="text-pastel-green-500 font-medium flex items-center gap-2">
            <Mail class="w-4 h-4" /> {{ student.email }}
          </p>
        </div>
      </div>
      <button @click="printReport" class="btn btn-outline flex items-center gap-2">
        <Printer class="w-4 h-4" />
        Print Report
      </button>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card bg-white border border-pastel-green-100">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-10 h-10 rounded-xl bg-pastel-green-100 flex items-center justify-center text-pastel-green-600">
            <TrendingUp class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-pastel-green-800 uppercase tracking-widest text-xs">Average Score</h3>
        </div>
        <p class="text-4xl font-bold text-pastel-green-950">{{ avgScore }}%</p>
        <p class="text-sm text-pastel-green-500 mt-2 font-medium">Based on {{ studentAssessments.length }} assessments</p>
      </div>

      <div class="card bg-white border border-pastel-green-100">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Calendar class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-pastel-green-800 uppercase tracking-widest text-xs">Attendance</h3>
        </div>
        <p class="text-4xl font-bold text-pastel-green-950">{{ attendancePercent }}%</p>
        <p class="text-sm text-pastel-green-500 mt-2 font-medium">{{ student.absent }} days absent this term</p>
      </div>

      <div class="card bg-pastel-green-600 text-white border-none shadow-lg">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <Star class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-pastel-green-50 uppercase tracking-widest text-xs">Standing</h3>
        </div>
        <p class="text-4xl font-bold">{{ academicStanding }}</p>
        <p class="text-sm text-pastel-green-100 mt-2 font-medium capitalize">Overall Performance</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Subjects Performance -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card">
          <h3 class="text-xl font-bold mb-6">Subject Breakdown</h3>
          <div class="space-y-6">
            <div v-for="subject in subjectStats" :key="subject.name">
              <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-pastel-green-800">{{ subject.name }}</span>
                <span class="text-sm font-bold" :class="scoreColor(subject.avg)">{{ subject.avg }}%</span>
              </div>
              <div class="w-full h-3 bg-pastel-green-50 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-pastel-green-500 transition-all duration-1000" 
                  :style="{ width: `${subject.avg}%` }"
                ></div>
              </div>
            </div>
            <div v-if="subjectStats.length === 0" class="py-8 text-center text-pastel-green-400">
              No assessment data available for subjects.
            </div>
          </div>
        </div>

        <!-- Assessment History -->
        <div class="card">
          <h3 class="text-xl font-bold mb-6">Assessment History</h3>
          <div class="space-y-4">
            <div v-for="a in sortedAssessments" :key="a.id" class="p-4 rounded-2xl border border-pastel-green-50 bg-pastel-green-50/20">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h4 class="font-bold text-pastel-green-900">{{ a.subject }}</h4>
                  <p class="text-xs text-pastel-green-400 font-bold uppercase">{{ formatDate(a.date) }}</p>
                </div>
                <div class="text-right">
                  <span class="text-lg font-black" :class="scoreColor((a.score/a.totalScore)*100)">{{ a.score }}/{{ a.totalScore }}</span>
                </div>
              </div>
              <p class="text-sm text-pastel-green-600 bg-white p-3 rounded-xl border border-pastel-green-50 mt-3 italic" v-if="a.feedback">
                "{{ a.feedback }}"
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Items & Recommendations -->
      <div class="space-y-6">
        <div class="card bg-amber-50 border-amber-100">
          <h3 class="font-bold text-amber-900 mb-4 flex items-center gap-2">
            <AlertCircle class="w-5 h-5" /> Recommendations
          </h3>
          <ul class="space-y-3">
            <li v-for="(rec, i) in recommendations" :key="i" class="flex gap-2 text-sm text-amber-800 font-medium">
              <span class="text-amber-400">•</span> {{ rec }}
            </li>
          </ul>
        </div>

        <div class="card">
          <h3 class="font-bold mb-4">Teacher Comments</h3>
          <div class="space-y-4">
            <div class="p-4 bg-pastel-green-50/50 rounded-xl border-l-4 border-pastel-green-500">
              <p class="text-sm text-pastel-green-700 italic">"{{ student.name }} has shown consistent improvement this term, particularly in mathematics where their logical reasoning skills are developing well."</p>
              <p class="text-xs font-bold text-pastel-green-400 mt-2">— Principal Sanders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center animate-pulse">
      <GraduationCap class="w-16 h-16 text-pastel-green-200 mx-auto mb-4" />
      <p class="text-pastel-green-400 font-bold">Loading student profile...</p>
    </div>
  </div>
</template>

<script setup>
import { 
  Graduate, 
  Mail, 
  Printer, 
  TrendingUp, 
  Calendar, 
  Star, 
  GraduationCap,
  AlertCircle 
} from 'lucide-vue-next'

const route = useRoute()
const studentStore = useStudentStore()
const assessmentStore = useAssessmentStore()

const student = computed(() => studentStore.students.find(s => s.id === route.params.id))

const studentAssessments = computed(() => {
  return assessmentStore.assessments.filter(a => a.studentId === route.params.id)
})

const sortedAssessments = computed(() => {
  return [...studentAssessments.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const avgScore = computed(() => {
  if (studentAssessments.value.length === 0) return 0
  const total = studentAssessments.value.reduce((acc, a) => acc + (a.score / a.totalScore), 0)
  return Math.round((total / studentAssessments.value.length) * 100)
})

const attendancePercent = computed(() => {
  if (!student.value) return 0
  return Math.round(((student.value.totalDays - student.value.absent) / student.value.totalDays) * 100)
})

const academicStanding = computed(() => {
  if (avgScore.value >= 90) return 'Distinction'
  if (avgScore.value >= 80) return 'Excellent'
  if (avgScore.value >= 70) return 'Good'
  if (avgScore.value >= 50) return 'Satisfactory'
  return 'Need Support'
})

const subjectStats = computed(() => {
  const subjects = {}
  studentAssessments.value.forEach(a => {
    if (!subjects[a.subject]) subjects[a.subject] = []
    subjects[a.subject].push(a.score / a.totalScore)
  })
  
  return Object.keys(subjects).map(name => ({
    name,
    avg: Math.round((subjects[name].reduce((a, b) => a + b, 0) / subjects[name].length) * 100)
  }))
})

const recommendations = computed(() => {
  const recs = []
  if (attendancePercent.value < 95) recs.push('Improve daily attendance to ensure no core concepts are missed.')
  if (avgScore.value < 80) recs.push('Schedule extra tutoring sessions for subjects below 80%.')
  if (studentAssessments.value.length < 3) recs.push('Take more practice assessments to build confidence.')
  if (recs.length === 0) recs.push('Continue maintaining the excellent academic record.', 'Participate in peer-mentoring programs.')
  return recs
})

const formatDate = (dateStr) => {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(dateStr))
}

const scoreColor = (percent) => {
  if (percent >= 80) return 'text-pastel-green-700'
  if (percent >= 60) return 'text-amber-600'
  return 'text-rose-600'
}

const printReport = () => {
  window.print()
}
</script>

<style scoped>
@media print {
  .btn, aside, header {
    display: none !important;
  }
  .card {
    border: 1px solid #dcfce7 !important;
    box-shadow: none !important;
  }
  main {
    margin-left: 0 !important;
  }
}
</style>
