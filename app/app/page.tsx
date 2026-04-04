import { Metadata } from 'next';
import ApiLensApp from '@/components/ApiLense';
import { Toaster } from 'sonner';
import LoginPage from '../login/page';
import AuthWrapper from '@/components/AuthWrapper';
export const metadata: Metadata = {
  title: 'API Inspector - ApiLens',
  description: 'Visualize and inspect JSON API responses in real-time with interactive tree, table, and graph views. Test APIs and format JSON data instantly.',
  alternates: {
    canonical: 'https://apilens.kaustubhp.in/app',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function AppPage() {

  return (
    <>
      <Toaster position="top-right" />
    <AuthWrapper/>
    </>
  );
}