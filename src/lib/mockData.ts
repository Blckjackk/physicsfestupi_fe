// Mock database menggunakan JSON
// Data ini akan disimpan di public/mock-api untuk simulasi backend

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'peserta';
  nama?: string;
  ujianId?: string;
}

export interface Ujian {
  id: string;
  nama: string;
  durasi: number; // dalam menit
  soal: Soal[];
  status: 'belum_mulai' | 'sedang_berlangsung' | 'selesai';
}

export interface Soal {
  id: string;
  nomor: number;
  pertanyaan: string;
  opsi: OpsiJawaban[];
  jawabanBenar: string;
}

export interface OpsiJawaban {
  label: string;
  teks: string;
}

export interface JawabanPeserta {
  userId: string;
  ujianId: string;
  jawaban: Record<number, string>; // nomor soal -> jawaban (A/B/C/D/E)
  raguRagu: number[];
  waktuMulai: Date;
  waktuSelesai?: Date;
  skor?: number;
}

// Mock data users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    nama: 'Administrator',
  },
  {
    id: '2',
    username: 'asep123',
    password: 'tes123',
    role: 'peserta',
    nama: 'Asep Surasep',
    ujianId: '1',
  },
  {
    id: '3',
    username: 'inibudi',
    password: 'tes123',
    role: 'peserta',
    nama: 'Budi Santoso',
    ujianId: '1',
  },
  {
    id: '4',
    username: 'andiiii10',
    password: 'tes123',
    role: 'peserta',
    nama: 'Andi Pratama',
    ujianId: '1',
  },
];

