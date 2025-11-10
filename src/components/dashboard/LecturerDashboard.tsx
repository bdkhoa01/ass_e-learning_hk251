import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Users, Bell, Calendar, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LecturerDashboard = () => {
  return (
    <div className="container py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Bảng điều khiển Giảng viên</h1>
        <p className="text-muted-foreground">Quản lý khóa học và sinh viên</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
            <PlusCircle className="h-6 w-6" />
            <span>Tạo Bài Tập Mới</span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
            <Bell className="h-6 w-6" />
            <span>Gửi Thông Báo</span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/courses" className="block">
            <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Xem Báo Cáo Điểm</span>
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/courses" className="block">
            <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
              <Users className="h-6 w-6" />
              <span>Quản lý Lớp học</span>
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Các nhiệm vụ cần làm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <h3 className="font-medium">Chấm bài Assignment CO2013</h3>
                      <p className="text-sm text-muted-foreground">25 bài chờ chấm</p>
                    </div>
                  </div>
                  <Button>Bắt đầu chấm</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-medium">Điểm danh buổi học hôm nay</h3>
                      <p className="text-sm text-muted-foreground">CO3001 - Công nghệ Phần mềm</p>
                    </div>
                  </div>
                  <Button>Điểm danh</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bell className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Chuẩn bị bài giảng tuần sau</h3>
                      <p className="text-sm text-muted-foreground">Chapter 6 - Testing</p>
                    </div>
                  </div>
                  <Button variant="outline">Xem</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Khóa học đang dạy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/courses">
                  <div className="p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <p className="font-medium text-sm">CO3001</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Công nghệ Phần mềm</p>
                    <p className="text-xs text-muted-foreground mt-1">45 sinh viên</p>
                  </div>
                </Link>

                <div className="p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-success"></div>
                    <p className="font-medium text-sm">CO2013</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Hệ cơ sở dữ liệu</p>
                  <p className="text-xs text-muted-foreground mt-1">52 sinh viên</p>
                </div>

                <div className="p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-warning"></div>
                    <p className="font-medium text-sm">CO2001</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Kỹ năng Chuyên nghiệp</p>
                  <p className="text-xs text-muted-foreground mt-1">60 sinh viên</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
