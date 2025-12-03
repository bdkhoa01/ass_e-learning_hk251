import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Mail, Users, Calendar, Phone, Shield, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
    .regex(/[0-9]/, 'Phải có ít nhất 1 chữ số'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

const Profile = () => {
  const { user, profile, role, updateProfile, changePassword } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    date_of_birth: profile?.date_of_birth || '',
    gender: (profile as any)?.gender || '',
    phone: (profile as any)?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    setFormData({
      full_name: profile?.full_name || '',
      date_of_birth: profile?.date_of_birth || '',
      gender: (profile as any)?.gender || '',
      phone: (profile as any)?.phone || '',
    });
  }, [profile]);

  const handleProfileUpdate = async () => {
    try {
      profileSchema.parse(formData);
      await updateProfile(formData);
      setEditMode(false);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: any = {};
        error.issues.forEach((err) => {
          if (err.path) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      passwordSchema.parse(passwordData);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: any = {};
        error.issues.forEach((err) => {
          if (err.path) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'lecturer': return 'Giảng viên';
      case 'student': return 'Sinh viên';
      default: return role;
    }
  };

  return (
    <div className="container py-8 px-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Hồ sơ của tôi</h1>
        <p className="text-muted-foreground">Quản lý thông tin cá nhân và mật khẩu</p>
      </motion.div>

      <div className="grid gap-6">
        {/* Profile Info Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2" htmlFor="email">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={user?.email}
                      disabled
                      className="bg-muted mt-1"
                    />
                  </div>

                  <div>
                    <Label className="flex items-center gap-2" htmlFor="role">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      Vai trò
                    </Label>
                    <Input
                      id="role"
                      value={getRoleLabel(role || '')}
                      disabled
                      className="bg-muted mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2" htmlFor="full_name">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Họ và tên
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!editMode}
                      className={editMode ? '' : 'bg-muted'}
                    />
                    {errors.full_name && (
                      <p className="text-sm text-destructive mt-1">{errors.full_name}</p>
                    )}
                  </div>
                  <div>
                    <Label className="flex items-center gap-2" htmlFor="gender">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Giới tính
                    </Label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      disabled={!editMode}
                      className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${editMode ? '' : 'bg-muted'}`}
                    >
                      <option value="">Chọn</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2" htmlFor="date_of_birth">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Ngày sinh
                    </Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      disabled={!editMode}
                      className={editMode ? '' : 'bg-muted'}
                    />
                    {errors.date_of_birth && (
                      <p className="text-sm text-destructive mt-1">{errors.date_of_birth}</p>
                    )}
                  </div>
                  <div>
                    <Label className="flex items-center gap-2" htmlFor="phone">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editMode}
                      className={editMode ? '' : 'bg-muted'}
                      placeholder="0123xxxxxx"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {editMode ? (
                    <>
                      <Button type="button" onClick={handleProfileUpdate}>Lưu thay đổi</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditMode(false);
                          setFormData({
                            full_name: profile?.full_name || '',
                            date_of_birth: profile?.date_of_birth || '',
                            gender: (profile as any)?.gender || '',
                            phone: (profile as any)?.phone || '',
                          });
                          setErrors({});
                        }}
                      >
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setEditMode(true)}>
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Change Password Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Đổi mật khẩu
                </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Nhập mật khẩu hiện tại"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => ({ ...prev, current: !prev.current }))}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                      aria-label={showPassword.current ? 'Ẩn mật khẩu hiện tại' : 'Hiện mật khẩu hiện tại'}
                    >
                      {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-destructive mt-1">{errors.currentPassword}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Nhập mật khẩu mới"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                      aria-label={showPassword.new ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
                    >
                      {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-destructive mt-1">{errors.newPassword}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 chữ số
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Nhập lại mật khẩu mới"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                      aria-label={showPassword.confirm ? 'Ẩn xác nhận mật khẩu' : 'Hiện xác nhận mật khẩu'}
                    >
                      {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit">Đổi mật khẩu</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
