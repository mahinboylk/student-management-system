import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Download, Users, Calendar, Award } from 'lucide-react';

const Reports: React.FC = () => {
  const [reportStats, setReportStats] = useState({
    totalStudents: 0,
    attendanceRate: 0,
    topPerformers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
      const { data: attendanceData } = await supabase.from('attendance').select('status');
      
      const present = attendanceData?.filter(a => a.status === 'Present').length || 0;
      const rate = attendanceData && attendanceData.length > 0 ? (present / attendanceData.length) * 100 : 0;

      setReportStats({
        totalStudents: studentCount || 0,
        attendanceRate: Math.round(rate),
        topPerformers: 0 // Mock
      });
    };

    fetchStats();
  }, []);

  const reportTypes = [
    { name: 'Student Enrollment Overview', icon: Users, description: 'Summary of all registered students by gender and date of entry.' },
    { name: 'Monthly Attendance Summary', icon: Calendar, description: 'Detailed view of attendance trends for the current month.' },
    { name: 'Academic Performance Report', icon: Award, description: 'Aggregated grade data across all subjects and terms.' },
    { name: 'Guardian Contact Directory', icon: FileText, description: 'Quick-access list of all guardians and their contact details.' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Enrollment</p>
          <p className="text-3xl font-bold text-gray-900">{reportStats.totalStudents}</p>
          <div className="mt-2 text-xs text-green-600 font-medium">↑ 4% from last term</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Average Attendance</p>
          <p className="text-3xl font-bold text-gray-900">{reportStats.attendanceRate}%</p>
          <div className="mt-2 text-xs text-blue-600 font-medium">Target: 95%</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Top Performers (A Grade)</p>
          <p className="text-3xl font-bold text-gray-900">24</p>
          <div className="mt-2 text-xs text-purple-600 font-medium">8 new this term</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Administrative Reports</h3>
          <p className="text-sm text-gray-500">Select a report type to generate a PDF or Excel summary.</p>
        </div>
        <div className="divide-y divide-gray-200">
          {reportTypes.map((report) => (
            <div key={report.name} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                  <report.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{report.name}</h4>
                  <p className="text-xs text-gray-500">{report.description}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-bold border border-blue-100 transition-colors">
                <Download className="w-4 h-4" />
                Generate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
