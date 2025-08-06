/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/client";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleModal({ isOpen, onClose }: ScheduleModalProps) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const supabase = createClient();
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError("Not authenticated");
          return;
        }

        // Fetch lessons data
        const { data, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (lessonsError) {
          throw new Error(lessonsError.message);
        }
        setLessons(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch lessons");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchLessons();
    }
  }, [isOpen]);

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading Schedule...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Your Driving Lessons Schedule</DialogTitle>
        </DialogHeader>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-xl font-semibold">No Schedules Yet</p>
            <p className="mt-2">You haven&apos;t been scheduled for any driving lessons yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell>{lesson.date}</TableCell>
                  <TableCell>{lesson.time}</TableCell>
                  <TableCell>{lesson.instructor}</TableCell>
                  <TableCell>{lesson.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
