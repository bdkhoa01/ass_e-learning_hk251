import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  status?: string | null;
}

const Home = () => {
  const { profile, role } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, title, content, created_at, status')
        .eq('is_global', true)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setAnnouncements(data);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="container py-8 px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-xl bg-gradient-primary p-8 text-white shadow-hover"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Chào mừng, {profile?.full_name}!
        </h1>
        <p className="text-lg opacity-90">
          Hệ thống học tập và quản lý sinh viên - Trường Đại học Bách Khoa TP.HCM
        </p>
        <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="font-semibold uppercase">{role}</span>
        </div>
      </motion.div>

      {/* Announcements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">Thông báo mới nhất từ Nhà Trường</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-muted-foreground text-sm">Chưa có thông báo toàn trường.</p>
              ) : (
                announcements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 rounded-lg bg-accent hover:bg-accent/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{announcement.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {announcement.content}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(announcement.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Home;
