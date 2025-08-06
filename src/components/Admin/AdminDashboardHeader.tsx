import React from 'react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminDashboardHeader: React.FC<Props> = ({ activeTab, setActiveTab }) => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-md font-medium ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-md font-medium ${activeTab === 'students' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-4 py-2 rounded-md font-medium ${activeTab === 'lessons' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Lessons
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboardHeader; 