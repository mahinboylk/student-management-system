import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Student } from '../types/index';
import { 
  Plus, 
  Search, 
  Loader2, 
  Edit2, 
  Trash2, 
  X, 
  Phone, 
  MapPin, 
  Calendar
} from 'lucide-react';
import { useForm } from 'react-hook-form';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<Omit<Student, 'id' | 'created_at' | 'updated_at'>>();

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('first_name', { ascending: true });
    
    if (!error && data) {
      setStudents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      if (editingStudent) {
        const { error } = await supabase
          .from('students')
          .update(data)
          .eq('id', editingStudent.id);
        
        if (error) throw error;
        setEditingStudent(null);
      } else {
        const { error } = await supabase
          .from('students')
          .insert([data]);
        
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      reset();
      fetchStudents();
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to save student record'));
      console.error('Database Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('students')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        fetchStudents();
      } catch (error: any) {
        alert('Error deleting student: ' + error.message);
      }
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
    // Explicitly set all values to ensure the form is populated correctly
    const fields: (keyof Omit<Student, 'id' | 'created_at' | 'updated_at'>)[] = [
      'admission_number', 'initials', 'first_name', 'last_name', 'gender', 
      'date_of_birth', 'nationality', 'religion', 'date_of_entry', 
      'previous_school', 'address', 'phone_number', 'guardian_name', 
      'relationship_to_student', 'guardian_identity_number'
    ];
    fields.forEach(field => setValue(field, student[field] as any));
  };

  const filteredStudents = students.filter(s => 
    s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name or ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <button
            onClick={() => {
              setEditingStudent(null);
              reset();
              setIsModalOpen(true);
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 text-sm font-bold"
          >
            <Plus className="w-4 h-4" />
            Register New Student
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-400 font-medium">Loading student database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Student Info</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact & Address</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Guardian</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Admission</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {student.first_name[0]}{student.last_name ? student.last_name[0] : ''}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {student.first_name} {student.last_name}
                            </p>
                            <p className="text-xs font-medium text-slate-400">ID: {student.admission_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {student.phone_number}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate max-w-[150px]">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {student.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-700">{student.guardian_name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{student.relationship_to_student}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg w-fit">
                          <Calendar className="w-3 h-3" />
                          {new Date(student.date_of_entry).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleEdit(student)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(student.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                      No student records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editingStudent ? 'Update Record' : 'Student Enrollment'}
                </h2>
                <p className="text-slate-500 text-sm">Fill in all required fields marked with *</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white hover:shadow-md rounded-full transition-all text-slate-400 hover:text-slate-900">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-8 space-y-10">
              {/* Identity Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-[2px] bg-indigo-600"></span>
                    Identity & Enrollment
                  </h3>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Admission No. *</label>
                  <input {...register('admission_number', { required: true })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Initials</label>
                  <input {...register('initials')} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">First Name *</label>
                  <input {...register('first_name', { required: true })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Last Name</label>
                  <input {...register('last_name')} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Gender *</label>
                  <select {...register('gender', { required: true })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 cursor-pointer">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Date of Birth *</label>
                  <input type="date" {...register('date_of_birth', { required: true })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Nationality</label>
                  <input {...register('nationality')} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Religion</label>
                  <input {...register('religion')} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Date of Entry *</label>
                  <input type="date" {...register('date_of_entry', { required: true })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Previous School</label>
                  <input {...register('previous_school')} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>
              </div>

              {/* Guardian Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-[2px] bg-indigo-600"></span>
                    Guardian & Contact
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Guardian Name *</label>
                  <input {...register('guardian_name', { required: true })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Relationship *</label>
                  <input {...register('relationship_to_student', { required: true })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Guardian ID No. *</label>
                  <input {...register('guardian_identity_number', { required: true })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Phone Number *</label>
                  <input {...register('phone_number', { required: true })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Residential Address *</label>
                  <input {...register('address', { required: true })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-slate-500 font-bold hover:text-slate-800 transition-colors">Discard</button>
                <button type="submit" className="px-10 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02]">
                  {editingStudent ? 'Update Record' : 'Confirm Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
