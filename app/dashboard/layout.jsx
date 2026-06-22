import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient';


export const metadata = {
  title: 'Dashboard Overview',
  description: 'Manage your AI prompts, track your analytics, and control your PromptNest workspace.',
};

export default function DashboardLayout({ children }) {
  return (
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  );
}
