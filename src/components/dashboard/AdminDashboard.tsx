import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Bell, Users } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

interface Stats {
  courses: number;
  assignments: number;
  announcements: number;
  users: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    courses: 0,
    assignments: 0,
    announcements: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [pendingAnnouncements, setPendingAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const fetchCounts = async () => {
      type TableName = 'courses' | 'assignments' | 'announcements' | 'profiles';
      const getCount = async (table: TableName) => {
        const { count, error } = await supabase
          .from(table)
          .select('id', { count: 'exact', head: true });
        if (error) throw error;
        return count || 0;
      };

      try {
        const [courses, assignments, announcements, users] = await Promise.all([
          getCount('courses'),
          getCount('assignments'),
          getCount('announcements'),
          getCount('profiles'),
        ]);

        setStats({ courses, assignments, announcements, users });

        const { data: coursesPending } = await supabase
          .from('courses')
          .select('id, code, name, lecturer_id, status')
          .eq('status', 'pending');
        setPendingCourses(coursesPending || []);

        const { data: announcementsPending } = await supabase
          .from('announcements')
          .select('id, title, created_by, status, is_global')
          .eq('status', 'pending')
          .eq('is_global', true);
        setPendingAnnouncements(announcementsPending || []);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      title: 'Khóa học',
      value: stats.courses,
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      to: '/courses',
    },
    {
      title: 'Bài tập',
      value: stats.assignments,
      icon: <FileText className="h-5 w-5 text-success" />,
      to: '/assignments',
    },
    {
      title: 'Thông báo',
      value: stats.announcements,
      icon: <Bell className="h-5 w-5 text-warning" />,
      to: '/announcements',
    },
    {
      title: 'Người dùng',
      value: stats.users,
      icon: <Users className="h-5 w-5 text-destructive" />,
      to: '/users',
    },
  ];

  return (
    <div className="container py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Bảng điều khiển Admin</h1>
        <p className="text-muted-foreground">Quản lý toàn bộ hệ thống</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <Link to={card.to}>
              <Card className="shadow-card hover:shadow-hover transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? '...' : card.value}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Khóa học chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingCourses.length === 0 && (
                <p className="text-sm text-muted-foreground">Không có khóa học chờ duyệt</p>
              )}
              {pendingCourses.map((course) => (
                <div key={course.id} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{course.code}</p>
                      <p className="text-sm text-muted-foreground">{course.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-sm px-3 py-1 rounded-md bg-success/10 text-success"
                        onClick={async () => {
                          const { error } = await supabase
                            .from('courses')
                            .update({ status: 'approved' })
                            .eq('id', course.id);
                          if (!error) {
                            setPendingCourses((prev) => prev.filter((c) => c.id !== course.id));
                          }
                        }}
                      >
                        Duyệt
                      </button>
                      <button
                        className="text-sm px-3 py-1 rounded-md bg-destructive/10 text-destructive"
                        onClick={async () => {
                          const { error } = await supabase
                            .from('courses')
                            .update({ status: 'rejected' })
                            .eq('id', course.id);
                          if (!error) {
                            setPendingCourses((prev) => prev.filter((c) => c.id !== course.id));
                          }
                        }}
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Thông báo chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingAnnouncements.length === 0 && (
                <p className="text-sm text-muted-foreground">Không có thông báo chờ duyệt</p>
              )}
              {pendingAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{announcement.title}</p>
                    <div className="flex gap-2">
                      <button
                        className="text-sm px-3 py-1 rounded-md bg-success/10 text-success"
                        onClick={async () => {
                          const { error } = await supabase
                            .from('announcements')
                            .update({ status: 'approved' })
                            .eq('id', announcement.id);
                          if (!error) {
                            setPendingAnnouncements((prev) => prev.filter((a) => a.id !== announcement.id));
                          }
                        }}
                      >
                        Duyệt
                      </button>
                      <button
                        className="text-sm px-3 py-1 rounded-md bg-destructive/10 text-destructive"
                        onClick={async () => {
                          const { error } = await supabase
                            .from('announcements')
                            .update({ status: 'rejected' })
                            .eq('id', announcement.id);
                          if (!error) {
                            setPendingAnnouncements((prev) => prev.filter((a) => a.id !== announcement.id));
                          }
                        }}
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
