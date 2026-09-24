import { headers } from 'next/headers';
import Link from 'next/link';
import AdminNav from './AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminNav />
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
}
