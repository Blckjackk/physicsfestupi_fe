/**
 * Exam Service
 * Handles exam session, question loading, and answer submission
 */

import { api } from '@/lib/api';
import { authService } from './auth.service';

// Helper function to get current peserta_id
const getPesertaId = (): number => {
  const user = authService.getAuthUser();
  return user?.id || 1; // Fallback to 1 if no user found
};

export const examService = {
  /**
   * Get exam session (loads ujian, soal, and saved answers)
   * Uses ujian_id from localStorage
   */
  getExamSession: async (ujianId: number): Promise<any> => {
    const pesertaId = getPesertaId();
    const response = await api.get<any>(`/peserta/soal/${ujianId}?peserta_id=${pesertaId}`);
    return response.data; // Laravel returns { success, message, data }
  },

  /**
   * Submit answer for a question (auto-save)
   */
  submitAnswer: async (data: { soal_id: number; jawaban_user: string; ujian_id: number }): Promise<any> => {
    const pesertaId = getPesertaId();
    const response = await api.post<any>('/peserta/jawaban', {
      soal_id: data.soal_id,
      jawaban: data.jawaban_user.toLowerCase(), // Convert to lowercase (a,b,c,d,e)
      ujian_id: data.ujian_id,
      peserta_id: pesertaId
    });
    return response.data;
  },

  /**
   * Submit final exam (finish exam)
   */
  submitExam: async (ujianId: number): Promise<any> => {
    const pesertaId = getPesertaId();
    const response = await api.post<any>('/peserta/ujian/selesai', {
      ujian_id: ujianId,
      peserta_id: pesertaId
    });
    return response.data;
  },
  
  /**
   * Get ujian by ID from available ujian list
   */
  getUjianById: async (ujianId: number): Promise<any> => {
    const response = await api.get<any>(`/peserta/ujian/${ujianId}`);
    return response.data;
  },
  
  /**
   * Check status aktivitas peserta untuk ujian tertentu
   * Returns status: 'belum_login', 'sedang_mengerjakan', 'sudah_submit'
   */
  getStatusUjian: async (ujianId: number): Promise<any> => {
    const pesertaId = getPesertaId();
    const response = await api.get<any>(`/peserta/ujian/status/${ujianId}?peserta_id=${pesertaId}`);
    return response.data;
  },
};

export default examService;
