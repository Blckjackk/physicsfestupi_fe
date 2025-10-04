/**
 * Exam Service
 * Handles exam session, question loading, and answer submission
 */

import { api } from '@/lib/api';
import type {
  ExamSessionResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  SubmitExamResponse,
} from '@/types/api';

export const examService = {
  /**
   * Get exam session (loads ujian, soal, and saved answers)
   */
  getExamSession: async (): Promise<ExamSessionResponse> => {
    return await api.get<ExamSessionResponse>('/peserta/ujian-session');
  },

  /**
   * Submit answer for a question (auto-save)
   */
  submitAnswer: async (data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> => {
    return await api.post<SubmitAnswerResponse>('/peserta/simpan-jawaban', data);
  },

  /**
   * Submit final exam (finish exam)
   */
  submitExam: async (): Promise<SubmitExamResponse> => {
    return await api.post<SubmitExamResponse>('/peserta/selesai-ujian');
  },
};

export default examService;
