import { LogisticsHeader } from '@/components/layout/LogisticsHeader';
import { Footer } from '@/components/layout/footer';

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LogisticsHeader />
      {children}
      <Footer />
    </>
  );
}