import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, FileText, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  return (
    <div className="container py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Bảng điều khiển Sinh viên</h1>
        <p className="text-muted-foreground">Theo dõi tiến độ học tập của bạn</p>
      </motion.div>

      {/* Learning Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Tình trạng Học tập Hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-accent/50">
                <p className="text-sm text-muted-foreground mb-2">Mục tiêu học kỳ</p>
                <p className="font-medium">Hoàn thành 4/4 môn trong học kỳ 1/2025-2026</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-2xl font-bold text-success">7/9</p>
                  <p className="text-sm text-muted-foreground">Bài tập đã nộp</p>
                </div>
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="text-2xl font-bold text-warning">2</p>
                  <p className="text-sm text-muted-foreground">Bài tập còn lại</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Đường dẫn nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/courses">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Khóa học của tôi
                </Button>
              </Link>
              <Link to="/assignments">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Bài tập
                </Button>
              </Link>
              <Link to="/grades">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Xem điểm
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Lịch trình Sắp tới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">QUIZ 7 - Advanced SQL</h3>
                    <p className="text-sm text-muted-foreground">Hệ cơ sở dữ liệu - Hạn: 15/11/2025</p>
                  </div>
                </div>
                <Button>Bắt đầu</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-medium">Assignment 3 - Design Patterns</h3>
                    <p className="text-sm text-muted-foreground">Công nghệ Phần mềm - Hạn: 20/11/2025</p>
                  </div>
                </div>
                <Button>Xem chi tiết</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
