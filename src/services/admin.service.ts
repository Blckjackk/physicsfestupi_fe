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
  jumlah_soal?: number;
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
  media_soal?: File | string;  // Support File upload or URL string
  opsi_a: string;
  opsi_a_media?: File | string;
  opsi_b: string;
  opsi_b_media?: File | string;
  opsi_c: string;
  opsi_c_media?: File | string;
  opsi_d: string;
  opsi_d_media?: File | string;
  opsi_e: string;
  opsi_e_media?: File | string;
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
   * Get all ujian with jumlah_soal calculated from soal count
   */
  getUjian: async (): Promise<Ujian[]> => {
    const response = await api.get<any>('/admin/ujian');
    // Backend returns dashboard format with ujian_dashboard array
    if (response.data && response.data.ujian_dashboard) {
      // Fetch all ujian first
      const ujianList = response.data.ujian_dashboard.map((ujian: any) => {
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
          jumlah_soal: 0, // Will be updated below
          created_at: ujian.created_at
        };
      });

      // Fetch jumlah_soal for each ujian
      const ujianWithSoalCount = await Promise.all(
        ujianList.map(async (ujian: Ujian) => {
          try {
            const soalResponse = await api.get<any>(`/admin/soal/${ujian.id}`);
            const jumlahSoal = soalResponse.data?.soal?.length || 0;
            return { ...ujian, jumlah_soal: jumlahSoal };
          } catch (error) {
            console.error(`Failed to fetch soal count for ujian ${ujian.id}:`, error);
            return { ...ujian, jumlah_soal: 0 };
          }
        })
      );

      return ujianWithSoalCount;
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
    // Backend returns { success, data: { ujian, soal } }
    return response.data?.soal || [];
  },

  /**
   * Create new soal with file upload support
   */
  createSoal: async (data: CreateSoalRequest): Promise<Soal> => {
    // Check if any field contains File object
    const hasFile = Object.values(data).some(value => value instanceof File);

    if (hasFile) {
      // Use FormData for file upload
      const formData = new FormData();
      
      // Append basic fields
      formData.append('ujian_id', data.ujian_id.toString());
      formData.append('nomor_soal', data.nomor_soal.toString());
      formData.append('pertanyaan', data.pertanyaan);
      
      if (data.tipe_soal) formData.append('tipe_soal', data.tipe_soal);
      if (data.deskripsi_soal) formData.append('deskripsi_soal', data.deskripsi_soal);
      
      // Append media_soal (File or string)
      if (data.media_soal) {
        if (data.media_soal instanceof File) {
          formData.append('media_soal', data.media_soal);
        } else {
          formData.append('media_soal', data.media_soal);
        }
      }
      
      // Append opsi A-E with media
      formData.append('opsi_a', data.opsi_a);
      if (data.opsi_a_media) {
        if (data.opsi_a_media instanceof File) {
          formData.append('opsi_a_media', data.opsi_a_media);
        } else {
          formData.append('opsi_a_media', data.opsi_a_media);
        }
      }
      
      formData.append('opsi_b', data.opsi_b);
      if (data.opsi_b_media) {
        if (data.opsi_b_media instanceof File) {
          formData.append('opsi_b_media', data.opsi_b_media);
        } else {
          formData.append('opsi_b_media', data.opsi_b_media);
        }
      }
      
      formData.append('opsi_c', data.opsi_c);
      if (data.opsi_c_media) {
        if (data.opsi_c_media instanceof File) {
          formData.append('opsi_c_media', data.opsi_c_media);
        } else {
          formData.append('opsi_c_media', data.opsi_c_media);
        }
      }
      
      formData.append('opsi_d', data.opsi_d);
      if (data.opsi_d_media) {
        if (data.opsi_d_media instanceof File) {
          formData.append('opsi_d_media', data.opsi_d_media);
        } else {
          formData.append('opsi_d_media', data.opsi_d_media);
        }
      }
      
      formData.append('opsi_e', data.opsi_e);
      if (data.opsi_e_media) {
        if (data.opsi_e_media instanceof File) {
          formData.append('opsi_e_media', data.opsi_e_media);
        } else {
          formData.append('opsi_e_media', data.opsi_e_media);
        }
      }
      
      formData.append('jawaban_benar', data.jawaban_benar);

      // Send as multipart/form-data
      const response = await api.post<any>('/admin/soal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } else {
      // Send as regular JSON if no files
      const response = await api.post<any>('/admin/soal', data);
      return response.data;
    }
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
