import { Item, Loan, Activity, PurchaseItem, DashboardStats, Category } from '../types';

export const mockCategories: Category[] = [];

export const mockItems: Item[] = [];

export const mockLoans: Loan[] = [];

export const mockActivities: Activity[] = [];

export const mockPurchaseItems: PurchaseItem[] = [];

export const mockDashboardStats: DashboardStats = {
  totalItems: 0,
  outOfStockItems: 0,
  loanedItems: 0,
  totalCategories: 0,
  recentActivities: [],
};

export const mockUser = {
  id: '1',
  name: 'اوژیر بهاور',
  email: 'ozjir.bahawar@example.com',
  phone: '09123456789',
  avatar: '/api/placeholder/48/48',
  role: 'admin' as const,
  joinDate: '1403/06/15',
};
