# Exam Management CRUD Implementation

## Overview
Comprehensive CRUD functionality implemented for exam management with modal forms and alert notifications.

## Features Implemented

### ✅ Create (Tambah Ujian)
- **Trigger**: Purple floating button with Plus icon
- **Modal**: ExamFormModal with mode="add"
- **Fields**:
  - Nama Ujian (required, text input)
  - Durasi (number input, minutes)
  - Jumlah Soal (number input)
  - Deskripsi (textarea, optional)
  - Waktu Mulai (text input, dd/mm/yy format, required)
  - Waktu Akhir (text input, dd/mm/yy format, required)
- **Actions**:
  - Kembali button (gray, cancels)
  - Tambah button (purple #41366E, submits)
- **Alerts**:
  - Success: "Berhasil" / "Ujian berhasil ditambahkan" (green with CheckCircle)
  - Error: "Error!" / "Gagal menambahkan ujian" (red with AlertCircle)

### ✅ Read (List & Search)
- **Exam Count Card**: Shows total exams with user-friends.png icon
- **Search Bar**: Filter by exam name (purple #41366E focus border)
- **Table Columns**: Checkbox, No, Nama, Durasi, Deskripsi, Mulai, Akhir, Jumlah Soal, Aksi
- **Pagination**: 10 items per page with ChevronLeft/ChevronRight navigation

### ✅ Update (Edit Ujian)
- **Trigger**: Edit2 icon button in Aksi column
- **Modal**: ExamFormModal with mode="edit", pre-filled with existing data
- **Fields**: Same as Create, populated with current values
- **Actions**:
  - Kembali button (gray, cancels)
  - Simpan button (purple #41366E, submits)
- **Alerts**:
  - Success: "Berhasil" / "Ujian berhasil diupdate" (green with CheckCircle)
  - Error: "Error!" / "Gagal mengupdate ujian" (red with AlertCircle)

### ✅ Delete (Hapus Ujian)
- **Single Delete**:
  - Trigger: Trash2 icon button in Aksi column
  - Confirmation: DeleteConfirmModal
  - Alert: Success "Berhasil" / "Ujian berhasil dihapus"
  - Alert: Error "Error!" / "Gagal menghapus ujian"

- **Bulk Delete**:
  - Trigger: Red "Hapus Terpilih" button (appears when items selected)
  - Selection: Checkboxes in table rows, Select All in header
  - Confirmation: DeleteConfirmModal with count
  - Alert: Success "Berhasil" / "{count} ujian berhasil dihapus"
  - Alert: Error "Error!" / "Gagal menghapus ujian"

## Component Structure

### ExamFormModal
```typescript
Props:
- show: boolean
- mode: 'add' | 'edit'
- initialData?: ExamForm
- onClose: () => void
- onSubmit: (data: ExamForm) => void

Features:
- Form validation (required fields)
- Controlled inputs with state
- ESC key and click-outside to close
- Purple primary buttons
- Gray secondary buttons
```

### AlertNotification
```typescript
Props:
- show: boolean
- type: 'success' | 'error'
- title: string
- message: string
- onClose: () => void

Features:
- Success: Green theme (#749221), CheckCircle icon
- Error: Red theme (#cd1f1f), AlertCircle icon
- Click-outside to close
- Tutup button (colored by type)
```

### ExamTableRow
```typescript
Props:
- exam: any
- number: number
- selected: boolean
- onSelect: () => void
- onEdit: () => void
- onDelete: () => void

Features:
- Checkbox selection
- Edit button with onClick handler
- Delete button with onClick handler
- Hover states on action buttons
```

## State Management

```typescript
// Exam data
const [exams, setExams] = useState<ExamData[]>(mockExams);

// Selection
const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

// Modals
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [showAddModal, setShowAddModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [editingExam, setEditingExam] = useState<ExamForm | null>(null);

// Alert
const [alert, setAlert] = useState<AlertState>({
  show: false,
  type: 'success',
  title: '',
  message: ''
});

// Search & Pagination
const [searchQuery, setSearchQuery] = useState('');
const [currentPage, setCurrentPage] = useState(1);
```

## Handler Functions

### handleAddExam(formData: ExamForm)
1. Creates new exam with unique ID
2. Adds to exams array
3. Closes modal
4. Shows success alert
5. Error handling with try-catch

### handleEditExam(id: number, formData: ExamForm)
1. Finds exam by ID
2. Updates exam data
3. Closes modal, clears editingExam
4. Shows success alert
5. Error handling with try-catch

### handleDeleteOne(id: number)
1. Stores ID in deletingExamId
2. Opens delete confirmation modal
3. On confirm: filters exam from array
4. Shows success alert
5. Error handling with try-catch

### handleDeleteSelected()
1. Opens delete confirmation modal
2. On confirm: filters out selected exams
3. Clears selection
4. Shows success alert with count
5. Error handling with try-catch

### handleOpenEditModal(exam: ExamData)
1. Converts ExamData to ExamForm
2. Sets editingExam state
3. Opens edit modal

### handleSelectAll()
Toggles all checkboxes on current page

### handleSelectOne(id: number)
Toggles individual checkbox

## Color Scheme

- **Primary Purple**: #41366E (buttons, focus states, highlights)
- **Hover Purple**: #2f2752 (button hover states)
- **Success Green**: #749221 (success alerts, buttons)
- **Success Green Hover**: #5a7219
- **Error Red**: #cd1f1f (error alerts, buttons)
- **Error Red Hover**: #a01818
- **Delete Red**: #D94343 (delete button)
- **Delete Red Hover**: #a92f2f
- **Gray**: Various shades for text, borders, secondary buttons

## Icons Used

- **Plus**: Add exam button
- **Search**: Search bar
- **Edit2**: Edit button
- **Trash2**: Delete button
- **CheckCircle**: Success alerts
- **AlertCircle**: Error alerts
- **ChevronLeft/Right**: Pagination
- **X**: Close buttons
- **user-friends.png**: Exam count card icon

## User Flow Examples

### Adding an Exam
1. Click purple Plus button (bottom-right)
2. Modal opens with empty form
3. Fill required fields (nama, mulai, akhir)
4. Optional fields (durasi, deskripsi, jumlahSoal)
5. Click "Tambah" button
6. Green success alert appears
7. New exam appears in table

### Editing an Exam
1. Click Edit2 icon on exam row
2. Modal opens with pre-filled data
3. Modify fields as needed
4. Click "Simpan" button
5. Green success alert appears
6. Table row updates with new data

### Deleting Exams
**Single:**
1. Click Trash2 icon on exam row
2. Confirmation modal appears
3. Click "Hapus" to confirm
4. Green success alert appears
5. Exam removed from table

**Bulk:**
1. Select multiple checkboxes
2. Red "Hapus Terpilih ({count})" button appears
3. Click the button
4. Confirmation modal shows count
5. Click "Hapus" to confirm
6. Green success alert with count
7. Selected exams removed from table

## Error Handling

All CRUD operations wrapped in try-catch:
```typescript
try {
  // Simulate API call with timeout
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Success logic
  setAlert({
    show: true,
    type: 'success',
    title: 'Berhasil',
    message: 'Operation successful'
  });
} catch (error) {
  setAlert({
    show: true,
    type: 'error',
    title: 'Error!',
    message: 'Operation failed'
  });
}
```

## Validation

### ExamFormModal Validation
- Nama ujian: Required, must not be empty
- Waktu mulai: Required, must not be empty
- Waktu akhir: Required, must not be empty
- Other fields: Optional, have default values

Alert shown if validation fails (browser alert).

## Future Enhancements

### Backend Integration
Replace mock data and setTimeout with real API calls:
```typescript
// Create
const response = await fetch('/api/exams', {
  method: 'POST',
  body: JSON.stringify(formData)
});

// Update
await fetch(`/api/exams/${id}`, {
  method: 'PUT',
  body: JSON.stringify(formData)
});

// Delete
await fetch(`/api/exams/${id}`, {
  method: 'DELETE'
});
```

### Additional Features
- Date picker for waktu mulai/akhir
- Form validation improvements (date format, min/max values)
- Loading states during operations
- Confirmation before leaving with unsaved changes
- Sorting by column headers
- Export exam list (CSV, Excel)
- Duplicate exam functionality
- Archive instead of permanent delete

## Testing Checklist

- [ ] Add exam with all fields
- [ ] Add exam with only required fields
- [ ] Edit exam and verify changes
- [ ] Delete single exam
- [ ] Select and delete multiple exams
- [ ] Select all exams on page
- [ ] Search functionality
- [ ] Pagination navigation
- [ ] Success alerts display correctly
- [ ] Error alerts display correctly (simulate by throwing error)
- [ ] Cancel buttons close modals
- [ ] Click outside modals to close
- [ ] Form validation prevents empty submission
- [ ] Checkbox selection works correctly

## Implementation Date
January 2025

## Status
✅ **COMPLETE** - All CRUD operations implemented with forms and alerts
