import { useState } from 'react';
import SidebarMenu from './SidebarMenu';
import ProfileForm from './ProfileForm';
import MyOrders from './MyOrders';
import AddressList from './AddressList';

const AccountPanel = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':    return <MyOrders />;
      case 'addresses': return <AddressList />;
      default:          return <ProfileForm />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-5">My Account</h1>
        <div className="flex flex-col lg:flex-row gap-4">
          <SidebarMenu activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPanel;
