import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, User, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  code: string;
  name: string;
  description: string | null;
  semester: string;
  year: number;
  lecturer_id: string | null;
  color: string | null;
  status?: string;
  lecturer_name?: string;
  schedule?: { day: string; period: string }[];
}

const CourseDetail = () => {
  const { id } = useParams();
  const { role, user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<{ status: string } | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        let courseData: Course = {
          ...data,
          schedule: (data.schedule as { day: string; period: string }[]) || [],
        } as Course;
        
        if (data?.lecturer_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', data.lecturer_id)
            .single();
          courseData = { ...courseData, lecturer_name: profile?.full_name };
        }

        setCourse(courseData);

        // Check student enrollment
        if (role === 'student' && user?.id) {
          const { data: enrollmentData } = await supabase
            .from('enrollments')
            .select('status')
            .eq('course_id', id)
            .eq('student_id', user.id)
            .maybeSingle();
          setEnrollment(enrollmentData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, role, user]);

  const handleRegister = async () => {
    if (!user?.id || !id) return;
    setEnrolling(true);

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert([{
          course_id: id,
          student_id: user.id,
          progress: 0,
          status: 'pending',
        }]);

      if (error) throw error;
      toast.success('Đăng ký thành công! Vui lòng chờ giảng viên duyệt.');
      setEnrollment({ status: 'pending' });
    } catch (error: any) {
      toast.error(error.message || 'Không thể đăng ký khóa học');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Đang tải chi tiết khóa học...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">Không tìm thấy khóa học.</p>
          <Link to="/courses">
            <Button variant="outline">Quay lại danh sách khóa học</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{course.name}</h1>
          <p className="text-muted-foreground">{course.code}</p>
        </div>
        <div className="flex items-center gap-2">
          {role === 'student' && !enrollment && (
            <Button onClick={handleRegister} disabled={enrolling}>
              <UserPlus className="mr-2 h-4 w-4" />
              {enrolling ? 'Đang đăng ký...' : 'Đăng ký khóa học'}
            </Button>
          )}
          {role === 'student' && enrollment && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              enrollment.status === 'approved' 
                ? 'bg-green-100 text-green-700' 
                : enrollment.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : enrollment.status === 'withdrawal_pending'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-red-100 text-red-700'
            }`}>
              {enrollment.status === 'approved' 
                ? 'Đã đăng ký' 
                : enrollment.status === 'pending' 
                  ? 'Chờ duyệt' 
                  : enrollment.status === 'withdrawal_pending'
                    ? 'Chờ duyệt rút môn'
                    : 'Bị từ chối'}
            </span>
          )}
          <Link to="/courses">
            <Button variant="outline">Quay lại</Button>
          </Link>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Thông tin khóa học</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span className="text-foreground font-medium">{course.code}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Học kỳ: <span className="text-foreground font-medium">{course.semester}</span> - Năm:{' '}
              <span className="text-foreground font-medium">{course.year}</span>
            </span>
          </div>

          {course.lecturer_name && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>
                Giảng viên: <span className="text-foreground font-medium">{course.lecturer_name}</span>
              </span>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground mb-1">Mô tả</p>
            <p className="text-foreground whitespace-pre-wrap">
              {course.description || 'Chưa có mô tả'}
            </p>
          </div>

          {course.schedule && course.schedule.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Thời khóa biểu</p>
              <div className="space-y-2">
                {course.schedule.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="font-medium">{item.day}</span>
                    <span>-</span>
                    <span>{item.period}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetail;
