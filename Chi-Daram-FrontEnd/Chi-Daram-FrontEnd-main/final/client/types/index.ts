export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
}

export interface Category {
  id: string;
  title: string;
  image: string;
  date: string;
  views: number;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface NavigationItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color?: string;
  isActive?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: 'date' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface Item {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  description?: string;
  image?: string;
  dateAdded: string;
  isOutOfStock: boolean;
  isOnLoan: boolean;
  price?: number;
  barcode?: string;
  location?: string;
  locationId?: string;
}

export interface Loan {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  recipientName: string;
  recipientContact?: string;
  loanDate: string;
  returnDate?: string;
  notes?: string;
  isReturned: boolean;
}

export interface Activity {
  id: string;
  type: 'add_item' | 'delete_item' | 'edit_item' | 'loan_item' | 'return_item' | 'add_category';
  description: string;
  itemName?: string;
  categoryName?: string;
  date: string;
  count?: number;
}

export interface PurchaseItem {
  id: string;
  name: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  isPurchased: boolean;
  estimatedPrice?: number;
  notes?: string;
  dateAdded: string;
  datePurchased?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  type: 'home' | 'work' | 'other';
  description?: string;
  dateAdded: string;
  isActive: boolean;
}

export interface DashboardStats {
  totalItems: number;
  outOfStockItems: number;
  loanedItems: number;
  totalCategories: number;
  recentActivities: Activity[];
}
