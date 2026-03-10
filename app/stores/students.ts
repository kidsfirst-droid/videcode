import { defineStore } from 'pinia'

export interface Student {
  id: string
  name: string
  email: string
  grade: string
  absent: number
  totalDays: number
}

export const useStudentStore = defineStore('students', {
  state: () => ({
    students: [
      { id: '1', name: 'Alice Johnson', email: 'alice@example.com', grade: 'Grade 10', absent: 2, totalDays: 100 },
      { id: '2', name: 'Bob Smith', email: 'bob@example.com', grade: 'Grade 10', absent: 5, totalDays: 100 },
      { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', grade: 'Grade 11', absent: 0, totalDays: 100 },
      { id: '4', name: 'Diana Prince', email: 'diana@example.com', grade: 'Grade 11', absent: 1, totalDays: 100 },
      { id: '5', name: 'Ethan Hunt', email: 'ethan@example.com', grade: 'Grade 12', absent: 4, totalDays: 100 },
    ] as Student[],
  }),
  actions: {
    addStudent(student: Student) {
      this.students.push(student)
    },
    updateStudent(id: string, updatedStudent: Partial<Student>) {
      const index = this.students.findIndex(s => s.id === id)
      if (index !== -1) {
        this.students[index] = { ...this.students[index], ...updatedStudent }
      }
    },
    deleteStudent(id: string) {
      this.students = this.students.filter(s => s.id !== id)
    }
  }
})
