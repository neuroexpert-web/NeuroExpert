import Link from 'next/link';
import SEOHead from './components/SEOHead';

export default function Custom404() {
  return (
    <>
      <SEOHead
        title="404 - Страница не найдена | NeuroExpert"
        description="Запрашиваемая страница не найдена. Вернитесь на главную или воспользуйтесь поиском."
        ogType="website"
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="mt-4 text-xl text-gray-600">Страница не найдена</p>
          <Link href="/" className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </>
  );
}
