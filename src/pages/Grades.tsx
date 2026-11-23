import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Student, Grade } from '../types/index';
import { 
  Loader2, 
  Plus, 
  Search, 
  Award, 
  BookOpen, 
  User,
  X,
  BarChart3
} from 'lucide-react';
import { useForm } from 'react-hook-form';

const Grades: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<(Grade & { students: Student })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { register, handleSubmit, reset } = useForm<Omit<Grade, 'id' | 'created_at'>>();

  const fetchData = async () => {
    setLoading(true);
    const { data: studentData } = await supabase.from('students').select('*').order('first_name');
    const { data: gradeData } = await supabase.from('grades').select('*, students(*)').order('created_at', { ascending: false });
    
    if (studentData) setStudents(studentData);
    if (gradeData) setGrades(gradeData as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    const marks = parseFloat(data.marks);
    let grade = 'F';
    if (marks >= 75) grade = 'A';
    else if (marks >= 65) grade = 'B';
    else if (marks >= 55) grade = 'C';
    else if (marks >= 45) grade = 'S';

    const { error } = await supabase.from('grades').insert([{ ...data, grade }]);
    
    if (!error) {
      setIsModalOpen(false);
      reset();
      fetchData();
    }
  };

  const filteredGrades = grades.filter(g => 
    g.students?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Academic Ledger</h2>
            <p className="text-slate-400 font-medium text-sm">Managing results for Term 1 - 2026</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 font-black uppercase text-[10px] tracking-widest active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Record New Marks
        </button>
      </div>

      {/* Filter Bar */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Filter results by student or subject name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-[1.5rem] py-5 pl-16 pr-8 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-bold shadow-sm"
        />
      </div>

      {/* Grades List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Period</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subject</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Marks</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGrades.length > 0 ? (
                  filteredGrades.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{record.students?.first_name} {record.students?.last_name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase italic">{record.students?.admission_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">{record.term}</span>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-700">{record.subject}</td>
                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex items-center gap-2">
                          <span className="text-lg font-black text-slate-900">{record.marks}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase italic">/100</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`inline-flex w-10 h-10 items-center justify-center rounded-xl font-black text-lg shadow-sm border ${
                          record.grade === 'A' ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-100' :
                          record.grade === 'B' ? 'bg-indigo-500 text-white border-indigo-400 shadow-indigo-100' :
                          record.grade === 'F' ? 'bg-rose-500 text-white border-rose-400 shadow-rose-100' :
                          'bg-slate-700 text-white border-slate-600'
                        }`}>
                          {record.grade}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <BarChart3 className="w-10 h-10 opacity-20" />
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-300">No data entries found</p>
                      </div>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Grade Entry
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Student</label>
                <select {...register('student_id', { required: true })} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 cursor-pointer appearance-none">
                  <option value="">Choose a student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.admission_number})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Term</label>
                  <select {...register('term', { required: true })} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 cursor-pointer appearance-none">
                    <option value="Term 1 - 2026">Term 1 - 2026</option>
                    <option value="Term 2 - 2026">Term 2 - 2026</option>
                    <option value="Term 3 - 2026">Term 3 - 2026</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                  <input {...register('subject', { required: true })} placeholder="e.g. Science" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Enter Total Marks (0-100)</label>
                <input 
                  type="number" 
                  {...register('marks', { required: true, min: 0, max: 100 })} 
                  className="w-full text-center py-6 bg-slate-900 text-white border-none rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/50 text-4xl font-black"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  Confirm Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;
