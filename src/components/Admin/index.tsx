// "use client"
// import React, { useState } from 'react';
// import { Users, Calendar, CheckCircle, Plus, Eye, Edit, Trash2 } from 'lucide-react';

// const AdminDashboard = () => {
//   // Sample data - in a real app, this would come from a backend
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [students, setStudents] = useState([
//     { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0123', enrollmentDate: '2024-01-15' },
//     { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-0124', enrollmentDate: '2024-01-20' },
//     { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '555-0125', enrollmentDate: '2024-02-01' },
//     { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '555-0126', enrollmentDate: '2024-02-10' }
//   ]);

//   const [lessons, setLessons] = useState([
//     { id: 1, studentId: 1, studentName: 'John Doe', date: '2024-07-08', time: '10:00', instructor: 'David Brown', status: 'scheduled' },
//     { id: 2, studentId: 2, studentName: 'Jane Smith', date: '2024-07-09', time: '14:00', instructor: 'Sarah Miller', status: 'scheduled' },
//     { id: 3, studentId: 1, studentName: 'John Doe', date: '2024-07-05', time: '11:00', instructor: 'David Brown', status: 'completed' },
//     { id: 4, studentId: 3, studentName: 'Mike Johnson', date: '2024-07-10', time: '09:00', instructor: 'TBD', status: 'scheduled' }
//   ]);

//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [showCreateLesson, setShowCreateLesson] = useState(false);
//   const [newLesson, setNewLesson] = useState({
//     studentId: '',
//     date: '',
//     time: '',
//     instructor: ''
//   });

//   const instructors = ['David Brown', 'Sarah Miller', 'John Anderson', 'TBD'];

//   const handleCreateLesson = () => {
//     if (newLesson.studentId && newLesson.date && newLesson.time) {
//       const student = students.find(s => s.id === parseInt(newLesson.studentId));
//       const lesson = {
//         id: lessons.length + 1,
//         studentId: parseInt(newLesson.studentId),
//         studentName: student.name,
//         date: newLesson.date,
//         time: newLesson.time,
//         instructor: newLesson.instructor || 'TBD',
//         status: 'scheduled'
//       };
//       setLessons([...lessons, lesson]);
//       setNewLesson({ studentId: '', date: '', time: '', instructor: '' });
//       setShowCreateLesson(false);
//     }
//   };

//   const markLessonCompleted = (lessonId) => {
//     setLessons(lessons.map(lesson => 
//       lesson.id === lessonId ? { ...lesson, status: 'completed' } : lesson
//     ));
//   };

//   const deleteLesson = (lessonId) => {
//     setLessons(lessons.filter(lesson => lesson.id !== lessonId));
//   };

//   const getStatusColor = (status) => {
//     return status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       weekday: 'short',
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setActiveTab('dashboard')}
//                 className={`px-4 py-2 rounded-md font-medium ${
//                   activeTab === 'dashboard' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => setActiveTab('students')}
//                 className={`px-4 py-2 rounded-md font-medium ${
//                   activeTab === 'students' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 Students
//               </button>
//               <button
//                 onClick={() => setActiveTab('lessons')}
//                 className={`px-4 py-2 rounded-md font-medium ${
//                   activeTab === 'lessons' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 Lessons
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Dashboard Overview */}
//         {activeTab === 'dashboard' && (
//           <div className="space-y-6">
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center">
//                   <Users className="h-8 w-8 text-blue-600" />
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-500">Total Students</p>
//                     <p className="text-2xl font-bold text-gray-900">{students.length}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center">
//                   <Calendar className="h-8 w-8 text-green-600" />
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-500">Scheduled Lessons</p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {lessons.filter(l => l.status === 'scheduled').length}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center">
//                   <CheckCircle className="h-8 w-8 text-purple-600" />
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-500">Completed Lessons</p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {lessons.filter(l => l.status === 'completed').length}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-white rounded-lg shadow">
//               <div className="px-6 py-4 border-b border-gray-200">
//                 <h3 className="text-lg font-medium text-gray-900">Recent Lessons</h3>
//               </div>
//               <div className="divide-y divide-gray-200">
//                 {lessons.slice(0, 5).map(lesson => (
//                   <div key={lesson.id} className="px-6 py-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">{lesson.studentName}</p>
//                         <p className="text-sm text-gray-500">
//                           {formatDate(lesson.date)} at {lesson.time} with {lesson.instructor}
//                         </p>
//                       </div>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
//                         {lesson.status}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Students Tab */}
//         {activeTab === 'students' && (
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg shadow">
//               <div className="px-6 py-4 border-b border-gray-200">
//                 <h3 className="text-lg font-medium text-gray-900">Students List</h3>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Email
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Phone
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Enrollment Date
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {students.map(student => (
//                       <tr key={student.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{student.name}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{student.email}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{student.phone}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{formatDate(student.enrollmentDate)}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button className="text-blue-600 hover:text-blue-900">
//                               <Eye className="h-4 w-4" />
//                             </button>
//                             <button className="text-green-600 hover:text-green-900">
//                               <Edit className="h-4 w-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Lessons Tab */}
//         {activeTab === 'lessons' && (
//           <div className="space-y-6">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-medium text-gray-900">Driving Lessons</h3>
//               <button
//                 onClick={() => setShowCreateLesson(true)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
//               >
//                 <Plus className="h-4 w-4" />
//                 <span>Create Lesson</span>
//               </button>
//             </div>

//             {/* Create Lesson Modal */}
//             {showCreateLesson && (
//               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                 <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Lesson</h3>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Student</label>
//                       <select
//                         value={newLesson.studentId}
//                         onChange={(e) => setNewLesson({...newLesson, studentId: e.target.value})}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                       >
//                         <option value="">Select a student</option>
//                         {students.map(student => (
//                           <option key={student.id} value={student.id}>{student.name}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Date</label>
//                       <input
//                         type="date"
//                         value={newLesson.date}
//                         onChange={(e) => setNewLesson({...newLesson, date: e.target.value})}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Time</label>
//                       <input
//                         type="time"
//                         value={newLesson.time}
//                         onChange={(e) => setNewLesson({...newLesson, time: e.target.value})}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Instructor</label>
//                       <select
//                         value={newLesson.instructor}
//                         onChange={(e) => setNewLesson({...newLesson, instructor: e.target.value})}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                       >
//                         <option value="">Select instructor</option>
//                         {instructors.map(instructor => (
//                           <option key={instructor} value={instructor}>{instructor}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                   <div className="flex justify-end space-x-3 mt-6">
//                     <button
//                       onClick={() => setShowCreateLesson(false)}
//                       className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleCreateLesson}
//                       className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//                     >
//                       Create Lesson
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Lessons Table */}
//             <div className="bg-white rounded-lg shadow">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Student
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date & Time
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Instructor
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {lessons.map(lesson => (
//                       <tr key={lesson.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{lesson.studentName}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{formatDate(lesson.date)}</div>
//                           <div className="text-sm text-gray-500">{lesson.time}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{lesson.instructor}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
//                             {lesson.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             {lesson.status === 'scheduled' && (
//                               <button
//                                 onClick={() => markLessonCompleted(lesson.id)}
//                                 className="text-green-600 hover:text-green-900"
//                                 title="Mark as completed"
//                               >
//                                 <CheckCircle className="h-4 w-4" />
//                               </button>
//                             )}
//                             <button
//                               onClick={() => deleteLesson(lesson.id)}
//                               className="text-red-600 hover:text-red-900"
//                               title="Delete lesson"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;