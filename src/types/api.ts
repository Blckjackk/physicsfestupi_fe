/**
 * TypeScript Type Definitions for API
 */

// ============= AUTH TYPES =============

export interface LoginPesertaRequest {
  username: string;
  password: string;
}

export interface LoginPesertaResponse {
  status: string;
  message: string;
  token: string;
  peserta: {
    id: number;
    username: string;
    role: string;
  };
  ujian: {
    id: number;
    nama_ujian: string;
    deskripsi: string;
    waktu_mulai_pengerjaan: string;
    waktu_akhir_pengerjaan: string;
  };
  aktivitas: {
    id: number;
    status: string;
    waktu_login: string | null;
    waktu_submit: string | null;
  };
}

export interface LoginAdminRequest {
  username: string;
  password: string;
}

export interface LoginAdminResponse {
  status: string;
  message: string;
  token: string;
  admin: {
    id: number;
    username: string;
    role: string;
  };
}

// ============= EXAM TYPES =============

export interface Soal {
  id: number;
  ujian_id: number;
  nomor_soal: number;
  tipe_soal: 'text' | 'gambar';
  deskripsi_soal?: string;
  pertanyaan: string;
  media_soal?: string;
  opsi_a?: string;
  opsi_a_media?: string;
  opsi_b?: string;
  opsi_b_media?: string;
  opsi_c?: string;
  opsi_c_media?: string;
  opsi_d?: string;
  opsi_d_media?: string;
  opsi_e?: string;
  opsi_e_media?: string;
  jawaban_benar?: string;
}

export interface ExamSessionResponse {
  status: string;
  message: string;
  ujian: {
    id: number;
    nama_ujian: string;
    deskripsi: string;
    waktu_mulai_pengerjaan: string;
    waktu_akhir_pengerjaan: string;
  };
  soal: Soal[];
  jawaban_tersimpan: {
    [soalId: number]: string;
  };
  aktivitas: {
    id: number;
    status: string;
    waktu_login: string;
    waktu_submit: string | null;
  };
  waktu_tersisa_detik: number;
}

export interface SubmitAnswerRequest {
  soal_id: number;
  jawaban_user: string;
}

export interface SubmitAnswerResponse {
  status: string;
  message: string;
  jawaban: {
    id: number;
    soal_id: number;
    jawaban_user: string;
  };
}

export interface SubmitExamRequest {
  // No body needed, just POST request
}

export interface SubmitExamResponse {
  status: string;
  message: string;
  nilai_total: number;
  waktu_submit: string;
}

// ============= USER TYPES =============

export interface User {
  id: number;
  username: string;
  role: 'peserta' | 'admin' | 'superadmin';
}

export interface Ujian {
  id: number;
  nama_ujian: string;
  deskripsi: string;
  waktu_mulai_pengerjaan: string;
  waktu_akhir_pengerjaan: string;
}
