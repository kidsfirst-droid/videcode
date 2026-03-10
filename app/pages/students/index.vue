<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="relative w-72">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pastel-green-400" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search students..." 
          class="input pl-10 py-2 text-sm"
        />
      </div>
      <button @click="openModal()" class="btn btn-primary flex items-center gap-2">
        <Plus class="w-4 h-4" />
        Add Student
      </button>
    </div>

    <!-- Students Table -->
    <div class="card overflow-hidden !p-0">
      <table class="w-full text-left border-collapse">
        <thead class="bg-pastel-green-50 border-b border-pastel-green-100">
          <tr>
            <th class="px-6 py-4 text-xs font-bold text-pastel-green-600 uppercase tracking-wider">Name</th>
            <th class="px-6 py-4 text-xs font-bold text-pastel-green-600 uppercase tracking-wider">Grade</th>
            <th class="px-6 py-4 text-xs font-bold text-pastel-green-600 uppercase tracking-wider">Email</th>
            <th class="px-6 py-4 text-xs font-bold text-pastel-green-600 uppercase tracking-wider">Attendance</th>
            <th class="px-6 py-4 text-xs font-bold text-pastel-green-600 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-pastel-green-50">
          <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-pastel-green-50/30 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-pastel-green-100 flex items-center justify-center text-pastel-green-700 font-bold text-xs">
                  {{ student.name[0] }}
                </div>
                <span class="font-bold text-pastel-green-900">{{ student.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded-md bg-pastel-green-100 text-pastel-green-700 text-xs font-bold">{{ student.grade }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-pastel-green-600">{{ student.email }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <div class="flex-1 h-1.5 bg-pastel-green-100 rounded-full overflow-hidden min-w-[60px]">
                  <div class="h-full bg-pastel-green-500" :style="{ width: `${((student.totalDays - student.absent) / student.totalDays) * 100}%` }"></div>
                </div>
                <span class="text-xs font-bold text-pastel-green-700">{{ Math.round(((student.totalDays - student.absent) / student.totalDays) * 100) }}%</span>
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink :to="`/reports/${student.id}`" class="p-2 text-pastel-green-600 hover:bg-pastel-green-50 rounded-lg transition-colors" title="View Report">
                  <BarChart3 class="w-4 h-4" />
                </NuxtLink>
                <button @click="openModal(student)" class="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                  <Pencil class="w-4 h-4" />
                </button>
                <button @click="deleteStudent(student.id)" class="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredStudents.length === 0" class="p-12 text-center text-pastel-green-400">
        <Users class="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p class="font-medium">No students found matching your search.</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pastel-green-900/20 backdrop-blur-sm">
      <div class="card w-full max-w-md shadow-2xl scale-in">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold">{{ isEditing ? 'Edit Student' : 'Add New Student' }}</h3>
          <button @click="showModal = false" class="p-1 text-pastel-green-400 hover:text-pastel-green-600">
            <X class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label class="label">Full Name</label>
            <input v-model="form.name" type="text" class="input" required />
          </div>
          <div>
            <label class="label">Email Address</label>
            <input v-model="form.email" type="email" class="input" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Grade</label>
              <select v-model="form.grade" class="input appearance-none">
                <option>Grade 10</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
              </select>
            </div>
            <div>
              <label class="label">Absences</label>
              <input v-model.number="form.absent" type="number" min="0" class="input" required />
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-8">
            <button type="button" @click="showModal = false" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary px-8">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search, Plus, Pencil, Trash2, X, BarChart3, Users } from 'lucide-vue-next'

const studentStore = useStudentStore()
const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)

const form = ref({
  id: '',
  name: '',
  email: '',
  grade: 'Grade 10',
  absent: 0,
  totalDays: 100
})

const filteredStudents = computed(() => {
  return studentStore.students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const openModal = (student = null) => {
  if (student) {
    isEditing.value = true
    form.value = { ...student }
  } else {
    isEditing.value = false
    form.value = { id: Date.now().toString(), name: '', email: '', grade: 'Grade 10', absent: 0, totalDays: 100 }
  }
  showModal.value = true
}

const handleSave = () => {
  if (isEditing.value) {
    studentStore.updateStudent(form.value.id, form.value)
  } else {
    studentStore.addStudent({ ...form.value })
  }
  showModal.value = false
}

const deleteStudent = (id) => {
  if (confirm('Are you sure you want to delete this student?')) {
    studentStore.deleteStudent(id)
  }
}
</script>

<style scoped>
.scale-in {
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
