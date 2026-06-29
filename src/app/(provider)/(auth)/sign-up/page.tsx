import SignUpForm from '@/features/auth/components/sign-up/SignUpForm';
import SignUpProvider from '@/features/auth/providers/SignUpProvider';

export default function SignUpPage() {
  return (
    <SignUpProvider>
      <SignUpForm />
    </SignUpProvider>
  );
}
