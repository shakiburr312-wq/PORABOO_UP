import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle, 
  Briefcase, 
  FileText, 
  Flag, 
  Settings, 
  Palette,
  Search,
  MoreVertical,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'verify', label: 'Tutor Verify', icon: CheckCircle },
    { id: 'assignments', label: 'Assignments', icon: Briefcase },
    { id: 'jobs', label: 'Job Posts', icon: FileText },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'branding', label: 'Branding', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="logo-font text-2xl text-[#1B2F6E]">PORABOO</span>
          <button className="lg:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-[#1B2F6E]/10 text-[#1B2F6E]' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-600" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-900 capitalize hidden sm:block">
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1B2F6E] flex items-center justify-center text-white font-bold text-sm">
                {currentUser?.full_name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'verify' && <VerifyTab />}
          {activeTab === 'assignments' && <AssignmentsTab />}
          {activeTab === 'branding' && <BrandingTab />}
          {/* Add other tabs as needed */}
          {!['dashboard', 'users', 'verify', 'assignments', 'branding'].includes(activeTab) && (
            <div className="flex items-center justify-center h-full text-gray-500">
              {navItems.find(i => i.id === activeTab)?.label} module is under construction
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Dummy Tabs for now

function DashboardTab() {
  const stats = [
    { label: 'Total Tutors', value: '1,248', change: '+12%' },
    { label: 'Total Guardians', value: '3,842', change: '+8%' },
    { label: 'Pending Verifications', value: '45', change: '-2%' },
    { label: 'Active Assignments', value: '320', change: '+24%' },
    { label: 'Open Job Posts', value: '156', change: '+5%' },
    { label: 'Flagged Content', value: '12', change: '0%' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-semibold text-gray-900">All Users</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search users..." className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2F6E]" />
        </div>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-6 py-3 font-medium">Name</th>
            <th className="px-6 py-3 font-medium">Email</th>
            <th className="px-6 py-3 font-medium">Role</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[1,2,3,4,5].map(i => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-gray-900 font-medium">User {i}</td>
              <td className="px-6 py-4 text-gray-500">user{i}@example.com</td>
              <td className="px-6 py-4 text-gray-500 capitalize">{i % 2 === 0 ? 'Tutor' : 'Guardian'}</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span></td>
              <td className="px-6 py-4">
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VerifyTab() {
  return (
    <div className="space-y-6">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200 border-dashed">
            ID Photo
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tutor Name {i}</h3>
                <p className="text-sm text-gray-500">Applied 2 days ago</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-lg text-sm transition-colors">Reject</button>
                <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 font-medium rounded-lg text-sm transition-colors">Verify ✓</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">NID Number</p>
                <p className="font-medium text-gray-900">1234 •••• •••• 5678</p>
              </div>
              <div>
                <p className="text-gray-500">University</p>
                <p className="font-medium text-gray-900">Dhaka University</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AssignmentsTab() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-6 py-3 font-medium">Guardian</th>
            <th className="px-6 py-3 font-medium">Tutor</th>
            <th className="px-6 py-3 font-medium">Subject & Area</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[1,2,3,4].map(i => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-gray-900 font-medium">Guardian {i}</td>
              <td className="px-6 py-4 text-gray-500">Tutor {i}</td>
              <td className="px-6 py-4 text-gray-500">Physics, Mirpur</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending Match</span></td>
              <td className="px-6 py-4">
                <button className="px-3 py-1.5 bg-[#1B2F6E] text-white text-xs font-medium rounded-lg hover:bg-[#1B2F6E]/90 transition-colors">Assign</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BrandingTab() {
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  return (
    <div className="max-w-3xl space-y-8">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Brand Identity</h3>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
          <div className="flex items-center gap-4">
            <input type="color" value="#1B2F6E" className="w-10 h-10 rounded border border-gray-200 cursor-pointer" readOnly />
            <input type="text" value="#1B2F6E" className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-32 font-mono" readOnly />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Accent Color</label>
          <div className="flex items-center gap-4">
            <input type="color" value="#F5A623" className="w-10 h-10 rounded border border-gray-200 cursor-pointer" readOnly />
            <input type="text" value="#F5A623" className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-32 font-mono" readOnly />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center logo-font text-[#1B2F6E]">PORABOO</div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Upload New</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Legal Documents</h3>
        {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(doc => (
          <div key={doc} className="py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">{doc}</span>
              <button 
                onClick={() => setActiveDoc(activeDoc === doc ? null : doc)}
                className="px-3 py-1.5 text-[#1B2F6E] bg-[#1B2F6E]/10 rounded-lg text-sm font-medium hover:bg-[#1B2F6E]/20 transition-colors"
              >
                {activeDoc === doc ? 'Close Editor' : 'Edit Content'}
              </button>
            </div>
            {activeDoc === doc && (
              <div className="mt-4 space-y-2">
                <div className="flex gap-2 p-2 bg-gray-50 rounded-t-lg border border-gray-200 border-b-0">
                  <button className="p-1.5 hover:bg-white rounded text-gray-700 font-bold">B</button>
                  <button className="p-1.5 hover:bg-white rounded text-gray-700 italic">I</button>
                  <button className="p-1.5 hover:bg-white rounded text-gray-700 underline">U</button>
                </div>
                <textarea 
                  className="w-full h-48 p-4 border border-gray-200 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-[#1B2F6E] text-sm"
                  placeholder={`Write your ${doc} here...`}
                  defaultValue={`<h2>${doc}</h2><p>Last updated: Today</p><p>Content goes here...</p>`}
                ></textarea>
                <button className="mt-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Save {doc}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Social Links</h3>
        {['Facebook', 'Instagram', 'LinkedIn'].map(social => (
          <div key={social}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{social} URL</label>
            <input type="url" placeholder={`https://${social.toLowerCase()}.com/poraboo`} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2F6E]" />
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <button className="px-6 py-2.5 bg-[#1B2F6E] text-white font-medium rounded-xl hover:bg-[#1B2F6E]/90 transition-colors">
          Save All Changes
        </button>
      </div>
    </div>
  );
}
