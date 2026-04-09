import React, { useState, useEffect } from 'react';
import { LogIn, ShieldCheck, User, Briefcase, FileText, LayoutDashboard, Users, Settings, LogOut, Printer, PlusCircle, Trash2, Edit, X, Camera, PenTool, Download, Upload, AlertTriangle, Send } from 'lucide-react';

type Role = string | null;

interface RoleItem {
  id: number;
  name: string;
  slug: string;
  name_bn: string;
  description: string;
  permissions?: string;
  status: 'Active' | 'Inactive';
}

const STATUS_CONFIG: Record<string, { label: string, color: string }> = {
  'Submitted': { label: 'দাখিলকৃত', color: 'bg-gray-400' },
  'Forwarded for Approval': { label: 'অনুমোদনের জন্য প্রেরিত', color: 'bg-indigo-500' },
  'In Progress': { label: 'চলমান', color: 'bg-yellow-500' },
  'Done': { label: 'সম্পন্ন', color: 'bg-green-500' },
  'প্রক্রিয়াধীন রয়েছে': { label: 'প্রক্রিয়াধীন রয়েছে', color: 'bg-yellow-500' },
  'নথিতে উপস্থাপন করা হয়েছে': { label: 'নথিতে উপস্থাপন করা হয়েছে', color: 'bg-blue-500' },
  'সম্পন্ন': { label: 'সম্পন্ন', color: 'bg-green-500' }
};

const AVAILABLE_FEATURES = [
  { id: 'dashboard', name: 'ড্যাশবোর্ড' },
  { id: 'application_form', name: 'আবেদন ফরম' },
  { id: 'application_history', name: 'আবেদনের ইতিহাস' },
  { id: 'received_applications', name: 'আগত আবেদনসমূহ' },
  { id: 'assigned_applications', name: 'অ্যাসাইনকৃত আবেদন' },
  { id: 'user_management', name: 'ইউজার ম্যানেজমেন্ট' },
  { id: 'role_management', name: 'রোল ম্যানেজমেন্ট' },
  { id: 'division_management', name: 'বিভাগ ম্যানেজমেন্ট' },
  { id: 'profile', name: 'প্রোফাইল' },
  { id: 'reports', name: 'রিপোর্ট' },
  { id: 'settings', name: 'সেটিংস' },
];

interface UserData {
  name: string;
  name_bn: string;
  email: string;
  role: Role;
  division?: string;
  photo?: string;
  signature?: string;
  permissions?: string[];
}

