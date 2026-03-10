import { defineStore } from 'pinia'

export interface Assessment {
  id: string
  studentId: string
  subject: string
  score: number
  totalScore: number
  date: string
  feedback: string
}

export const useAssessmentStore = defineStore('assessments', {
  state: () => ({
    assessments: [
      { id: '1', studentId: '1', subject: 'Mathematics', score: 85, totalScore: 100, date: '2024-03-01', feedback: 'Great performance in algebra.' },
      { id: '2', studentId: '1', subject: 'Science', score: 78, totalScore: 100, date: '2024-03-05', feedback: 'Good understanding of core concepts.' },
      { id: '3', studentId: '2', subject: 'Mathematics', score: 92, totalScore: 100, date: '2024-03-01', feedback: 'Excellent analytical skills.' },
      { id: '4', studentId: '3', subject: 'English', score: 88, totalScore: 100, date: '2024-03-10', feedback: 'Improved writing fluency.' },
    ] as Assessment[],
  }),
  actions: {
    addAssessment(assessment: Assessment) {
      this.assessments.push(assessment)
    },
    updateAssessment(id: string, updated: Partial<Assessment>) {
      const index = this.assessments.findIndex(a => a.id === id)
      if (index !== -1) {
        this.assessments[index] = { ...this.assessments[index], ...updated }
      }
    },
    deleteAssessment(id: string) {
      this.assessments = this.assessments.filter(a => a.id !== id)
    }
  }
})
