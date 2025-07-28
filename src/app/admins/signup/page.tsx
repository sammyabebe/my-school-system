import AuthForm from '@/components/AuthForm';

export default function AdminSignup() {
  return <AuthForm folderRole="admins" isSignup={true} />;
}