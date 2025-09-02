import { useState } from 'react';
import { Category } from '../types';
import CategoryCard from './CategoryCard';
import { useData } from '../contexts/DataContext';

export default function CategoryGrid() {
  const { categories } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryClick = (category: Category) => {
    console.log('Category clicked:', category);
    // Navigate to category detail page
    // navigate(`/categories/${category.slug}`);
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">هیچ دسته‌بندی یافت نشد</p>
        <p className="text-gray-400 text-sm mb-6">ابتدا دسته‌بندی‌هایی برای آیتم‌هایتا�� ایجاد کنید</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onClick={() => handleCategoryClick(category)}
        />
      ))}
    </div>
  );
}
