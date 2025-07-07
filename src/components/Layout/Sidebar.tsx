import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  BarChart3, 
  Upload,
  Users,
  Play
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { currentUser } = useAuth();

  const studentNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tests', icon: FileText, label: 'Tests' },
    { to: '/study-material', icon: BookOpen, label: 'Study Material' },
    { to: '/videos', icon: Play, label: 'Videos' },
    { to: '/results', icon: BarChart3, label: 'My Results' },
  ];

  const adminNavItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Dashboard' },
    { to: '/admin/tests', icon: Upload, label: 'Manage Tests' },
    { to: '/admin/materials', icon: BookOpen, label: 'Study Materials' },
    { to: '/admin/videos', icon: Play, label: 'Manage Videos' },
    { to: '/admin/students', icon: Users, label: 'Students' },
  ];

  const navItems = currentUser?.role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <div className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <div className="p-6">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;