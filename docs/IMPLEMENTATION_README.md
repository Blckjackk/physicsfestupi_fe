# 📝 README - Dynamic System Implementation

## 🎯 Project Overview

Website CBT (Computer Based Test) untuk **Physics Fest UPI 2025** dengan sistem dinamis menggunakan mock JSON di localStorage (mirip dengan halaman data-peserta).

## 🏗️ Architecture

```
src/
├── lib/
│   └── mockData.ts              # 🔥 Mock Database & Services
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx         # 🔥 Login Peserta (Dynamic)
│   ├── (admin)/
│   │   └── login-admin/
│   │       └── page.tsx         # 🔥 Login Admin (Dynamic)
│   └── (peserta)/
│       └── exam/
│           └── page.tsx         # 🔥 Exam Page (Fully Dynamic)
├── components/
│   ├── exam/
│   │   ├── ExamHeader.tsx       # Timer & Logout
│   │   ├── QuestionCard.tsx     # Soal & Opsi Jawaban
│   │   ├── QuestionNavigation.tsx # Grid navigasi soal
│   │   └── AnswerOption.tsx     # Component opsi jawaban
│   └── ui/
│       └── alert-modal.tsx      # Modal untuk alert
docs/
├── DYNAMIC_SYSTEM_DOCUMENTATION.md  # 📚 Complete Guide
├── DYNAMIC_CHANGES_SUMMARY.md       # 📋 Summary Perubahan
└── QUICK_REFERENCE.md               # ⚡ Quick Testing Guide
```

## 🔑 Core Files Explained

### 1. `/src/lib/mockData.ts`
**Purpose:** Mock database & service layer

**Contains:**
- TypeScript interfaces (User, Ujian, Soal, JawabanPeserta)
- Mock users data (1 admin + 3 peserta)
- Mock exam data (10 soal fisika)
- `AuthService`: login, logout, getCurrentUser, isAuthenticated
- `ExamService`: getUjian, saveJawaban, getJawaban, hitungSkor
- `initializeLocalStorage()`: Setup localStorage on first load

**Why?** 
Centralized data management, easy to replace with real API later.

### 2. Login Pages (Peserta & Admin)
**What changed:**
- Added `useEffect` untuk init localStorage & check existing session
- Replaced mock `simulateLoginCondition()` dengan `AuthService.login()`
- Added role validation (peserta vs admin)
- Added exam availability checks
- Dynamic alert messages based on actual data

**Flow:**
```
User input → AuthService.login() → 
Check role → Check exam status → 
Save to localStorage → Redirect
```

### 3. Exam Page (Completely Rewritten)
**Major Changes:**
- Load soal from `ExamService.getUjian()`
- Calculate remaining time from start time
- Auto-save every 10 seconds
- Resume functionality (reload = continue)
- Real score calculation
- Prevent double submission

**State Management:**
```typescript
ujianData: Ujian          // Exam data with 10 questions
userId: string            // Current user ID
timeLeft: number          // Remaining seconds
answers: Record<number, string>  // Question # → A/B/C/D/E
doubtfulQuestions: number[]      // Array of marked questions
```

## 📊 Data Flow

### Login Flow
```
1. User enters credentials
2. AuthService.login(username, password)
3. Search in localStorage('users')
4. Validate role & exam availability
5. Save to localStorage('currentUser')
6. Redirect based on role
```

### Exam Flow
```
1. Load user from localStorage('currentUser')
2. Get ujian from localStorage('ujianList')
3. Check existing progress in localStorage('jawabanList')
4. If exists: Resume with saved data
5. If not: Initialize new session
6. User answers → Auto-save every 10s
7. Submit → Calculate score → Save result
```

### Auto-Save Flow
```
Every 10 seconds OR on answer change:
1. Get current state (answers, raguRagu)
2. Create JawabanPeserta object
3. Save to localStorage('jawabanList')
4. Update existing entry or add new
```

## 🎨 Component Structure

### ExamPage
```
ExamPage (Main Container)
├── ExamHeader (Timer + Logout)
├── QuestionCard (Current Question)
│   └── AnswerOption[] (5 options A-E)
├── ActionButtons (Kembali | Ragu-Ragu | Lanjut)
├── QuestionNavigation (Grid 5x2)
└── AlertModal (Notifications)
```

### Props Flow
```typescript
ExamHeader: 
  timeRemaining: string   // "0:59:00"
  onLogout: () => void

QuestionCard:
  questionNumber: number
  questionText: string
  answers: { label, text }[]
  selectedAnswer: string | null
  onSelectAnswer: (label) => void

QuestionNavigation:
  totalQuestions: number
  currentQuestion: number
  answeredQuestions: number[]
  doubtfulQuestions: number[]
  onNavigate: (num) => void
```