export default function App() {
  const [user, setUser] = useState<UserData | null>(() => {
    const savedUser = localStorage.getItem('ugc_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ugc_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ugc_user');
    }
  }, [user]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'application_form' | 'user_management' | 'division_management' | 'role_management' | 'my_applications' | 'all_applications' | 'system_settings' | 'profile' | 'received_applications' | 'assigned_applications'>('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-[#1a3a6b] p-8 text-center">
            <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg p-3">
              <img src="/UGC_Logo_1.png" alt="UGC Logo" className="max-w-full max-h-full object-contain" />
            </div>
            <h1 className="text-white text-2xl font-bold font-[Nikosh]">বাংলাদেশ বিশ্ববিদ্যালয় মঞ্জুরী কমিশন</h1>
            <p className="text-blue-100 text-sm mt-1">আইটি সেবা অনুরোধ সিস্টেম (Preview)</p>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">ইমেইল (Email)</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">পাসওয়ার্ড (Password)</label>
                <div className="relative">
                  <LogIn className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-[#1a3a6b] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
              >
                {loading ? 'প্রসেসিং...' : 'লগইন করুন'}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                পাসওয়ার্ড ভুলে গেলে আইসিটি বিভাগের সাথে যোগাযোগ করুন।
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="bg-[#1a3a6b] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 shadow-md p-1.5">
                  <img src="/UGC_Logo_1.png" alt="UGC Logo" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="hidden md:block">
                  <h1 className="font-bold text-sm leading-tight font-[Nikosh]">বাংলাদেশ বিশ্ববিদ্যালয় মঞ্জুরী কমিশন</h1>
                  <p className="text-[10px] text-blue-200">IT Service Request System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-semibold">স্বাগতম, {user.name_bn}</span>
                <span className="text-[10px] text-blue-200 uppercase">{user.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 p-2 rounded-lg text-white transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">প্রধান মেনু</p>
              
              {user.permissions?.includes('dashboard') && (
                <SidebarLink 
                  icon={<LayoutDashboard />} 
                  label={user.role === 'admin' ? "অ্যাডমিন ড্যাশবোর্ড" : (user.role?.startsWith('desk_officer_') ? "অ্যাসাইনকৃত আবেদন" : "ড্যাশবোর্ড")} 
                  active={currentView === 'dashboard'} 
                  onClick={() => setCurrentView('dashboard')} 
                />
              )}
              {user.permissions?.includes('application_form') && (
                <SidebarLink icon={<PlusCircle />} label="আবেদন ফর্ম" active={currentView === 'application_form'} onClick={() => setCurrentView('application_form')} />
              )}
              {user.permissions?.includes('application_history') && (
                <SidebarLink 
                  icon={<FileText />} 
                  label={user.role === 'admin' ? "সকল আবেদন" : (user.role?.startsWith('desk_officer_') ? "আবেদন হিস্টোরি" : "দাখিলকৃত আবেদনসমূহ")} 
                  active={user.role === 'admin' ? currentView === 'all_applications' : currentView === 'my_applications'} 
                  onClick={() => setCurrentView(user.role === 'admin' ? 'all_applications' : 'my_applications')} 
                />
              )}
              {user.permissions?.includes('received_applications') && (
                <SidebarLink icon={<FileText />} label="আগত আবেদনসমূহ" active={currentView === 'received_applications'} onClick={() => setCurrentView('received_applications')} />
              )}
              {user.role === 'divisional_head' && (
                <SidebarLink icon={<Send />} label="প্রেরিত আবেদনসমূহ" active={currentView === 'forwarded_applications'} onClick={() => setCurrentView('forwarded_applications')} />
              )}
              {user.permissions?.includes('assigned_applications') && !user.role?.startsWith('desk_officer_') && (
                <SidebarLink icon={<ShieldCheck />} label="অ্যাসাইনকৃত আবেদন" active={currentView === 'assigned_applications'} onClick={() => setCurrentView('assigned_applications')} />
              )}
              {user.permissions?.includes('user_management') && (
                <SidebarLink icon={<Users />} label="ইউজার ম্যানেজমেন্ট" active={currentView === 'user_management'} onClick={() => setCurrentView('user_management')} />
              )}
              {user.permissions?.includes('division_management') && (
                <SidebarLink icon={<Briefcase />} label="বিভাগ ম্যানেজমেন্ট" active={currentView === 'division_management'} onClick={() => setCurrentView('division_management')} />
              )}
              {user.permissions?.includes('role_management') && (
                <SidebarLink icon={<ShieldCheck />} label="রোল ম্যানেজমেন্ট" active={currentView === 'role_management'} onClick={() => setCurrentView('role_management')} />
              )}
              {user.permissions?.includes('settings') && (
                <SidebarLink icon={<Settings />} label="সিস্টেম সেটিংস" active={currentView === 'system_settings'} onClick={() => setCurrentView('system_settings')} />
              )}
              {user.permissions?.includes('profile') && (
                <SidebarLink icon={<User />} label="প্রোফাইল" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800">
                  {currentView === 'application_form' ? 'আইটি সেবা ফরম' : 
                   currentView === 'my_applications' ? 'দাখিলকৃত আবেদনসমূহ' :
                   currentView === 'all_applications' ? 'সকল আবেদন' :
                   currentView === 'received_applications' ? 'আগত আবেদনসমূহ' :
                   currentView === 'forwarded_applications' ? 'প্রেরিত আবেদনসমূহ' :
                   currentView === 'assigned_applications' ? 'অ্যাসাইনকৃত আবেদন' :
                   currentView === 'profile' ? 'প্রোফাইল' :
                   (user.role === 'admin' ? 'সিস্টেম ওভারভিউ' : 'আমার ড্যাশবোর্ড')}
                </h2>
                {user.role === 'employee' && currentView === 'dashboard' && (
                  <button onClick={() => setCurrentView('application_form')} className="bg-[#1a3a6b] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-800 transition flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" />
                    নতুন আবেদন
                  </button>
                )}
              </div>
              
              <div className="p-6">
                {currentView === 'application_form' ? <ApplicationForm user={user} /> : 
                 currentView === 'user_management' ? <UserManagement /> :
                 currentView === 'division_management' ? <DivisionManagement /> :
                 currentView === 'role_management' ? <RoleManagement /> :
                 currentView === 'my_applications' ? <ApplicationList user={user} view="my_applications" /> :
                 currentView === 'all_applications' ? <AllApplications user={user} /> :
                 currentView === 'received_applications' ? <ReceivedApplications user={user} /> :
                 currentView === 'forwarded_applications' ? <ForwardedApplications user={user} /> :
                 currentView === 'assigned_applications' ? <ApplicationList user={user} view="assigned_applications" /> :
                 currentView === 'system_settings' ? <SystemSettings /> :
                 currentView === 'profile' ? <Profile user={user} onUpdate={setUser} /> :
                 (user.role === 'admin' ? <AdminDashboard /> : 
                  user.role?.startsWith('desk_officer_') ? <ApplicationList user={user} view="assigned_applications" /> : 
                  <ApplicationList user={user} view="my_applications" />)}
              </div>
            </div>
          </main>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} University Grants Commission of Bangladesh. All rights reserved.</p>
          <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest">Developed by ICT Division, UGC</p>
        </div>
      </footer>
    </div>
  );
}

function AlertModal({ isOpen, message, onClose }: { isOpen: boolean, message: string, onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
        <div className="text-red-500 mb-4 flex justify-center"><AlertTriangle className="w-10 h-10" /></div>
        <p className="text-sm font-bold text-gray-800 mb-6">{message}</p>
        <button onClick={onClose} className="px-6 py-2 bg-[#1a3a6b] text-white rounded-lg text-xs font-bold hover:bg-blue-800">ঠিক আছে</button>
      </div>
    </div>
  );
}

function ConfirmModal({ isOpen, message, onConfirm, onCancel }: { isOpen: boolean, message: string, onConfirm: () => void, onCancel: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
        <p className="text-sm font-bold text-gray-800 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-xs font-bold hover:bg-gray-300">বাতিল</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700">নিশ্চিত</button>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
      {icon && <span className={active ? 'text-blue-600' : 'text-gray-400'}>{icon}</span>}
      {label}
    </button>
  );
}

function ApplicationForm({ user }: { user: UserData }) {
  const [submitted, setSubmitted] = useState(false);
  const [trackingNo, setTrackingNo] = useState('');
  const [formOpenTime] = useState(new Date().toLocaleString('bn-BD'));
  const [formData, setFormData] = useState({
    applicant_name: user.name_bn,
    designation: '',
    division: user.division || '',
    mobile: '',
    service_type: [] as string[],
    problem_details: ''
  });

  if (!user.signature) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5" />
        <div>
          <p className="font-bold">সতর্কতা!</p>
          <p className="text-sm">আবেদন দাখিল করার আগে প্রোফাইলে আপনার স্বাক্ষর আপলোড করুন। স্বাক্ষর ছাড়া আবেদন করা যাবে না।</p>
        </div>
      </div>
    );
  }

  const handleServiceChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      service_type: prev.service_type.includes(service) 
        ? prev.service_type.filter(s => s !== service)
        : [...prev.service_type, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.signature) {
      alert('আবেদন দাখিল করার আগে প্রোফাইলে আপনার স্বাক্ষর আপলোড করুন।');
      return;
    }
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: user.email,
          user_name: user.name_bn,
          division: formData.division,
          designation: formData.designation,
          mobile: formData.mobile,
          service_type: formData.service_type.join(', '),
          problem_details: formData.problem_details,
          applicant_signature: user.signature,
          applicant_signed_at: formOpenTime
        })
      });
      const data = await response.json();
      setTrackingNo(data.tracking_no);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 10000);
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  return (
    <div className="application-form-container overflow-auto max-h-[85vh] p-6 bg-gray-100 rounded-xl relative">
      <style dangerouslySetInnerHTML={{ __html: `
        .form-page { 
          width: 820px; 
          margin: 0 auto; 
          padding: 40px; 
          background: #fff; 
          font-family: "Noto Sans Bengali", "Inter", sans-serif;
          color: #000;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .form-header { position: relative; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 10px; }
        .form-logo { position: absolute; left: 0; top: 0; }
        .form-logo img { height: 85px; }
        .form-hgroup { text-align: center; }
        .form-gov-title { font-family: "Nikosh", sans-serif; font-size: 28px; font-weight: 700; margin-bottom: 0; }
        .form-eng-title { font-size: 16px; font-weight: 700; margin-bottom: 2px; }
        .form-addr { font-size: 12px; margin-bottom: 1px; }
        .form-web { font-size: 12px; font-weight: 700; }
        .form-ref { text-align: right; font-size: 14px; color: #4b2c7e; font-weight: 700; margin-top: 4px; }
        
        .form-title-box { text-align: center; margin: 20px 0; }
        .form-title { font-size: 18px; font-weight: 700; text-decoration: underline; text-underline-offset: 4px; }
        
        .form-border-box { border: 1px solid #000; padding: 20px; margin-bottom: 20px; }
        
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px 30px; margin-bottom: 20px; }
        .info-field { display: flex; align-items: flex-end; gap: 8px; }
        .info-label { font-size: 14px; font-weight: 600; white-space: nowrap; }
        .info-input { flex: 1; border: none; border-bottom: 1px solid #000; font-size: 14px; padding: 2px 5px; outline: none; background: transparent; }
        
        .service-row { margin-bottom: 18px; }
        .service-header { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 700; margin-bottom: 10px; }
        .service-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px 20px; padding-left: 100px; }
        .check-item { display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer; transition: opacity 0.2s; }
        .check-item:hover { opacity: 0.7; }
        .check-box { width: 16px; height: 16px; border: 1px solid #000; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; transition: all 0.2s; }
        .check-item input:checked + .check-box { background: #1a3a6b; border-color: #1a3a6b; }
        .check-item input:checked + .check-box::after { content: '✓'; color: #fff; font-size: 12px; font-weight: bold; }
        
        .problem-section { display: flex; gap: 12px; margin-top: 25px; }
        .problem-label { font-size: 14px; font-weight: 700; white-space: nowrap; padding-top: 5px; }
        .problem-textarea { flex: 1; border: 1px solid #000; min-height: 80px; padding: 10px; font-size: 14px; resize: none; outline: none; }
        
        .sig-row { display: flex; justify-content: space-between; margin-top: 50px; }
        .sig-line { border-top: 1px solid #000; text-align: center; font-size: 13px; font-weight: 700; width: 42%; padding-top: 6px; }
        
        .ict-section { margin-top: 25px; }
        .ict-title { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
        .ict-box { border: 1px solid #000; padding: 25px; }
        .ict-sig-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; margin-bottom: 35px; }
        .ict-sig-item { border-top: 1px solid #000; text-align: center; font-size: 12px; font-weight: 700; padding-top: 6px; }
      `}} />
      
      <div className="form-page">
        {/* Header */}
        <div className="form-header">
          <div className="form-logo">
            <img src="/UGC_Logo_1.png" alt="UGC Logo" className="h-24 w-auto object-contain" />
          </div>
          <div className="form-hgroup">
            <div className="form-gov-title">বাংলাদেশ বিশ্ববিদ্যালয় মঞ্জুরী কমিশন</div>
            <div className="form-eng-title">University Grants Commission of Bangladesh</div>
            <div className="form-addr">আগারগাঁও, শেরে বাংলা নগর, ঢাকা-১২০৭</div>
            <div className="form-web">website: www.ugc.gov.bd</div>
          </div>
          <div className="form-ref">আইটিএসএফ: ২০২৬/{trackingNo ? trackingNo.split('-')[2] : '____'}</div>
        </div>

        <div className="form-title-box">
          <div className="form-title">আইটি সেবা ফরম</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-border-box">
            <div className="info-grid">
              <div className="info-field"><span className="info-label">আবেদনকারীর নাম:</span><input className="info-input" type="text" value={formData.applicant_name} onChange={e => setFormData({...formData, applicant_name: e.target.value})} required /></div>
              <div className="info-field"><span className="info-label">পদবী:</span><input className="info-input" type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} required /></div>
              <div className="info-field"><span className="info-label">বিভাগ/দপ্তর:</span><input className="info-input" type="text" value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})} required /></div>
              <div className="info-field"><span className="info-label">মোবাইল:</span><input className="info-input" type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} required /></div>
            </div>

            <div className="space-y-6">
              {/* Hardware */}
              <div className="service-row">
                <div className="service-header">
                  <span>সেবার ধরণ:</span>
                  <span>হার্ডওয়্যার সংক্রান্ত সেবা ➜</span>
                  <label className="check-item"><input type="checkbox" className="hidden" onChange={() => handleServiceChange('হার্ডওয়্যার - নতুন সরবরাহ')} /><div className="check-box"></div> নতুন সরবরাহ</label>
                  <label className="check-item"><input type="checkbox" className="hidden" onChange={() => handleServiceChange('হার্ডওয়্যার - মেরামত/সেবা প্রদান')} /><div className="check-box"></div> মেরামত/সেবা প্রদান</label>
                </div>
                <div className="service-grid">
                  {['সিপিইউ', 'প্রিন্টার/টোনার', 'ল্যাপটপ', 'ইউপিএস', 'মনিটর', 'স্ক্যানার', 'ট্যাব', 'অন্যান্য'].map(item => (
                    <label key={item} className="check-item"><input type="checkbox" className="hidden" onChange={() => handleServiceChange(`হার্ডওয়্যার - ${item}`)} /><div className="check-box"></div> {item}</label>
                  ))}
                </div>
              </div>

              {/* Network */}
              <div className="service-row">
                <div className="service-header">
                  <span className="invisible">সেবার ধরণ:</span>
                  <span>নেটওয়ার্ক সংক্রান্ত সেবা ➜</span>
                  <label className="check-item"><input type="checkbox" className="hidden" onChange={() => handleServiceChange('নেটওয়ার্ক - নতুন সরবরাহ')} /><div className="check-box"></div> নতুন সরবরাহ</label>
                  <label className="check-item"><input type="checkbox" className="hidden" onChange={() => handleServiceChange('নেটওয়ার্ক - মেরামত/সেবা প্রদান')} /><div className="check-box"></div> মেরামত/সেবা প্রদান</label>
                </div>
                <div className="service-grid">
                  {['ল্যান', 'অডিও ভিজ্যুয়াল সাপোর্ট', 'সিসিটিভি সার্ভেইল্যান্স', 'আইপি ফোন', 'ওয়াইফাই', 'হাইব্রিড সভা', 'এক্সেস কন্ট্রোল', 'অন্যান্য'].map(item => (
                    <label key={item} className="check-item"><input type="checkbox" className="hidden" onChange={() => handleServiceChange(`নেটওয়ার্ক - ${item}`)} /><div className="check-box"></div> {item}</label>
                  ))}
                </div>
              </div>

              {/* Software */}
              <div className="service-row">
                <div className="service-header">
                  <span className="invisible">সেবার ধরণ:</span>
                  <span>সফটওয়্যার সংক্রান্ত সেবা ➜</span>
                  <label className="check-item"><input type="checkbox" className="hidden" onChange={() => handleServiceChange('সফটওয়্যার - নতুন সরবরাহ')} /><div className="check-box"></div> নতুন সরবরাহ</label>
                  <label className="check-item"><input type="checkbox" className="hidden" onChange={() => handleServiceChange('সফটওয়্যার - মেরামত/সেবা প্রদান')} /><div className="check-box"></div> মেরামত/সেবা প্রদান</label>
                </div>
                <div className="service-grid">
                  {['ডি-নথি', 'ই-মেইল', 'ই-জিপি', 'ইনফো', 'ওয়েবসাইট', 'এন্টিভাইরাস', 'জিআরপি', 'অন্যান্য'].map(item => (
                    <label key={item} className="check-item"><input type="checkbox" className="hidden" onChange={() => handleServiceChange(`সফটওয়্যার - ${item}`)} /><div className="check-box"></div> {item}</label>
                  ))}
                </div>
              </div>

              {/* System Maintenance */}
              <div className="service-row">
                <div className="service-header">
                  <span className="invisible">সেবার ধরণ:</span>
                  <span>সিস্টেম মেইনটেন্যান্স ➜</span>
                  <label className="check-item"><input type="checkbox" className="hidden" onChange={() => handleServiceChange('সিস্টেম মেইনটেন্যান্স - নতুন সরবরাহ')} /><div className="check-box"></div> নতুন সরবরাহ</label>
                  <label className="check-item"><input type="checkbox" className="hidden" onChange={() => handleServiceChange('সিস্টেম মেইনটেন্যান্স - মেরামত/সেবা প্রদান')} /><div className="check-box"></div> মেরামত/সেবা প্রদান</label>
                </div>
                <div className="service-grid">
                  {['ডিজিটাল ডিসপ্লে', 'ওয়েবসাইটে তথ্য আপলোড', 'সার্ভার মেইনটেন্যান্স', 'অন্যান্য'].map(item => (
                    <label key={item} className="check-item"><input type="checkbox" className="hidden" onChange={() => handleServiceChange(`সিস্টেম মেইনটেন্যান্স - ${item}`)} /><div className="check-box"></div> {item}</label>
                  ))}
                </div>
              </div>
            </div>

            <div className="problem-section">
              <span className="problem-label">সমস্যার বিবরণ :</span>
              <textarea className="problem-textarea" value={formData.problem_details} onChange={e => setFormData({...formData, problem_details: e.target.value})}></textarea>
            </div>

            <div className="sig-row">
              <div className="sig-line relative">
                {user.signature && (
                  <img src={user.signature} alt="Signature" className="absolute bottom-full left-1/2 -translate-x-1/2 h-6 mb-2" />
                )}
                <div className="text-[10px] text-gray-500 mb-1">{formOpenTime}</div>
                আবেদনকারীর স্বাক্ষর ও তারিখ
              </div>
              <div className="sig-line">সংশ্লিষ্ট বিভাগীয় প্রধানের স্বাক্ষর ও তারিখ</div>
            </div>
          </div>

          <div className="ict-section">
            <div className="ict-title">আইসিটি বিভাগ কর্তৃক পূরণীয়:</div>
            <div className="ict-box">
              <div className="ict-sig-grid">
                {['দায়িত্বপ্রাপ্ত কর্মকর্তার স্বাক্ষর', 'উপ-পরিচালক', 'অতিরিক্ত পরিচালক', 'পরিচালক'].map(role => (
                  <div key={role} className="ict-sig-item">{role}</div>
                ))}
              </div>
              
              <div className="info-grid">
                <div className="info-field"><span className="info-label">সেবা প্রদানকারীর নাম:</span><input className="info-input" type="text" /></div>
                <div className="info-field"><span className="info-label">পদবী:</span><input className="info-input" type="text" /></div>
              </div>
              
              <div className="problem-section mt-4">
                <span className="problem-label">সেবা প্রদান সংক্রান্ত তথ্য :</span>
                <textarea className="problem-textarea" style={{ minHeight: '60px' }}></textarea>
              </div>

              <div className="sig-row mt-10">
                <div className="sig-line">সেবা প্রদানকারীর স্বাক্ষর ও তারিখ</div>
                <div className="sig-line">সেবা গ্রহণকারীর/পক্ষের স্বাক্ষর ও তারিখ</div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center no-print">
            <button type="submit" className="bg-[#1a3a6b] text-white px-16 py-4 rounded-xl font-bold shadow-xl hover:bg-blue-800 transition-all flex items-center gap-3 text-lg">
              <ShieldCheck className="w-6 h-6" /> আবেদন দাখিল করুন (Submit Application)
            </button>
          </div>
        </form>

        {submitted && (
          <div className="fixed bottom-10 right-10 bg-green-600 text-white px-8 py-5 rounded-2xl shadow-2xl animate-bounce flex items-center gap-4 z-[100] border-2 border-white">
            <ShieldCheck className="w-8 h-8" />
            <div>
              <p className="font-bold text-lg">সফলভাবে দাখিল করা হয়েছে!</p>
              <p className="text-sm opacity-90">আপনার ট্র্যাকিং নম্বর: <span className="font-mono font-black underline">{trackingNo}</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    inProgressApplications: 0,
    resolvedApplications: 0,
    totalUsers: 0,
    totalRoles: 0
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats({
        totalApplications: data.totalApplications,
        inProgressApplications: data.inProgressApplications,
        resolvedApplications: data.resolvedApplications,
        totalUsers: data.totalUsers,
        totalRoles: data.totalRoles
      }))
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="মোট আবেদন" value={stats.totalApplications.toString()} color="blue" />
        <StatCard label="চলমান" value={stats.inProgressApplications.toString()} color="yellow" />
        <StatCard label="সম্পন্ন" value={stats.resolvedApplications.toString()} color="green" />
        <StatCard label="মোট ইউজার" value={stats.totalUsers.toString()} color="purple" />
        <StatCard label="মোট রোল" value={stats.totalRoles.toString()} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/30">
          <h3 className="text-sm font-bold text-gray-700 mb-4">সেবার ধরণ অনুযায়ী আবেদন</h3>
          <div className="h-48 flex items-end justify-around px-4">
            <Bar height="80%" label="হার্ডওয়্যার" color="#1a3a6b" />
            <Bar height="45%" label="নেটওয়ার্ক" color="#3b82f6" />
            <Bar height="30%" label="সফটওয়্যার" color="#93c5fd" />
          </div>
        </div>
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/30">
          <h3 className="text-sm font-bold text-gray-700 mb-4">সাম্প্রতিক কার্যক্রম</h3>
          <div className="space-y-3">
            <ActivityItem trackingNo="ITSF-2026-0001" user="মারুফ আলম" status="Done" />
            <ActivityItem trackingNo="ITSF-2026-0002" user="নাসরিন সুলতানা" status="In Progress" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: string, color: string }) {
  const colors: Record<string, string> = {
    blue: 'border-blue-500 text-blue-600 bg-blue-50/50',
    yellow: 'border-yellow-500 text-yellow-600 bg-yellow-50/50',
    green: 'border-green-500 text-green-600 bg-green-50/50',
    purple: 'border-purple-500 text-purple-600 bg-purple-50/50'
  };
  return (
    <div className={`p-5 rounded-xl border-l-4 shadow-sm ${colors[color]}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  );
}

function Bar({ height, label, color }: { height: string, label: string, color: string }) {
  return (
    <div className="flex flex-col items-center gap-2 w-16">
      <div className="w-full rounded-t-lg transition-all duration-500" style={{ height, backgroundColor: color }}></div>
      <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap">{label}</span>
    </div>
  );
}

function ActivityItem({ trackingNo, user, status }: { trackingNo: string, user: string, status: string }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-400' };
  return (
    <div className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100">
      <div>
        <p className="text-xs font-bold text-blue-700">{trackingNo}</p>
        <p className="text-[10px] text-gray-500">{user}</p>
      </div>
      <span className={`px-2 py-0.5 text-[9px] font-bold text-white rounded-full ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
}

interface Application {
  id: number;
  tracking_no: string;
  user_email: string;
  user_name: string;
  division: string;
  designation?: string;
  mobile?: string;
  service_type: string;
  problem_details: string;
  status: string;
  submission_date: string;
  applicant_signature?: string;
  applicant_signed_at?: string;
  div_head_signature?: string;
  div_head_signed_at?: string;
  div_head_email?: string;
  officer_signature?: string;
  officer_signed_at?: string;
  officer_name?: string;
}

function ReceivedApplications({ user }: { user: UserData }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [alertMessage, setAlertMessage] = useState('');

  const fetchApps = async () => {
    try {
      const response = await fetch('/api/applications');
      const data = await response.json();
      const filtered = data.filter((app: Application) => app.division === user.division && app.status === 'Submitted' && app.user_email !== user.email);
      setApplications(filtered);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [user.division]);

  const handleApprove = async (appId: number, status: string = 'Forwarded for Approval') => {
    if (!user.signature) {
      setAlertMessage('আবেদন অনুমোদন/বাতিল করার আগে প্রোফাইলে আপনার স্বাক্ষর আপলোড করুন।');
      return;
    }
    try {
      await fetch('/api/applications/approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: appId,
          status,
          div_head_email: user.email,
          div_head_signature: user.signature,
          div_head_signed_at: new Date().toLocaleString('bn-BD')
        })
      });
      fetchApps();
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500 text-xs">লোড হচ্ছে...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead>
          <tr className="bg-gray-50/50">
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">ট্র্যাকিং নম্বর</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">আবেদনকারী</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">সেবার ধরণ</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-4 text-xs font-bold text-blue-600">{app.tracking_no}</td>
              <td className="px-4 py-4 text-xs text-gray-600">{app.user_name}</td>
              <td className="px-4 py-4 text-xs text-gray-500">{app.service_type}</td>
              <td className="px-4 py-4 text-right space-x-2">
                <button 
                  onClick={() => setSelectedApp(app)}
                  className="text-[#1a3a6b] hover:text-blue-900 text-xs font-bold"
                >
                  দেখুন
                </button>
                <button 
                  onClick={() => handleApprove(app.id, 'Forwarded for Approval')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-[10px] font-bold hover:bg-green-700"
                >
                  অনুমোদন করুন
                </button>
                <button 
                  onClick={() => handleApprove(app.id, 'Rejected by Divisional Head')}
                  className="bg-red-600 text-white px-3 py-1 rounded text-[10px] font-bold hover:bg-red-700"
                >
                  বাতিল করুন
                </button>
              </td>
            </tr>
          ))}
          {applications.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-gray-400 text-xs italic">কোন নতুন আবেদন নেই</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedApp && (
        <ApplicationViewModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
      <AlertModal isOpen={!!alertMessage} message={alertMessage} onClose={() => setAlertMessage('')} />
    </div>
  );
}

