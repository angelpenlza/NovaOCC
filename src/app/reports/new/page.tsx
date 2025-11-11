import Header from '@/components/Header';
import ReportForm from '@/components/ReportForm';

export default function NewReportPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <ReportForm />
      </div>
    </div>
  );
}

