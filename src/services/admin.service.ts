/**
 * Admin Service
 * Handles admin operations for ujian, soal, and peserta management
 */

import { api } from '@/lib/api';

// ============= UJIAN MANAGEMENT =============

export interface Ujian {
  id: number;
  nama_ujian: string;
  deskripsi?: string;
  waktu_mulai_pengerjaan: string;
  waktu_akhir_pengerjaan: string;
  durasi: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUjianRequest {
  nama_ujian: string;
  deskripsi?: string;
  waktu_mulai_pengerjaan: string;
  waktu_akhir_pengerjaan: string;
  durasi: number;
}

export interface UpdateUjianRequest extends CreateUjianRequest {
  id: number;
}

// ============= SOAL MANAGEMENT =============

export interface Soal {
  id: number;
  ujian_id: number;
  nomor_soal: number;
  tipe_soal?: 'text' | 'gambar';
  deskripsi_soal?: string;
  pertanyaan: string;
  media_soal?: string;
  opsi_a: string;
  opsi_a_media?: string;
  opsi_b: string;
  opsi_b_media?: string;
  opsi_c: string;
  opsi_c_media?: string;
  opsi_d: string;
  opsi_d_media?: string;
  opsi_e: string;
  opsi_e_media?: string;
  jawaban_benar: string; // Backend uses uppercase: "A", "B", "C", "D", "E"
  created_at?: string;
  updated_at?: string;
}

export interface CreateSoalRequest {
  ujian_id: number;
  nomor_soal: number;
  tipe_soal?: 'text' | 'gambar';
  deskripsi_soal?: string;
  pertanyaan: string;
  media_soal?: string;
  opsi_a: string;
  opsi_a_media?: string;
  opsi_b: string;
  opsi_b_media?: string;
  opsi_c: string;
  opsi_c_media?: string;
  opsi_d: string;
  opsi_d_media?: string;
  opsi_e: string;
  opsi_e_media?: string;
  jawaban_benar: string; // Send as uppercase: "A", "B", "C", "D", "E"
}

export interface UpdateSoalRequest extends CreateSoalRequest {
  id: number;
}

// ============= PESERTA MANAGEMENT =============

export interface Peserta {
  id: number;
  username: string;
  nilai_total: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePesertaRequest {
  username: string;
  password: string;
}

export interface UpdatePesertaRequest {
  username?: string;
  password?: string;
}

// ============= ADMIN SERVICE =============

export const adminService = {
  // ========== UJIAN ENDPOINTS ==========
  
  /**
   * Get all ujian
   */
  getUjian: async (): Promise<Ujian[]> => {
    const response = await api.get<any>('/admin/ujian');
    // Backend returns dashboard format with ujian_dashboard array
    if (response.data && response.data.ujian_dashboard) {
      return response.data.ujian_dashboard.map((ujian: any) => {
        // Calculate durasi from waktu_mulai and waktu_akhir (in minutes)
        let durasi = 0;
        if (ujian.waktu_mulai_pengerjaan && ujian.waktu_akhir_pengerjaan) {
          const start = new Date(ujian.waktu_mulai_pengerjaan);
          const end = new Date(ujian.waktu_akhir_pengerjaan);
          durasi = Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // Convert to minutes
        }

        return {
          id: ujian.ujian_id,
          nama_ujian: ujian.nama_ujian,
          deskripsi: ujian.deskripsi,
          waktu_mulai_pengerjaan: ujian.waktu_mulai_pengerjaan,
          waktu_akhir_pengerjaan: ujian.waktu_akhir_pengerjaan,
          durasi: durasi,
          created_at: ujian.created_at
        };
      });
    }
    return response.data;
  },

  /**
   * Create new ujian
   */
  createUjian: async (data: CreateUjianRequest): Promise<Ujian> => {
    const response = await api.post<any>('/admin/ujian', data);
    return response.data;
  },

  /**
   * Update ujian
   */
  updateUjian: async (id: number, data: UpdateUjianRequest): Promise<Ujian> => {
    const response = await api.put<any>(`/admin/ujian/${id}`, data);
    return response.data;
  },

  /**
   * Delete ujian
   */
  deleteUjian: async (id: number): Promise<void> => {
    await api.delete(`/admin/ujian/${id}`);
  },

  // ========== SOAL ENDPOINTS ==========
  
  /**
   * Get all soal for specific ujian
   */
  getSoalByUjian: async (ujianId: number): Promise<Soal[]> => {
    const response = await api.get<any>(`/admin/soal/${ujianId}`);
    return response.data;
  },

  /**
   * Create new soal
   */
  createSoal: async (data: CreateSoalRequest): Promise<Soal> => {
    const response = await api.post<any>('/admin/soal', data);
    return response.data;
  },

  /**
   * Update soal
   */
  updateSoal: async (id: number, data: UpdateSoalRequest): Promise<Soal> => {
    const response = await api.put<any>(`/admin/soal/${id}`, data);
    return response.data;
  },

  /**
   * Delete soal
   */
  deleteSoal: async (id: number): Promise<void> => {
    await api.delete(`/admin/soal/${id}`);
  },

  // ========== PESERTA ENDPOINTS ==========
  
  /**
   * Get all peserta
   */
  getPeserta: async (): Promise<Peserta[]> => {
    const response = await api.get<any>('/admin/peserta');
    return response.data;
  },

  /**
   * Create new peserta
   */
  createPeserta: async (data: CreatePesertaRequest): Promise<Peserta> => {
    const response = await api.post<any>('/admin/peserta', data);
    return response.data;
  },

  /**
   * Update peserta
   */
  updatePeserta: async (id: number, data: UpdatePesertaRequest): Promise<Peserta> => {
    const response = await api.put<any>(`/admin/peserta/${id}`, data);
    return response.data;
  },

  /**
   * Delete peserta
   */
  deletePeserta: async (id: number): Promise<void> => {
    await api.delete(`/admin/peserta/${id}`);
  },
};

export default adminService;