function ForwardedApplications({ user }: { user: UserData }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchApps = async () => {
    try {
      const response = await fetch('/api/applications');
      const data = await response.json();
      const filtered = data.filter((app: Application) => app.div_head_email === user.email && (app.status === 'Forwarded for Approval' || app.status === 'Rejected by Divisional Head' || app.status === 'In Progress' || app.status === 'Done'));
      setApplications(filtered);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [user.email]);

  if (loading) return <div className="text-center py-10 text-gray-500 text-xs">লোড হচ্ছে...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead>
          <tr className="bg-gray-50/50">
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">ট্র্যাকিং নম্বর</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">আবেদনকারী</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">সেবার ধরণ</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">অবস্থা</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-4 text-xs font-bold text-blue-600">{app.tracking_no}</td>
              <td className="px-4 py-4 text-xs text-gray-600">{app.user_name}</td>
              <td className="px-4 py-4 text-xs text-gray-500">{app.service_type}</td>
              <td className="px-4 py-4">
                <span className={`px-2 py-0.5 text-[9px] font-bold text-white rounded-full ${STATUS_CONFIG[app.status]?.color || 'bg-gray-400'}`}>
                  {STATUS_CONFIG[app.status]?.label || app.status}
                </span>
              </td>
              <td className="px-4 py-4 text-right space-x-2">
                <button 
                  onClick={() => setSelectedApp(app)}
                  className="text-[#1a3a6b] hover:text-blue-900 text-xs font-bold"
                >
                  দেখুন
                </button>
              </td>
            </tr>
          ))}
          {applications.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-xs italic">কোন প্রেরিত আবেদন নেই</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedApp && (
        <ApplicationViewModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </div>
  );
}

