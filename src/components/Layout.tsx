import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  GraduationCap, 
  FileBarChart,
  School,
  ChevronRight,
  UserCircle
} from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
    { name: 'Grades', href: '/grades', icon: GraduationCap },
    { name: 'Reports', href: '/reports', icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex-shrink-0 flex flex-col sticky top-0 h-screen shadow-2xl z-40">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <School className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg leading-none tracking-tight">T/Abhayapura</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Primary School</p>
          </div>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className={`text-sm font-bold ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform duration-300`}>
                    {item.name}
                  </span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-indigo-300" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Summary */}
        <div className="p-6 m-4 bg-slate-800/50 rounded-[2rem] border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
              <UserCircle className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-100 uppercase tracking-wider">Admin Panel</p>
              <p className="text-[10px] font-bold text-slate-500 italic">Connected Securely</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 flex items-center px-10 justify-between">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <School className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
              {navigation.find(n => n.href === location.pathname)?.name || 'System Overview'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-black text-slate-900 tracking-tight">Main Office</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">T/Abhayapura</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-100 hidden md:block"></div>
            <button className="flex items-center gap-3 pl-2 pr-5 py-1.5 bg-slate-50 border border-slate-100 rounded-full hover:bg-slate-100 transition-all group">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform">
                A
              </div>
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Sign Out</span>
            </button>
          </div>
        </header>

        <main className="p-10 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
