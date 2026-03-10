import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Download, Loader2, X, Check } from 'lucide-react';
import * as XLSX from 'xlsx';

const App = () => {
  // --- STATE MANAGEMENT ---
  const [students, setStudents] = useState([
    { id: 1, name: 'Arjun Mehta', email: 'arjun@example.com', age: 22 },
    { id: 2, name: 'Sana Khan', email: 'sana.k@example.com', age: 21 },
    { id: 3, name: 'Rahul Verma', email: 'rahul.v@example.com', age: 23 },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });
  const [errors, setErrors] = useState({});

  // --- CRUD OPERATIONS ---

  // Handle Form Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validation Logic
  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.age || formData.age <= 0) newErrors.age = "Valid age is required";
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create or Update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      if (editingStudent) {
        setStudents(students.map(s => s.id === editingStudent.id ? { ...formData, id: s.id } : s));
      } else {
        setStudents([...students, { ...formData, id: Date.now() }]);
      }
      closeModal();
      setLoading(false);
    }, 800); // Simulated loading
  };

  // Delete with Confirmation
  const deleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  // --- EXCEL EXPORT ---
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "Student_Database.xlsx");
  };

  // --- MODAL HELPERS ---
  const openModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({ name: student.name, email: student.email, age: student.age });
    } else {
      setEditingStudent(null);
      setFormData({ name: '', email: '', age: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
            <p className="text-gray-500">Manage student records and exports</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
            >
              <Download size={18} /> Export Excel
            </button>
            <button 
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
            >
              <Plus size={18} /> Add Student
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">{student.name}</td>
                  <td className="px-6 py-4 text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 text-gray-600">{student.age}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => openModal(student)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteStudent(student.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="p-12 text-center text-gray-400">No student records found.</div>
          )}
        </div>
      </div>

      {/* --- MODAL FOR ADD/EDIT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingStudent ? 'Edit Student Details' : 'Add New Student'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 outline-none transition ${errors.name ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:ring-blue-100'}`}
                  placeholder="e.g. Rahul Sharma"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 outline-none transition ${errors.email ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:ring-blue-100'}`}
                  placeholder="name@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input 
                  type="number" name="age" value={formData.age} onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 outline-none transition ${errors.age ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:ring-blue-100'}`}
                  placeholder="21"
                />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : editingStudent ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