function ApplicationViewModal({ app, onClose }: { app: Application, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-[#1a3a6b] px-6 py-4 flex justify-between items-center shrink-0">
          <h3 className="text-white font-bold text-sm">আবেদনের বিস্তারিত</h3>
          <div className="flex items-center gap-4">
            <button onClick={() => window.print()} className="text-white hover:text-gray-200 flex items-center gap-2 text-xs font-bold">
              <Printer className="w-4 h-4" /> প্রিন্ট
            </button>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-8 overflow-auto flex-1 bg-gray-50">
          <div className="bg-white p-10 shadow-sm border border-gray-200 mx-auto w-[800px] min-h-[1000px] relative font-[Inter]">
            {/* Header */}
            <div className="flex justify-between border-bottom-2 border-black pb-4 mb-6">
              <img src="/UGC_Logo_1.png" alt="Logo" className="h-20" />
              <div className="text-center flex-1">
                <h1 className="text-2xl font-bold font-[Nikosh]">বাংলাদেশ বিশ্ববিদ্যালয় মঞ্জুরী কমিশন</h1>
                <p className="text-sm font-bold">University Grants Commission of Bangladesh</p>
                <p className="text-xs">আগারগাঁও, শেরে বাংলা নগর, ঢাকা-১২০৭</p>
                <p className="text-xs font-bold">website: www.ugc.gov.bd</p>
              </div>
              <div className="text-right text-xs text-purple-800 font-bold">
                আইটিএসএফ: ২০২৬/{app.tracking_no.split('-')[2]}
              </div>
            </div>

            <h2 className="text-center text-lg font-bold underline mb-8">আইটি সেবা ফরম</h2>

            <div className="border border-black p-6 space-y-6">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="flex gap-2"><b>আবেদনকারীর নাম:</b> <span className="border-b border-black flex-1">{app.user_name}</span></div>
                <div className="flex gap-2"><b>পদবী:</b> <span className="border-b border-black flex-1">{app.designation}</span></div>
                <div className="flex gap-2"><b>বিভাগ/দপ্তর:</b> <span className="border-b border-black flex-1">{app.division}</span></div>
                <div className="flex gap-2"><b>মোবাইল:</b> <span className="border-b border-black flex-1">{app.mobile}</span></div>
              </div>

              <div>
                <p className="text-sm font-bold mb-2">সেবার ধরণ:</p>
                <div className="border border-black rounded overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 border-b border-black">
                      <tr>
                        <th className="px-4 py-2 font-bold border-r border-black w-1/4">ক্যাটাগরি</th>
                        <th className="px-4 py-2 font-bold border-r border-black w-1/4 text-center">নতুন সরবরাহ</th>
                        <th className="px-4 py-2 font-bold border-r border-black w-1/4 text-center">মেরামত/সেবা প্রদান</th>
                        <th className="px-4 py-2 font-bold w-1/4">সেবাসমূহ (আইটেম)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black">
                      {['হার্ডওয়্যার', 'নেটওয়ার্ক', 'সফটওয়্যার', 'সিস্টেম মেইনটেন্যান্স'].map(category => {
                        const isNew = app.service_type.includes(`${category} - নতুন সরবরাহ`);
                        const isRepair = app.service_type.includes(`${category} - মেরামত/সেবা প্রদান`);
                        const items = app.service_type.split(', ')
                          .filter(s => s.startsWith(`${category} - `) && !s.includes('নতুন সরবরাহ') && !s.includes('মেরামত/সেবা প্রদান'))
                          .map(s => s.replace(`${category} - `, ''));
                        
                        if (!isNew && !isRepair && items.length === 0) return null;

                        return (
                          <tr key={category}>
                            <td className="px-4 py-2 border-r border-black font-semibold">{category}</td>
                            <td className="px-4 py-2 border-r border-black text-center font-bold text-lg">{isNew ? '✓' : ''}</td>
                            <td className="px-4 py-2 border-r border-black text-center font-bold text-lg">{isRepair ? '✓' : ''}</td>
                            <td className="px-4 py-2">
                              {items.join(', ')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold mb-1">সমস্যার বিবরণ :</p>
                <div className="border border-black p-3 min-h-[100px] text-sm">
                  {app.problem_details}
                </div>
              </div>

              <div className="flex justify-between mt-12 pt-10">
                <div className="text-center w-[45%] border-t border-black pt-2 relative">
                  {app.applicant_signature && (
                    <img src={app.applicant_signature} alt="Signature" className="absolute bottom-full left-1/2 -translate-x-1/2 h-6 mb-2" />
                  )}
                  <p className="text-[10px] text-gray-500">{app.applicant_signed_at}</p>
                  <p className="text-xs font-bold">আবেদনকারীর স্বাক্ষর ও তারিখ</p>
                </div>
                <div className="text-center w-[45%] border-t border-black pt-2 relative">
                  {app.div_head_signature && (
                    <img src={app.div_head_signature} alt="Signature" className="absolute bottom-full left-1/2 -translate-x-1/2 h-6 mb-2" />
                  )}
                  <p className="text-[10px] text-gray-500">{app.div_head_signed_at}</p>
                  <p className="text-xs font-bold">সংশ্লিষ্ট বিভাগীয় প্রধানের স্বাক্ষর ও তারিখ</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-bold mb-2">আইসিটি বিভাগ কর্তৃক পূরণীয়:</p>
              <div className="border border-black p-6">
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="border-t border-black text-center text-[10px] font-bold pt-1 relative">
                    {app.officer_signature && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 flex flex-col items-center">
                        <img src={app.officer_signature} alt="Officer Signature" className="h-8 object-contain" />
                        <span className="text-[8px] font-normal whitespace-nowrap">{app.officer_signed_at}</span>
                      </div>
                    )}
                    দায়িত্বপ্রাপ্ত কর্মকর্তার স্বাক্ষর
                  </div>
                  {['উপ-পরিচালক', 'অতিরিক্ত পরিচালক', 'পরিচালক'].map(role => (
                    <div key={role} className="border-t border-black text-center text-[10px] font-bold pt-1">{role}</div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                  <div className="flex gap-2"><b>সেবা প্রদানকারীর নাম:</b> <span className="border-b border-black flex-1">{app.officer_name}</span></div>
                  <div className="flex gap-2"><b>পদবী:</b> <span className="border-b border-black flex-1"></span></div>
                </div>
                <div className="text-xs">
                  <b>সেবা প্রদান সংক্রান্ত তথ্য :</b>
                  <div className="border border-black min-h-[60px] mt-1"></div>
                </div>
                <div className="flex justify-between mt-10">
                  <div className="text-center w-[45%] border-t border-black pt-1 text-[10px] font-bold">সেবা প্রদানকারীর স্বাক্ষর ও তারিখ</div>
                  <div className="text-center w-[45%] border-t border-black pt-1 text-[10px] font-bold">সেবা গ্রহণকারীর/পক্ষের স্বাক্ষর ও তারিখ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationList({ user, view }: { user: UserData, view: 'my_applications' | 'assigned_applications' }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [alertMessage, setAlertMessage] = useState('');

  const fetchApps = async () => {
    try {
      let url = '/api/applications';
      if (view === 'my_applications') {
        url += `?email=${user.email}`;
      }
      const response = await fetch(url);
      let data = await response.json();
      
      // Filter for Desk Officers in assigned_applications view
      if (view === 'assigned_applications') {
        let keyword = '';
        if (user.role === 'desk_officer_hardware') keyword = 'হার্ডওয়্যার';
        else if (user.role === 'desk_officer_network') keyword = 'নেটওয়ার্ক';
        else if (user.role === 'desk_officer_software') keyword = 'সফটওয়্যার';
        else if (user.role === 'desk_officer_maintenance') keyword = 'সিস্টেম মেইনটেন্যান্স';

        if (keyword) {
          const allowedStatuses = [
            'Forwarded for Approval', 
            'In Progress', 
            'Done', 
            'প্রক্রিয়াধীন রয়েছে', 
            'নথিতে উপস্থাপন করা হয়েছে', 
            'সম্পন্ন'
          ];
          data = data.filter((app: any) => app.service_type.includes(keyword) && allowedStatuses.includes(app.status))
                     .map((app: any) => ({
                       ...app,
                       service_type: app.service_type.split(', ').filter((s: string) => s.includes(keyword)).join(', ')
                     }));
        }
      }
      
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [user.email, user.role]);

  const handleStatusUpdate = async (id: number, status: string) => {
    if (!user.signature) {
      setAlertMessage('স্ট্যাটাস পরিবর্তন করার আগে প্রোফাইলে আপনার স্বাক্ষর আপলোড করুন।');
      return;
    }
    try {
      await fetch(`/api/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status,
          officer_signature: user.signature,
          officer_signed_at: new Date().toLocaleString('bn-BD'),
          officer_name: user.name_bn
        })
      });
      fetchApps();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500 text-xs">লোড হচ্ছে...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead>
          <tr className="bg-gray-50/50">
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">ট্র্যাকিং নম্বর</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">তারিখ</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">সেবার ধরণ</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">অবস্থা</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {applications.map((app) => (
            <ApplicationRow 
              key={app.id} 
              id={app.tracking_no} 
              date={app.submission_date} 
              type={app.service_type} 
              status={app.status} 
              onView={() => setSelectedApp(app)}
              onStatusUpdate={user.role?.startsWith('desk_officer_') ? (status) => handleStatusUpdate(app.id, status) : undefined}
            />
          ))}
          {applications.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-xs italic">কোন আবেদন খুঁজে পাওয়া যায়নি</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedApp && (
        <ApplicationViewModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
      <AlertModal isOpen={!!alertMessage} message={alertMessage} onClose={() => setAlertMessage('')} />
    </div>
  );
}

interface ApplicationRowProps {
  id: string;
  date: string;
  type: string;
  status: string;
  onView: () => void;
  onStatusUpdate?: (status: string) => void;
}

const ApplicationRow: React.FC<ApplicationRowProps> = ({ id, date, type, status, onView, onStatusUpdate }) => {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-400' };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-4 text-xs font-bold text-blue-600">{id}</td>
      <td className="px-4 py-4 text-xs text-gray-500">{date}</td>
      <td className="px-4 py-4 text-xs text-gray-600 min-w-[200px] max-w-[400px]">
        <div className="flex flex-wrap gap-1">
          {type.split(', ').map((t, i) => (
            <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] border border-blue-100">
              {t}
            </span>
          ))}
        </div>
      </td>
      <td className="px-4 py-4">
        {onStatusUpdate ? (
          <select 
            value={status} 
            onChange={(e) => onStatusUpdate(e.target.value)}
            className="text-[10px] font-bold border rounded px-1 py-0.5 bg-white"
          >
            <option value="Forwarded for Approval">অনুমোদনের জন্য প্রেরিত</option>
            <option value="প্রক্রিয়াধীন রয়েছে">প্রক্রিয়াধীন রয়েছে</option>
            <option value="নথিতে উপস্থাপন করা হয়েছে">নথিতে উপস্থাপন করা হয়েছে</option>
            <option value="সম্পন্ন">সম্পন্ন</option>
          </select>
        ) : (
          <span className={`px-2 py-0.5 text-[9px] font-bold text-white rounded-full ${config.color}`}>
            {config.label}
          </span>
        )}
      </td>
      <td className="px-4 py-4 text-right">
        <button 
          onClick={onView}
          className="text-[#1a3a6b] hover:text-blue-900 text-xs font-bold flex items-center gap-1 ml-auto"
        >
          <FileText className="w-3 h-3" /> দেখুন
        </button>
      </td>
    </tr>
  );
}

function Profile({ user, onUpdate }: { user: UserData, onUpdate: (user: UserData) => void }) {
  const [photo, setPhoto] = useState<string | null>(user.photo || null);
  const [signature, setSignature] = useState<string | null>(user.signature || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'signature') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'photo') setPhoto(reader.result as string);
        else setSignature(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, photo, signature }),
      });
      const data = await response.json();
      if (data.success) {
        onUpdate(data.user);
        setMessage('প্রোফাইল সফলভাবে আপডেট করা হয়েছে');
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (type: 'photo' | 'signature') => {
    if (type === 'photo') setPhoto(null);
    else setSignature(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.includes('সফলভাবে') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-md flex items-center justify-center">
                {photo ? (
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-gray-300" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#1a3a6b] text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-800 transition">
                <Camera className="w-4 h-4" />
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />
              </label>
            </div>
            <h3 className="font-bold text-gray-800">{user.name_bn}</h3>
            <p className="text-xs text-gray-500">{user.name}</p>
            <div className="mt-4 pt-4 border-t border-gray-200 text-left space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-400 uppercase font-bold">ইমেইল</span>
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-400 uppercase font-bold">বিভাগ</span>
                <span className="text-gray-600">{user.division || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-400 uppercase font-bold">রোল</span>
                <span className="text-gray-600 capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Photo & Signature Management */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-700 border-b pb-2">ছবি ও স্বাক্ষর ব্যবস্থাপনা</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Photo Upload */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">প্রোফাইল ছবি</label>
                <div className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                  {photo ? (
                    <>
                      <img src={photo} alt="Preview" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button onClick={() => handleRemove('photo')} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-[10px] text-gray-400">ছবি আপলোড করুন</p>
                    </div>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />
                </div>
              </div>

              {/* Signature Upload */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">স্ক্যান করা স্বাক্ষর</label>
                <div className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                  {signature ? (
                    <>
                      <img src={signature} alt="Signature" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button onClick={() => handleRemove('signature')} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <PenTool className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-[10px] text-gray-400">স্বাক্ষর আপলোড করুন</p>
                    </div>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileChange(e, 'signature')} />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-[#1a3a6b] text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-blue-800 transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'সংরক্ষণ করা হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UserAccount {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  division?: string;
  status: 'Active' | 'Inactive';
}

function UserManagement() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchDivisions();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await fetch('/api/divisions');
      const data = await response.json();
      setDivisions(data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    division: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const handleOpenModal = (user?: UserAccount) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: user.password || '',
        role: user.role,
        division: user.division || '',
        status: user.status
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        division: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      division: formData.division,
      status: formData.status
    };

    try {
      if (editingUser) {
        await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (confirmDeleteId) {
      try {
        await fetch(`/api/users/${confirmDeleteId}`, { method: 'DELETE' });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setConfirmDeleteId(null);
      }
    }
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const requiredHeaders = ['name', 'email', 'password', 'role', 'division', 'status'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          alert(`CSV ফাইলে নিম্নলিখিত কলামগুলো অনুপস্থিত: ${missingHeaders.join(', ')}`);
          return;
        }

        const newUsers = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',').map(v => v.trim());
          const user: any = {};
          headers.forEach((header, index) => {
            user[header] = values[index];
          });
          newUsers.push(user);
        }

        // Send to backend
        for (const user of newUsers) {
          await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
          });
        }
        
        fetchUsers();
        alert('সফলভাবে ইউজার ইমপোর্ট করা হয়েছে!');
      } catch (error) {
        console.error('Error importing CSV:', error);
        alert('CSV ইমপোর্ট করার সময় একটি ত্রুটি হয়েছে।');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  if (loading) return <div className="text-center py-10 text-gray-500 text-xs">লোড হচ্ছে...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-700">ইউজার তালিকা</h3>
        <div className="flex gap-2">
          <a 
            href="data:text/csv;charset=utf-8,name,email,password,role,division,status%0AJohn Doe,john@example.com,password123,employee,Administration,Active" 
            download="users_template.csv"
            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition flex items-center gap-2 border border-gray-200"
          >
            <Download className="w-3.5 h-3.5" />
            টেমপ্লেট ডাউনলোড
          </a>
          <label className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-green-700 transition flex items-center gap-2 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            CSV ইমপোর্ট
            <input type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
          </label>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#1a3a6b] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-blue-800 transition flex items-center gap-2"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            নতুন ইউজার যোগ করুন
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">নাম</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">ইমেইল</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">পাসওয়ার্ড</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">রোল</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">বিভাগ</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">অবস্থা</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4 text-xs font-bold text-gray-800">{u.name}</td>
                <td className="px-4 py-4 text-xs text-gray-500">{u.email}</td>
                <td className="px-4 py-4 text-xs text-gray-400 font-mono">{u.password}</td>
                <td className="px-4 py-4 text-xs text-gray-600">{u.role}</td>
                <td className="px-4 py-4 text-xs text-gray-600">{u.division}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 text-[9px] font-bold text-white rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {u.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleOpenModal(u)}
                    className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setConfirmDeleteId(u.id)}
                    className="text-red-600 hover:text-red-800 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal 
        isOpen={!!confirmDeleteId} 
        message="আপনি কি নিশ্চিত যে আপনি এই ইউজারটি মুছতে চান?" 
        onConfirm={handleDelete} 
        onCancel={() => setConfirmDeleteId(null)} 
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#1a3a6b] px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-sm">
                {editingUser ? 'ইউজার এডিট করুন' : 'নতুন ইউজার যোগ করুন'}
              </h3>
              <button onClick={handleCloseModal} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">নাম</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="উদা: মারুফ আলম"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ইমেইল</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="উদা: user@ugc.gov.bd"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">পাসওয়ার্ড</label>
                <input 
                  type="text" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="পাসওয়ার্ড লিখুন"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">রোল</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">রোল নির্বাচন করুন</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.slug}>{r.name} ({r.name_bn})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">বিভাগ</label>
                <select 
                  value={formData.division}
                  onChange={(e) => setFormData({...formData, division: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">বিভাগ নির্বাচন করুন</option>
                  {divisions.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">অবস্থা</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Active">সক্রিয় (Active)</option>
                  <option value="Inactive">নিষ্ক্রিয় (Inactive)</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition"
                >
                  বাতিল
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#1a3a6b] text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition"
                >
                  {editingUser ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AllApplications({ user }: { user: UserData }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error('Error fetching all applications:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500 text-xs">লোড হচ্ছে...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-700">সকল আবেদনের তালিকা</h3>
        <div className="flex gap-2">
          <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500">
            <option>সকল অবস্থা</option>
            <option>দাখিলকৃত</option>
            <option>চলমান</option>
            <option>সম্পন্ন</option>
          </select>
          <button className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition flex items-center gap-2">
            <Printer className="w-3.5 h-3.5" />
            রিপোর্ট ডাউনলোড
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">ট্র্যাকিং নম্বর</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">ইউজার</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">বিভাগ</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">সেবার ধরণ</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">অবস্থা</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4 text-xs font-bold text-blue-600">{app.tracking_no}</td>
                <td className="px-4 py-4 text-xs text-gray-800 font-medium">{app.user_name}</td>
                <td className="px-4 py-4 text-xs text-gray-500">{app.division}</td>
                <td className="px-4 py-4 text-xs text-gray-600 truncate max-w-[150px]">{app.service_type}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 text-[9px] font-bold text-white rounded-full ${STATUS_CONFIG[app.status]?.color || 'bg-gray-400'}`}>
                    {STATUS_CONFIG[app.status]?.label || app.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button 
                    onClick={() => setSelectedApp(app)}
                    className="text-[#1a3a6b] hover:text-blue-900 text-xs font-bold"
                  >
                    ম্যানেজ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedApp && (
        <ApplicationViewModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </div>
  );
}

function SystemSettings() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-4">সাধারণ সেটিংস</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-bold text-gray-800">ইমেইল নোটিফিকেশন</p>
              <p className="text-xs text-gray-500">নতুন টিকিট আসলে ইমেইল পাঠানো হবে</p>
            </div>
            <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-bold text-gray-800">সিস্টেম মেইনটেন্যান্স মোড</p>
              <p className="text-xs text-gray-500">ইউজারদের জন্য সিস্টেম সাময়িক বন্ধ রাখা</p>
            </div>
            <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-4">টিকিট ক্যাটাগরি ম্যানেজমেন্ট</h3>
        <div className="flex flex-wrap gap-2">
          {['হার্ডওয়্যার', 'নেটওয়ার্ক', 'সফটওয়্যার', 'সিস্টেম মেইনটেন্যান্স'].map(cat => (
            <span key={cat} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-2">
              {cat}
              <button className="text-gray-400 hover:text-red-500">×</button>
            </span>
          ))}
          <button className="px-3 py-1.5 border border-dashed border-blue-300 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition">
            + নতুন ক্যাটাগরি
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <button className="bg-[#1a3a6b] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-800 transition">
          পরিবর্তন সংরক্ষণ করুন
        </button>
      </div>
    </div>
  );
}

interface Division {
  id: number;
  name: string;
  head: string;
  employees: number;
  status: 'Active' | 'Inactive';
}

function DivisionManagement() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      const response = await fetch('/api/divisions');
      const data = await response.json();
      setDivisions(data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    employees: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const handleOpenModal = (division?: Division) => {
    if (division) {
      setEditingDivision(division);
      setFormData({
        name: division.name,
        head: division.head,
        employees: division.employees.toString(),
        status: division.status
      });
    } else {
      setEditingDivision(null);
      setFormData({
        name: '',
        head: '',
        employees: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDivision(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      head: formData.head,
      employees: parseInt(formData.employees) || 0,
      status: formData.status
    };

    try {
      if (editingDivision) {
        await fetch(`/api/divisions/${editingDivision.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/divisions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      fetchDivisions();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving division:', error);
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (confirmDeleteId) {
      try {
        await fetch(`/api/divisions/${confirmDeleteId}`, { method: 'DELETE' });
        fetchDivisions();
      } catch (error) {
        console.error('Error deleting division:', error);
      } finally {
        setConfirmDeleteId(null);
      }
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500 text-xs">লোড হচ্ছে...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-700">বিভাগ তালিকা</h3>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#1a3a6b] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-blue-800 transition flex items-center gap-2"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          নতুন বিভাগ যোগ করুন
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">বিভাগের নাম</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">বিভাগীয় প্রধান</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">জনবল</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">অবস্থা</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {divisions.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4 text-xs font-bold text-gray-800">{d.name}</td>
                <td className="px-4 py-4 text-xs text-gray-500">{d.head}</td>
                <td className="px-4 py-4 text-xs text-gray-600">{d.employees} জন</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 text-[9px] font-bold text-white rounded-full ${d.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {d.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleOpenModal(d)}
                    className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setConfirmDeleteId(d.id)}
                    className="text-red-600 hover:text-red-800 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal 
        isOpen={!!confirmDeleteId} 
        message="আপনি কি নিশ্চিত যে আপনি এই বিভাগটি মুছতে চান?" 
        onConfirm={handleDelete} 
        onCancel={() => setConfirmDeleteId(null)} 
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#1a3a6b] px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-sm">
                {editingDivision ? 'বিভাগ এডিট করুন' : 'নতুন বিভাগ যোগ করুন'}
              </h3>
              <button onClick={handleCloseModal} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">বিভাগের নাম</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="উদা: আইসিটি বিভাগ"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">বিভাগীয় প্রধান</label>
                <input 
                  type="text" 
                  required
                  value={formData.head}
                  onChange={(e) => setFormData({...formData, head: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="উদা: পরিচালক (আইসিটি)"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">জনবল (সংখ্যা)</label>
                <input 
                  type="number" 
                  required
                  value={formData.employees}
                  onChange={(e) => setFormData({...formData, employees: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="উদা: ২৫"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">অবস্থা</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Active">সক্রিয় (Active)</option>
                  <option value="Inactive">নিষ্ক্রিয় (Inactive)</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition"
                >
                  বাতিল
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#1a3a6b] text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition"
                >
                  {editingDivision ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function RoleManagement() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    name_bn: '',
    description: '',
    permissions: [] as string[],
    status: 'Active' as 'Active' | 'Inactive'
  });

  const handleOpenModal = (role?: RoleItem) => {
    if (role) {
      setEditingRole(role);
      let perms: string[] = [];
      try {
        perms = role.permissions ? JSON.parse(role.permissions) : [];
      } catch (e) {
        console.error("Error parsing permissions", e);
      }
      setFormData({
        name: role.name,
        slug: role.slug,
        name_bn: role.name_bn,
        description: role.description || '',
        permissions: perms,
        status: role.status
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        slug: '',
        name_bn: '',
        description: '',
        permissions: [],
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      slug: formData.slug,
      name_bn: formData.name_bn,
      description: formData.description,
      permissions: JSON.stringify(formData.permissions),
      status: formData.status
    };

    try {
      if (editingRole) {
        await fetch(`/api/roles/${editingRole.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/roles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      fetchRoles();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (confirmDeleteId) {
      try {
        await fetch(`/api/roles/${confirmDeleteId}`, { method: 'DELETE' });
        fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
      } finally {
        setConfirmDeleteId(null);
      }
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500 text-xs">লোড হচ্ছে...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-700">রোল তালিকা</h3>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#1a3a6b] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-blue-800 transition flex items-center gap-2"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          নতুন রোল যোগ করুন
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">রোলের নাম (EN)</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">সিস্টেম স্ল্যাগ (Slug)</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">রোলের নাম (BN)</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">বিবরণ</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">অবস্থা</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {roles.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4 text-xs font-bold text-gray-800">{r.name}</td>
                <td className="px-4 py-4 text-xs font-mono text-blue-600">{r.slug}</td>
                <td className="px-4 py-4 text-xs text-gray-500">{r.name_bn}</td>
                <td className="px-4 py-4 text-xs text-gray-600">{r.description}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 text-[9px] font-bold text-white rounded-full ${r.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {r.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleOpenModal(r)}
                    className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setConfirmDeleteId(r.id)}
                    className="text-red-600 hover:text-red-800 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal 
        isOpen={!!confirmDeleteId} 
        message="আপনি কি নিশ্চিত যে আপনি এই রোলটি মুছতে চান?" 
        onConfirm={handleDelete} 
        onCancel={() => setConfirmDeleteId(null)} 
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#1a3a6b] px-6 py-4 flex justify-between items-center shrink-0">
              <h3 className="text-white font-bold text-sm">
                {editingRole ? 'রোল এডিট করুন' : 'নতুন রোল যোগ করুন'}
              </h3>
              <button onClick={handleCloseModal} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">রোলের নাম (English)</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="উদা: Admin"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">সিস্টেম স্ল্যাগ (System Slug)</label>
                    <input 
                      type="text" 
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="উদা: admin, desk_officer_hardware"
                    />
                    <p className="text-[9px] text-gray-400 mt-1">* এটি সিস্টেমের অভ্যন্তরীণ কাজের জন্য ব্যবহৃত হয়। পরিবর্তন করার সময় সতর্ক থাকুন।</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">রোলের নাম (বাংলা)</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name_bn}
                      onChange={(e) => setFormData({...formData, name_bn: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="উদা: অ্যাডমিন"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">বিবরণ</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                      placeholder="রোলের সংক্ষিপ্ত বিবরণ..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">অবস্থা</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Active">সক্রিয় (Active)</option>
                      <option value="Inactive">নিষ্ক্রিয় (Inactive)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 mb-2">ফিচার অ্যাসাইন করুন (Assign Features)</label>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 space-y-2 max-h-[300px] overflow-y-auto">
                    {AVAILABLE_FEATURES.map(feature => (
                      <label key={feature.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                        <input 
                          type="checkbox"
                          checked={formData.permissions.includes(feature.id)}
                          onChange={(e) => {
                            const newPerms = e.target.checked 
                              ? [...formData.permissions, feature.id]
                              : formData.permissions.filter(p => p !== feature.id);
                            setFormData({...formData, permissions: newPerms});
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-700 font-medium">{feature.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition"
                >
                  বাতিল
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#1a3a6b] text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition"
                >
                  {editingRole ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
