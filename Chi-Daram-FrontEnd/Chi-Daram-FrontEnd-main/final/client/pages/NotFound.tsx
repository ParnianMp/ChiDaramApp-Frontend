import Layout from '../components/Layout';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="text-6xl text-gray-300 mb-4">۴۰۴</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">صفحه یافت نشد</h1>
        <p className="text-gray-600 mb-6">صفحه‌ای که دنبال آن می‌گردید وجود ندارد.</p>
        <a
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>بازگشت به خانه</span>
        </a>
      </div>
    </Layout>
  );
}