// Mock data ujian
export const mockUjian: Ujian = {
  id: '1',
  nama: 'Ujian Fisika - Physics Fest UPI 2025',
  durasi: 60, // 60 menit
  status: 'sedang_berlangsung',
  soal: [
    {
      id: 's1',
      nomor: 1,
      pertanyaan:
        'Seorang siswa melakukan percobaan hukum Newton dengan cara menarik sebuah troli bermassa 4 kg menggunakan sebuah dinamometer di atas bidang datar licin. Ternyata gaya yang dibaca pada dinamometer adalah 12 N dan troli bergerak dipercepat.\n\nSetelah beberapa saat, siswa tersebut menambahkan beban 2 kg di atas troli dan menariknya kembali dengan gaya yang sama, yaitu 12 N.\n\nBerapakah perbandingan percepatan troli sebelum dan sesudah ditambahkan beban?',
      opsi: [
        { label: 'A', teks: '3 : 2' },
        { label: 'B', teks: '2 : 3' },
        { label: 'C', teks: '4 : 3' },
        { label: 'D', teks: '3 : 4' },
        { label: 'E', teks: '1 : 1' },
      ],
      jawabanBenar: 'A',
    },
    {
      id: 's2',
      nomor: 2,
      pertanyaan:
        'Sebuah benda bermassa 5 kg berada di atas bidang miring dengan sudut kemiringan 30°. Jika koefisien gesek kinetik antara benda dan bidang adalah 0,2, berapakah percepatan benda saat meluncur ke bawah? (g = 10 m/s²)',
      opsi: [
        { label: 'A', teks: '3,27 m/s²' },
        { label: 'B', teks: '4,13 m/s²' },
        { label: 'C', teks: '5,00 m/s²' },
        { label: 'D', teks: '6,54 m/s²' },
        { label: 'E', teks: '7,00 m/s²' },
      ],
      jawabanBenar: 'B',
    },
    {
      id: 's3',
      nomor: 3,
      pertanyaan:
        'Dua buah gaya masing-masing F₁ = 10 N dan F₂ = 15 N bekerja pada sebuah benda. Jika sudut antara kedua gaya tersebut adalah 60°, berapakah resultan kedua gaya tersebut?',
      opsi: [
        { label: 'A', teks: '21,79 N' },
        { label: 'B', teks: '22,91 N' },
        { label: 'C', teks: '23,45 N' },
        { label: 'D', teks: '24,21 N' },
        { label: 'E', teks: '25,00 N' },
      ],
      jawabanBenar: 'A',
    },
    {
      id: 's4',
      nomor: 4,
      pertanyaan:
        'Sebuah peluru ditembakkan dengan kecepatan awal 100 m/s dan membentuk sudut elevasi 45° terhadap bidang horizontal. Berapa tinggi maksimum yang dapat dicapai peluru? (g = 10 m/s²)',
      opsi: [
        { label: 'A', teks: '250 m' },
        { label: 'B', teks: '300 m' },
        { label: 'C', teks: '350 m' },
        { label: 'D', teks: '400 m' },
        { label: 'E', teks: '450 m' },
      ],
      jawabanBenar: 'A',
    },
    {
      id: 's5',
      nomor: 5,
      pertanyaan:
        'Sebuah pegas dengan konstanta 200 N/m digantungi beban bermassa 2 kg. Jika pegas ditarik ke bawah sejauh 5 cm dari posisi setimbang kemudian dilepaskan, berapakah periode getaran pegas tersebut? (g = 10 m/s²)',
      opsi: [
        { label: 'A', teks: '0,628 s' },
        { label: 'B', teks: '0,785 s' },
        { label: 'C', teks: '0,942 s' },
        { label: 'D', teks: '1,000 s' },
        { label: 'E', teks: '1,257 s' },
      ],
      jawabanBenar: 'A',
    },
    {
      id: 's6',
      nomor: 6,
      pertanyaan:
        'Sebuah benda bergerak melingkar beraturan dengan jari-jari lintasan 2 m dan kecepatan linear 4 m/s. Berapakah percepatan sentripetal benda tersebut?',
      opsi: [
        { label: 'A', teks: '4 m/s²' },
        { label: 'B', teks: '6 m/s²' },
        { label: 'C', teks: '8 m/s²' },
        { label: 'D', teks: '10 m/s²' },
        { label: 'E', teks: '12 m/s²' },
      ],
      jawabanBenar: 'C',
    },
    {
      id: 's7',
      nomor: 7,
      pertanyaan:
        'Sebuah benda bermassa 10 kg bergerak dengan kecepatan 5 m/s kemudian menumbuk benda lain bermassa 15 kg yang diam. Jika tumbukan tersebut lenting sempurna, berapakah kecepatan benda pertama setelah tumbukan?',
      opsi: [
        { label: 'A', teks: '-1 m/s' },
        { label: 'B', teks: '0 m/s' },
        { label: 'C', teks: '1 m/s' },
        { label: 'D', teks: '2 m/s' },
        { label: 'E', teks: '3 m/s' },
      ],
      jawabanBenar: 'A',
    },
    {
      id: 's8',
      nomor: 8,
      pertanyaan:
        'Sebuah kalor jenis suatu zat adalah 0,5 kal/g°C. Jika 200 gram zat tersebut dipanaskan dari 20°C menjadi 100°C, berapakah kalor yang dibutuhkan?',
      opsi: [
        { label: 'A', teks: '4.000 kal' },
        { label: 'B', teks: '6.000 kal' },
        { label: 'C', teks: '8.000 kal' },
        { label: 'D', teks: '10.000 kal' },
        { label: 'E', teks: '12.000 kal' },
      ],
      jawabanBenar: 'C',
    },
    {
      id: 's9',
      nomor: 9,
      pertanyaan:
        'Sebuah gas ideal mengalami proses isotermal pada suhu 27°C. Jika volume gas mula-mula 2 liter dan tekanannya 3 atm, berapakah tekanan gas ketika volumenya menjadi 6 liter?',
      opsi: [
        { label: 'A', teks: '0,5 atm' },
        { label: 'B', teks: '1,0 atm' },
        { label: 'C', teks: '1,5 atm' },
        { label: 'D', teks: '2,0 atm' },
        { label: 'E', teks: '2,5 atm' },
      ],
      jawabanBenar: 'B',
    },
    {
      id: 's10',
      nomor: 10,
      pertanyaan:
        'Sebuah muatan listrik 5 μC berada pada jarak 30 cm dari muatan listrik -3 μC. Berapakah gaya Coulomb yang bekerja antara kedua muatan tersebut? (k = 9 × 10⁹ Nm²/C²)',
      opsi: [
        { label: 'A', teks: '1,5 N' },
        { label: 'B', teks: '2,0 N' },
        { label: 'C', teks: '2,5 N' },
        { label: 'D', teks: '3,0 N' },
        { label: 'E', teks: '3,5 N' },
      ],
      jawabanBenar: 'A',
    },
  ],
};

