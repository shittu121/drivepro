/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface Student {
  id: string | number;
  name?: string;
  first_name?: string;
  last_name?: string;
}

interface NewLesson {
  userId: string;
  date: string;
  time: string;
  instructor: string;
}

interface CreateLessonModalProps {
  students: Student[];
  instructors: string[];
  newLesson: NewLesson;
  setNewLesson: (lesson: NewLesson) => void;
  onClose: () => void;
  onCreate: () => void;
}

const CreateLessonModal: React.FC<CreateLessonModalProps> = ({ students, instructors, newLesson, setNewLesson, onClose, onCreate }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Lesson</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Student</label>
          <select
            value={newLesson.userId}
            onChange={(e) => setNewLesson({ ...newLesson, userId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a student</option>
            {students.map((student: any) => (
              <option key={student.user_id} value={student.user_id}>{student.name || (student.first_name && student.last_name ? student.first_name + ' ' + student.last_name : '')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={newLesson.date}
            onChange={(e) => setNewLesson({ ...newLesson, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={newLesson.time}
            onChange={(e) => setNewLesson({ ...newLesson, time: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Instructor</label>
          <select
            value={newLesson.instructor}
            onChange={(e) => setNewLesson({ ...newLesson, instructor: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select instructor</option>
            {instructors.map((instructor: string) => (
              <option key={instructor} value={instructor}>{instructor}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={onCreate}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Create Lesson
        </button>
      </div>
    </div>
  </div>
);

export default CreateLessonModal; 