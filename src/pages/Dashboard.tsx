import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  Activity,
  Clock,
  UserPlus,
  CalendarCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({ ...prev, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }));
    }, 1000);

    const fetchStats = async () => {
      const { data: students } = await supabase
        .from('students')
        .select('gender');

      if (students) {
        const total = students.length;
        const male = students.filter(s => s.gender === 'Male').length;
        const female = students.filter(s => s.gender === 'Female').length;
        
        setStats(prev => ({
          ...prev,
          total,
          male,
          female
        }));
      }
    };

    fetchStats();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      {/* Simple Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-black tracking-tighter text-xl italic uppercase">
            <Activity className="w-6 h-6" />
            Dashboard
          </div>
          <p className="text-slate-400 font-medium text-sm">Abhayapura Primary School SMS</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl text-slate-500 text-xs font-bold uppercase tracking-widest">
          <Clock className="w-3.5 h-3.5" />
          {stats.time}
        </div>
      </div>

      {/* Hero Section with Quick Navigation */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 text-white shadow-2xl shadow-indigo-900/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-4xl font-black tracking-tight">System Overview</h2>
            <p className="text-slate-400 font-medium max-w-xs">Manage your student database and track daily attendance.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/students" className="flex items-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-900/40">
              <UserPlus className="w-5 h-5" />
              Students
            </Link>
            <Link to="/attendance" className="flex items-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/40">
              <CalendarCheck className="w-5 h-5" />
              Attendance
            </Link>
          </div>
        </div>
      </div>

      {/* Enrollment Stats - The Core Focus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Card */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em] mb-2">Total Students</p>
            <h3 className="text-7xl font-black text-slate-900 tracking-tighter">{stats.total}</h3>
          </div>
        </div>

        {/* Male Card */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 mx-auto font-black text-2xl italic leading-none">
              M
            </div>
            <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em] mb-2">Male Count</p>
            <h3 className="text-7xl font-black text-slate-900 tracking-tighter">{stats.male}</h3>
            <div className="mt-6 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000" 
                style={{ width: `${stats.total > 0 ? (stats.male / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Female Card */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-6 mx-auto font-black text-2xl italic leading-none">
              F
            </div>
            <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em] mb-2">Female Count</p>
            <h3 className="text-7xl font-black text-slate-900 tracking-tighter">{stats.female}</h3>
            <div className="mt-6 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 transition-all duration-1000" 
                style={{ width: `${stats.total > 0 ? (stats.female / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
