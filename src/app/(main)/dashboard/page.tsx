import { RoleGuard } from '@/components/common/role-guard';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { StudentDashboard } from '@/components/dashboard/student-dashboard';
import { TeacherDashboard } from '@/components/dashboard/teacher-dashboard';
import { Role } from '@/types/auth';

export default function DashboardPage() {
  return (
    <>
      <RoleGuard allowedRoles={[Role.Student]}>
        <StudentDashboard />
      </RoleGuard>
      <RoleGuard allowedRoles={[Role.Instructor]}>
        <TeacherDashboard />
      </RoleGuard>
      <RoleGuard allowedRoles={[Role.Admin]}>
        <AdminDashboard />
      </RoleGuard>
    </>
  );
}
