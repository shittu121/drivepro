import React from 'react';
import { Users, Calendar, CheckCircle } from 'lucide-react';
import { Student, Lesson } from '../../types';

interface AdminStatsProps {
  students: Student[];
  lessons: Lesson[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ students, lessons }) => {
  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Scheduled Lessons</p>
              <p className="text-2xl font-bold text-gray-900">{lessons.filter((l: Lesson) => l.status === 'scheduled').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed Lessons</p>
              <p className="text-2xl font-bold text-gray-900">{lessons.filter((l: Lesson) => l.status === 'completed').length}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Lessons</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {lessons.slice(0, 5).map((lesson: Lesson) => (
            <div key={lesson.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{lesson.student_name}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(lesson.date)} at {lesson.time} with {lesson.instructor}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                  {lesson.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStats; 