// Helper functions untuk localStorage
export const AuthService = {
  // Login
  login: (username: string, password: string): User | null => {
    const users = JSON.parse(localStorage.getItem('users') || JSON.stringify(mockUsers));
    const user = users.find(
      (u: User) => u.username === username && u.password === password
    );
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('currentUser');
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  // Check if logged in
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('currentUser');
  },
};

// Exam Service
export const ExamService = {
  // Get ujian untuk peserta
  getUjian: (ujianId: string): Ujian | null => {
    const ujianList = JSON.parse(
      localStorage.getItem('ujianList') || JSON.stringify([mockUjian])
    );
    return ujianList.find((u: Ujian) => u.id === ujianId) || null;
  },

  // Save jawaban peserta
  saveJawaban: (jawabanPeserta: JawabanPeserta) => {
    const jawabanList = JSON.parse(localStorage.getItem('jawabanList') || '[]');
    const existingIndex = jawabanList.findIndex(
      (j: JawabanPeserta) =>
        j.userId === jawabanPeserta.userId && j.ujianId === jawabanPeserta.ujianId
    );

    if (existingIndex >= 0) {
      jawabanList[existingIndex] = jawabanPeserta;
    } else {
      jawabanList.push(jawabanPeserta);
    }

    localStorage.setItem('jawabanList', JSON.stringify(jawabanList));
  },

  // Get jawaban peserta
  getJawaban: (userId: string, ujianId: string): JawabanPeserta | null => {
    const jawabanList = JSON.parse(localStorage.getItem('jawabanList') || '[]');
    return (
      jawabanList.find(
        (j: JawabanPeserta) => j.userId === userId && j.ujianId === ujianId
      ) || null
    );
  },

  // Hitung skor
  hitungSkor: (ujian: Ujian, jawaban: Record<number, string>): number => {
    let benar = 0;
    ujian.soal.forEach((soal) => {
      if (jawaban[soal.nomor] === soal.jawabanBenar) {
        benar++;
      }
    });
    return (benar / ujian.soal.length) * 100;
  },
};

