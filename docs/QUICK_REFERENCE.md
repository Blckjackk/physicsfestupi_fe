# 🚀 Quick Reference - Testing Guide

## 🔑 Login Credentials

### Peserta
```
Username: asep123      | Password: tes123
Username: inibudi      | Password: tes123  
Username: andiiii10    | Password: tes123
```

### Admin
```
Username: admin        | Password: admin123
```

## 🧪 Test Scenarios

### 1️⃣ First Time Login
```
1. Go to /login
2. Enter: asep123 / tes123
3. Click "Lanjut" on success alert
4. Start exam with 60 minutes timer
```

### 2️⃣ Resume Exam
```
1. Login & answer some questions
2. Refresh page (F5)
3. Login again with same credentials
4. ✅ Your answers are saved
5. ✅ Timer continues from where it was
6. ✅ Marked questions stay marked
```

### 3️⃣ Submit Exam
```
1. Answer all 10 questions
2. Click "Selesai" on last question
3. Confirm submission
4. ✅ See your score
5. ✅ Auto logout & redirect
```

### 4️⃣ Already Submitted
```
1. Try to login again after submitting
2. ✅ Alert: "Anda Sudah Mengerjakan Soal"
3. ✅ Cannot retake exam
```

### 5️⃣ Admin Login
```
1. Go to /login-admin
2. Enter: admin / admin123
3. ✅ Redirect to /dashboard-admin
```

## 🛠️ Developer Console Commands

### View Data
```javascript
// See all users
JSON.parse(localStorage.getItem('users'))

// See current logged in user
JSON.parse(localStorage.getItem('currentUser'))

// See all answers
JSON.parse(localStorage.getItem('jawabanList'))

// See exam data
JSON.parse(localStorage.getItem('ujianList'))
```

### Reset Everything
```javascript
localStorage.clear()
location.reload()
```

### Quick Timer Test (5 minutes)
```javascript
const ujian = JSON.parse(localStorage.getItem('ujianList'))[0]
ujian.durasi = 5
localStorage.setItem('ujianList', JSON.stringify([ujian]))
location.reload()
```

### Add New User
```javascript
const users = JSON.parse(localStorage.getItem('users'))
users.push({
  id: Date.now().toString(),
  username: 'testuser',
  password: 'test123',
  role: 'peserta',
  nama: 'Test User',
  ujianId: '1'
})
localStorage.setItem('users', JSON.stringify(users))
```

### Check Answer Keys
```javascript
const ujian = JSON.parse(localStorage.getItem('ujianList'))[0]
ujian.soal.forEach((s, i) => {
  console.log(`Soal ${s.nomor}: ${s.jawabanBenar}`)
})
```

## 📊 Exam Data

- **Total Questions:** 10
- **Duration:** 60 minutes
- **Topics:** Hukum Newton, Kinematika, Termodinamika, Listrik
- **Format:** Multiple Choice (A-E)

## 🎯 Answer Keys

```
Soal 1:  A  |  Soal 6:  C
Soal 2:  B  |  Soal 7:  A
Soal 3:  A  |  Soal 8:  C
Soal 4:  A  |  Soal 9:  B
Soal 5:  A  |  Soal 10: A
```

**Perfect Score:** Answer all with keys above = 100%

## ⚡ Features

✅ Auto-save every 10 seconds  
✅ Resume from last position  
✅ Mark questions as "ragu-ragu"  
✅ Real-time timer countdown  
✅ Auto-submit when time's up  
✅ Score calculation  
✅ Prevent double submission  

## 🔄 Data Persistence

Everything stored in `localStorage`:
- User sessions
- Exam progress
- Answers & marked questions
- Start time & remaining time
- Submission status & scores

**Data survives:**
- Page refresh ✅
- Browser close/reopen ✅
- Tab switch ✅

**Data lost when:**
- localStorage.clear() ❌
- Browser data cleared ❌
- Incognito mode closed ❌

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

All views fit 100% zoom ✅

---

**Quick Start:** Clear localStorage → Login with `asep123/tes123` → Start exam!
