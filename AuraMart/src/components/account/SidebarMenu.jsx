import { User, Package, MapPin, Heart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const tabs = [
  { id: 'profile',   label: 'My Profile',  icon: <User size={16} /> },
  { id: 'orders',    label: 'My Orders',   icon: <Package size={16} /> },
  { id: 'addresses', label: 'Addresses',   icon: <MapPin size={16} /> },
];

const SidebarMenu = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  return (
    <aside className="lg:w-64 flex-shrink-0">
      {/* User info */}
      <div className="bg-[#E63946] rounded-lg p-4 mb-3 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold truncate">{user?.name || 'My Account'}</p>
          <p className="text-blue-200 text-xs truncate">{user?.email || ''}</p>
        </div>
      </div>

      {/* Nav */}
      <div className="bg-white rounded-lg border border-[#EAEAEA] overflow-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b last:border-b-0 border-[#FAF7F2] ${
              activeTab === tab.id
                ? 'text-[#E63946] bg-[#FFF1F1] border-l-2 border-l-[#E63946]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className={activeTab === tab.id ? 'text-[#E63946]' : 'text-[#6B7280]'}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default SidebarMenu;