// Admin Service untuk Manajemen Ujian dan Soal
export const AdminUjianService = {
  // Get all ujian
  getAllUjian: (): Ujian[] => {
    const ujianList = JSON.parse(
      localStorage.getItem('ujianList') || JSON.stringify([mockUjian])
    );
    return ujianList;
  },

  // Get single ujian by id
  getUjianById: (id: string): Ujian | null => {
    const ujianList = JSON.parse(
      localStorage.getItem('ujianList') || JSON.stringify([mockUjian])
    );
    return ujianList.find((u: Ujian) => u.id === id) || null;
  },

  // Add new ujian
  addUjian: (ujian: Omit<Ujian, 'id'>): Ujian => {
    const ujianList = JSON.parse(
      localStorage.getItem('ujianList') || JSON.stringify([mockUjian])
    );
    const newId = `ujian-${Date.now()}`;
    const newUjian: Ujian = {
      ...ujian,
      id: newId,
    };
    ujianList.push(newUjian);
    localStorage.setItem('ujianList', JSON.stringify(ujianList));
    return newUjian;
  },

  // Update ujian
  updateUjian: (id: string, data: Partial<Ujian>): Ujian | null => {
    const ujianList = JSON.parse(
      localStorage.getItem('ujianList') || JSON.stringify([mockUjian])
    );
    const index = ujianList.findIndex((u: Ujian) => u.id === id);
    if (index >= 0) {
      ujianList[index] = { ...ujianList[index], ...data };
      localStorage.setItem('ujianList', JSON.stringify(ujianList));
      return ujianList[index];
    }
    return null;
  },

  // Delete ujian
  deleteUjian: (id: string): boolean => {
    const ujianList = JSON.parse(
      localStorage.getItem('ujianList') || JSON.stringify([mockUjian])
    );
    const filteredList = ujianList.filter((u: Ujian) => u.id !== id);
    if (filteredList.length < ujianList.length) {
      localStorage.setItem('ujianList', JSON.stringify(filteredList));
      return true;
    }
    return false;
  },

  // Delete multiple ujian
  deleteMultipleUjian: (ids: string[]): number => {
    const ujianList = JSON.parse(
      localStorage.getItem('ujianList') || JSON.stringify([mockUjian])
    );
    const filteredList = ujianList.filter((u: Ujian) => !ids.includes(u.id));
    const deletedCount = ujianList.length - filteredList.length;
    localStorage.setItem('ujianList', JSON.stringify(filteredList));
    return deletedCount;
  },

  // Add soal to ujian
  addSoal: (ujianId: string, soal: Omit<Soal, 'id' | 'nomor'>): Soal | null => {
    const ujianList = JSON.parse(
      localStorage.getItem('ujianList') || JSON.stringify([mockUjian])
    );
    const index = ujianList.findIndex((u: Ujian) => u.id === ujianId);
    if (index >= 0) {
      const newSoalId = `s-${Date.now()}`;
      const newSoalNomor = ujianList[index].soal.length + 1;
      const newSoal: Soal = {
        ...soal,
        id: newSoalId,
        nomor: newSoalNomor,
      };
      ujianList[index].soal.push(newSoal);
      localStorage.setItem('ujianList', JSON.stringify(ujianList));
      return newSoal;
    }
    return null;
  },

  // Update soal
  updateSoal: (ujianId: string, soalId: string, data: Partial<Soal>): Soal | null => {
    const ujianList = JSON.parse(
      localStorage.getItem('ujianList') || JSON.stringify([mockUjian])
    );
    const ujianIndex = ujianList.findIndex((u: Ujian) => u.id === ujianId);
    if (ujianIndex >= 0) {
      const soalIndex = ujianList[ujianIndex].soal.findIndex((s: Soal) => s.id === soalId);
      if (soalIndex >= 0) {
        ujianList[ujianIndex].soal[soalIndex] = {
          ...ujianList[ujianIndex].soal[soalIndex],
          ...data,
        };
        localStorage.setItem('ujianList', JSON.stringify(ujianList));
        return ujianList[ujianIndex].soal[soalIndex];
      }
    }
    return null;
  },

  // Delete soal
  deleteSoal: (ujianId: string, soalId: string): boolean => {
    const ujianList = JSON.parse(
      localStorage.getItem('ujianList') || JSON.stringify([mockUjian])
    );
    const ujianIndex = ujianList.findIndex((u: Ujian) => u.id === ujianId);
    if (ujianIndex >= 0) {
      const filteredSoal = ujianList[ujianIndex].soal.filter((s: Soal) => s.id !== soalId);
      if (filteredSoal.length < ujianList[ujianIndex].soal.length) {
        // Re-number soal
        filteredSoal.forEach((s: Soal, idx: number) => {
          s.nomor = idx + 1;
        });
        ujianList[ujianIndex].soal = filteredSoal;
        localStorage.setItem('ujianList', JSON.stringify(ujianList));
        return true;
      }
    }
    return false;
  },

  // Get soal by id
  getSoalById: (ujianId: string, soalId: string): Soal | null => {
    const ujianList = JSON.parse(
      localStorage.getItem('ujianList') || JSON.stringify([mockUjian])
    );
    const ujian = ujianList.find((u: Ujian) => u.id === ujianId);
    if (ujian) {
      return ujian.soal.find((s: Soal) => s.id === soalId) || null;
    }
    return null;
  },
};

// Initialize localStorage on first load
export const initializeLocalStorage = () => {
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem('ujianList')) {
      localStorage.setItem('ujianList', JSON.stringify([mockUjian]));
    }
    if (!localStorage.getItem('jawabanList')) {
      localStorage.setItem('jawabanList', JSON.stringify([]));
    }
  }
};
