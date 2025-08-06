/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/client';
import AdminDashboardHeader from './AdminDashboardHeader';
import AdminStats from './AdminStats';
import StudentsTable from './StudentsTable';
import LessonsTable from './LessonsTable';
import CreateLessonModal from './CreateLessonModal';
import { Student, Lesson } from '../../types';

const AdminDashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [newLesson, setNewLesson] = useState({
    userId: '',
    date: '',
    time: '',
    instructor: ''
  });

  const instructors = ['David Brown', 'Sarah Miller', 'John Anderson', 'TBD'];

  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('students').select('*');
        if (error) throw error;
        setStudents(data || []);
      } catch (err) {
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();

    // Fetch lessons from Supabase
    const fetchLessons = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('lessons').select('*');
        if (error) throw error;
        setLessons(data || []);
      } catch (err) {
        setLessons([]);
      }
    };
    fetchLessons();
  }, []);

  const handleCreateLesson = async () => {
    if (newLesson.userId && newLesson.date && newLesson.time) {
      try {
        const supabase = createClient();
        // Find the student for the name
        const student = students.find(s => String(s.user_id) === String(newLesson.userId));
        const { data, error } = await supabase.from('lessons').insert([
          {
            user_id: newLesson.userId,
            student_name: student?.first_name || '',
            date: newLesson.date,
            time: newLesson.time,
            instructor: newLesson.instructor || 'TBD',
            status: 'scheduled',
          }
        ]);
        if (error) throw error;
        // Update the student's status to 'active' after creating a lesson
        await supabase
          .from('students')
          .update({ status: 'active' })
          .eq('user_id', newLesson.userId);
        // Fetch updated lessons from Supabase
        const { data: lessonsData, error: lessonsError } = await supabase.from('lessons').select('*');
        if (lessonsError) throw lessonsError;
        setLessons(lessonsData || []);
        setNewLesson({ userId: '', date: '', time: '', instructor: '' });
        setShowCreateLesson(false);
      } catch (err) {
        let message = 'Unknown error';
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
          message = (err as { message: string }).message;
        } else if (typeof err === 'string') {
          message = err;
        }
        alert('Failed to create lesson: ' + message);
      }
    }
  };

  const markLessonCompleted = async (lessonId: string | number) => {
    try {
      const supabase = createClient();
      // Update lesson status in Supabase
      const { data: updatedLesson, error: lessonError } = await supabase
        .from('lessons')
        .update({ status: 'completed' })
        .eq('id', lessonId)
        .select()
        .single();
      if (lessonError) throw lessonError;

      // Find the user_id from the updated lesson
      const userId = updatedLesson.user_id;
      // Fetch all lessons for this user, order by date desc to get the latest
      const { data: userLessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('time', { ascending: false });
      if (lessonsError) throw lessonsError;
      // The latest lesson is the first in the sorted list
      const latestLesson = userLessons && userLessons.length > 0 ? userLessons[0] : null;
      let newStudentStatus = 'pending';
      if (latestLesson) {
        if (['scheduled', 'completed'].includes(latestLesson.status)) {
          newStudentStatus = 'active';
        } else if (['approved', 'rejected', 'pending', 'active'].includes(latestLesson.status)) {
          newStudentStatus = latestLesson.status;
        }
      }
      // Update the student's status to match the mapped status
      const { error: studentError } = await supabase
        .from('students')
        .update({ status: newStudentStatus })
        .eq('user_id', userId);
      if (studentError) throw studentError;
      // Fetch updated lessons from Supabase
      const { data: lessonsData, error: allLessonsError } = await supabase.from('lessons').select('*');
      if (allLessonsError) throw allLessonsError;
      setLessons(lessonsData || []);
    } catch (err) {
      let message = 'Unknown error';
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
        message = (err as { message: string }).message;
      } else if (typeof err === 'string') {
        message = err;
      }
      alert('Failed to update lesson or student status: ' + message);
    }
  };

  const deleteLesson = async (lessonId: string | number) => {
    try {
      const supabase = createClient();
      // Get the lesson to be deleted to find the user_id
      const { data: lessonToDelete, error: fetchError } = await supabase
        .from('lessons')
        .select('user_id')
        .eq('id', lessonId)
        .single();
      if (fetchError) throw fetchError;
      const userId = lessonToDelete.user_id;

      // Delete the lesson
      const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
      if (error) throw error;
      // Fetch updated lessons from Supabase
      const { data: lessonsData, error: allLessonsError } = await supabase.from('lessons').select('*');
      if (allLessonsError) throw allLessonsError;
      setLessons(lessonsData || []);

      // After deletion, update the student's status based on their latest lesson
      const { data: userLessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('time', { ascending: false });
      if (lessonsError) throw lessonsError;
      const latestLesson = userLessons && userLessons.length > 0 ? userLessons[0] : null;
      let newStudentStatus = 'pending';
      if (latestLesson) {
        if (['scheduled', 'completed'].includes(latestLesson.status)) {
          newStudentStatus = 'active';
        } else if (['approved', 'rejected', 'pending', 'active'].includes(latestLesson.status)) {
          newStudentStatus = latestLesson.status;
        }
      }
      const { error: studentError } = await supabase
        .from('students')
        .update({ status: newStudentStatus })
        .eq('user_id', userId);
      if (studentError) throw studentError;
    } catch (err) {
      let message = 'Unknown error';
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
        message = (err as { message: string }).message;
      } else if (typeof err === 'string') {
        message = err;
      }
      alert('Failed to delete lesson: ' + message);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <AdminStats students={students} lessons={lessons} />
        )}
        {activeTab === 'students' && (
          <StudentsTable students={students} loading={loadingStudents} />
        )}
        {activeTab === 'lessons' && (
          <LessonsTable lessons={lessons} students={students} onCreateLesson={() => setShowCreateLesson(true)} markLessonCompleted={markLessonCompleted} deleteLesson={deleteLesson} />
        )}
        {showCreateLesson && (
          <CreateLessonModal
            students={students}
            instructors={instructors}
            newLesson={newLesson}
            setNewLesson={setNewLesson}
            onClose={() => setShowCreateLesson(false)}
            onCreate={handleCreateLesson}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;