import AuthForm from '@/components/AuthForm';

export default function StudentSignup() {
  return <AuthForm folderRole="students" isSignup={true} />;
}