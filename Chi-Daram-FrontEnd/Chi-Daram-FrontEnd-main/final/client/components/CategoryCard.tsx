import { Eye, Calendar } from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const formatViews = (views: number) => {
    return views.toLocaleString('fa-IR');
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Category Image */}
      <div className="mb-4">
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-32 object-cover rounded-lg"
        />
      </div>

      {/* Category Info */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 text-lg">{category.title}</h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(category.date)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{formatViews(category.views)} بازدید</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-400">
          ۳ ساعت پیش
        </div>
      </div>
    </div>
  );
}