## 🔄 Session Management

### Authentication Check
```typescript
// Every protected page
useEffect(() => {
  const user = AuthService.getCurrentUser()
  if (!user) router.push('/login')
  if (user.role !== 'expected_role') router.push('/unauthorized')
}, [])
```

### Auto-Logout Scenarios
- Timer runs out → Submit → Logout → Redirect
- Manual logout → Clear currentUser → Redirect
- Already submitted → Alert → Logout → Redirect

## 🧪 Testing Strategy

### Unit Testing Focus
```typescript
// AuthService
- ✅ Login with valid credentials
- ✅ Login with invalid credentials
- ✅ Login with wrong role
- ✅ Logout clears session
- ✅ isAuthenticated returns correct value

// ExamService  
- ✅ getUjian returns correct data
- ✅ saveJawaban persists to localStorage
- ✅ getJawaban retrieves saved data
- ✅ hitungSkor calculates correctly
- ✅ Resume exam calculates remaining time

// Exam Page
- ✅ Timer counts down correctly
- ✅ Auto-save triggers every 10s
- ✅ Answer selection updates state
- ✅ Navigation changes current question
- ✅ Submit calculates and saves score
- ✅ Logout confirmation works
```

### Integration Testing
```
1. Login → Exam → Answer → Submit → Logout
2. Login → Exam → Refresh → Resume → Submit
3. Login → Already submitted → Blocked
4. Wrong credentials → Error alert
5. Wrong role → Error alert
```

## 🚀 Deployment Checklist

- [ ] Test all login scenarios
- [ ] Test exam flow (start → answer → submit)
- [ ] Test resume functionality
- [ ] Test timer accuracy
- [ ] Test auto-save reliability
- [ ] Test score calculation
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Test browser compatibility
- [ ] Performance test with multiple users
- [ ] Security review (XSS, injection)

## 🔐 Security Considerations

**Current (Mock):**
- ⚠️ Passwords stored in plain text (localStorage)
- ⚠️ Score calculation on client-side (dapat di-cheat)
- ⚠️ No encryption
- ⚠️ No rate limiting

**Production (Real API):**
- ✅ Hash passwords (bcrypt)
- ✅ JWT tokens for authentication
- ✅ Server-side score calculation
- ✅ HTTPS only
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ CSRF protection

## 📈 Performance Optimization

**Current:**
- localStorage access: O(1)
- Auto-save: Debounced 10s
- No network calls (mock data)

**Future with Real API:**
- Implement caching (React Query / SWR)
- Debounce auto-save API calls
- Use WebSocket for real-time updates
- Lazy load question images
- Code splitting by routes

## 🔄 Migration to Real Backend

**Step 1:** Create API service layer
```typescript
// src/services/api.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_URL

export const AuthAPI = {
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    return res.json()
  }
}
```

**Step 2:** Replace imports
```typescript
// Before
import { AuthService } from '@/lib/mockData'

// After
import { AuthService } from '@/services/api'
```

**Step 3:** Add error handling
```typescript
try {
  const user = await AuthService.login(username, password)
} catch (error) {
  if (error.status === 401) {
    // Unauthorized
  } else if (error.status === 500) {
    // Server error
  } else {
    // Network error
  }
}
```

**Step 4:** Add JWT token management
```typescript
// Store JWT in httpOnly cookie or localStorage
localStorage.setItem('token', response.token)

// Add to all API calls
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

## 📝 Code Style & Conventions

- TypeScript for type safety
- Functional components with hooks
- Named exports for services
- Default exports for pages/components
- camelCase for variables/functions
- PascalCase for components/interfaces
- Descriptive variable names
- Comments for complex logic

## 🤝 Contributing

1. Create feature branch
2. Follow existing code style
3. Add tests for new features
4. Update documentation
5. Submit PR with description

## 📞 Support

**Documentation:**
- `DYNAMIC_SYSTEM_DOCUMENTATION.md` - Complete guide
- `QUICK_REFERENCE.md` - Testing cheatsheet
- `DYNAMIC_CHANGES_SUMMARY.md` - What changed

**Debugging:**
- Check browser console for errors
- Use React DevTools for component state
- Use localStorage DevTools to view data
- Check Network tab for API calls (when real backend)

---

**Status:** ✅ Production Ready (Mock Version)  
**Last Updated:** October 4, 2025  
**Version:** 2.0.0 - Dynamic System
