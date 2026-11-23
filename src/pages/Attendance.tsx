import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Student, AttendanceStatus } from '../types/index';
import { 
  Calendar, 
  Loader2, 
  Save, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search
} from 'lucide-react';

const Attendance: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: studentData } = await supabase
        .from('students')
        .select('id, first_name, last_name, admission_number')
        .order('first_name');
      
      if (studentData) setStudents(studentData as any);

      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('student_id, status')
        .eq('date', date);
      
      const initialAttendance: Record<string, AttendanceStatus> = {};
      attendanceData?.forEach(record => {
        initialAttendance[record.student_id] = record.status as AttendanceStatus;
      });
      
      setAttendance(initialAttendance);
      setLoading(false);
    };

    fetchData();
  }, [date]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    setSaving(true);
    const updates = Object.entries(attendance).map(([studentId, status]) => ({
      student_id: studentId,
      date,
      status
    }));

    const { error } = await supabase
      .from('attendance')
      .upsert(updates, { onConflict: 'student_id,date' });

    if (error) {
      alert('Error saving: ' + error.message);
    }
    setSaving(false);
  };

  const filteredStudents = students.filter(s => 
    s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    present: Object.values(attendance).filter(s => s === 'Present').length,
    absent: Object.values(attendance).filter(s => s === 'Absent').length,
    total: students.length
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 text-center md:text-left">Session Date</p>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-2xl font-black text-slate-900 bg-transparent outline-none cursor-pointer hover:text-indigo-600 transition-colors"
              />
            </div>
          </div>
          
          <div className="hidden md:block w-[1px] h-12 bg-slate-100"></div>

          <div className="flex gap-10">
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Present</p>
              <h4 className="text-2xl font-black text-slate-900">{stats.present}</h4>
            </div>
            <div>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Absent</p>
              <h4 className="text-2xl font-black text-slate-900">{stats.absent}</h4>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unmarked</p>
              <h4 className="text-2xl font-black text-slate-900">{stats.total - Object.keys(attendance).length}</h4>
            </div>
          </div>
        </div>

        <button
          onClick={saveAttendance}
          disabled={saving || students.length === 0}
          className="relative z-10 flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 group active:scale-95 font-black uppercase text-[10px] tracking-widest"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Commit Changes
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Filter students by name or enrollment ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-[1.5rem] py-5 pl-16 pr-8 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-bold shadow-sm"
        />
      </div>

      {/* Student Attendance Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const currentStatus = attendance[student.id];
            return (
              <div 
                key={student.id} 
                className={`bg-white p-5 rounded-[2rem] border transition-all duration-300 flex items-center justify-between gap-4 ${
                  currentStatus ? 'border-slate-100 shadow-sm' : 'border-slate-100 border-dashed opacity-70'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-colors ${
                    currentStatus === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                    currentStatus === 'Absent' ? 'bg-rose-50 text-rose-600' :
                    currentStatus === 'Late' ? 'bg-amber-50 text-amber-600' :
                    'bg-slate-50 text-slate-400'
                  }`}>
                    {student.first_name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">{student.first_name} {student.last_name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">ID: {student.admission_number}</p>
                  </div>
                </div>

                <div className="flex gap-1.5 flex-shrink-0 bg-slate-50 p-1.5 rounded-2xl">
                  {(['Present', 'Absent', 'Late'] as AttendanceStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(student.id, status)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        currentStatus === status
                          ? status === 'Present' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' :
                            status === 'Absent' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' :
                            'bg-amber-500 text-white shadow-lg shadow-amber-200'
                          : 'bg-transparent text-slate-400 hover:bg-white hover:text-slate-600'
                      }`}
                      title={status}
                    >
                      {status === 'Present' ? <CheckCircle2 className="w-4 h-4" /> :
                       status === 'Absent' ? <XCircle className="w-4 h-4" /> :
                       <Clock className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Attendance;
