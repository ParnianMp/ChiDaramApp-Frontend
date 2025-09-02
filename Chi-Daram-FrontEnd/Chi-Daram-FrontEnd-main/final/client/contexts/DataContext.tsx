import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, Item, Loan, Activity, PurchaseItem, DashboardStats, Location } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  // Data
  categories: Category[];
  items: Item[];
  loans: Loan[];
  activities: Activity[];
  purchaseItems: PurchaseItem[];
  locations: Location[];
  
  // Categories
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Items
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  
  // Loans
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  returnLoan: (id: string) => void;
  
  // Purchase Items
  addPurchaseItem: (item: Omit<PurchaseItem, 'id'>) => void;
  updatePurchaseItem: (id: string, item: Partial<PurchaseItem>) => void;
  deletePurchaseItem: (id: string) => void;

  // Locations
  addLocation: (location: Omit<Location, 'id'>) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  deleteLocation: (id: string) => void;

  // Stats
  getDashboardStats: () => DashboardStats;

  // Loading
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      clearAllData();
    }
  }, [user]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Load data from localStorage for this user
      const userDataKey = `userData_${user?.id}`;
      const userData = localStorage.getItem(userDataKey);
      
      if (userData) {
        const parsedData = JSON.parse(userData);
        setCategories(parsedData.categories || []);
        setItems(parsedData.items || []);
        setLoans(parsedData.loans || []);
        setActivities(parsedData.activities || []);
        setPurchaseItems(parsedData.purchaseItems || []);
        setLocations(parsedData.locations || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = () => {
    if (!user) return;
    
    const userDataKey = `userData_${user.id}`;
    const userData = {
      categories,
      items,
      loans,
      activities,
      purchaseItems,
      locations,
    };
    
    localStorage.setItem(userDataKey, JSON.stringify(userData));
  };

  const clearAllData = () => {
    setCategories([]);
    setItems([]);
    setLoans([]);
    setActivities([]);
    setPurchaseItems([]);
    setLocations([]);
  };

  // Save data whenever it changes
  useEffect(() => {
    if (user) {
      saveUserData();
    }
  }, [categories, items, loans, activities, purchaseItems, locations, user]);

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('fa-IR'),
    };
    
    setActivities(prev => [newActivity, ...prev]);
  };

  // Categories
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('fa-IR'),
      views: 0,
    };
    
    setCategories(prev => [...prev, newCategory]);
    addActivity({
      type: 'add_category',
      description: 'دسته‌بندی جدید اضافه شد',
      categoryName: newCategory.title,
    });
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...categoryData } : cat));
  };

  const deleteCategory = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    setCategories(prev => prev.filter(cat => cat.id !== id));
    
    if (category) {
      addActivity({
        type: 'delete_item',
        description: 'دسته‌بندی حذف شد',
        categoryName: category.title,
      });
    }
  };

  // Items
  const addItem = (itemData: Omit<Item, 'id'>) => {
    const newItem: Item = {
      ...itemData,
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toLocaleDateString('fa-IR'),
    };
    
    setItems(prev => [...prev, newItem]);
    addActivity({
      type: 'add_item',
      description: 'آیتم جدید اضافه شد',
      itemName: newItem.name,
      categoryName: newItem.category,
      count: 1,
    });
  };

  const updateItem = (id: string, itemData: Partial<Item>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...itemData } : item));
  };

  const deleteItem = (id: string) => {
    const item = items.find(item => item.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    
    if (item) {
      addActivity({
        type: 'delete_item',
        description: 'آیتم حذف شد',
        itemName: item.name,
        categoryName: item.category,
      });
    }
  };

  // Loans
  const addLoan = (loanData: Omit<Loan, 'id'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: Math.random().toString(36).substr(2, 9),
      loanDate: new Date().toLocaleDateString('fa-IR'),
      isReturned: false,
    };
    
    setLoans(prev => [...prev, newLoan]);
    
    // Update item to mark as on loan
    updateItem(loanData.itemId, { isOnLoan: true });
    
    addActivity({
      type: 'loan_item',
      description: 'آیتم امانت داده شد',
      itemName: loanData.itemName,
      categoryName: loanData.category,
    });
  };

  const returnLoan = (id: string) => {
    const loan = loans.find(loan => loan.id === id);
    if (!loan) return;
    
    setLoans(prev => prev.map(loan => 
      loan.id === id 
        ? { ...loan, isReturned: true, returnDate: new Date().toLocaleDateString('fa-IR') }
        : loan
    ));
    
    // Update item to mark as returned
    updateItem(loan.itemId, { isOnLoan: false });
    
    addActivity({
      type: 'return_item',
      description: 'آیتم بازگردانده شد',
      itemName: loan.itemName,
      categoryName: loan.category,
    });
  };

  // Purchase Items
  const addPurchaseItem = (itemData: Omit<PurchaseItem, 'id'>) => {
    const newItem: PurchaseItem = {
      ...itemData,
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toLocaleDateString('fa-IR'),
      isPurchased: false,
    };
    
    setPurchaseItems(prev => [...prev, newItem]);
  };

  const updatePurchaseItem = (id: string, itemData: Partial<PurchaseItem>) => {
    setPurchaseItems(prev => prev.map(item => item.id === id ? { ...item, ...itemData } : item));
  };

  const deletePurchaseItem = (id: string) => {
    setPurchaseItems(prev => prev.filter(item => item.id !== id));
  };

  // Locations
  const addLocation = (locationData: Omit<Location, 'id'>) => {
    const newLocation: Location = {
      ...locationData,
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toLocaleDateString('fa-IR'),
      isActive: true,
    };

    setLocations(prev => [...prev, newLocation]);
  };

  const updateLocation = (id: string, locationData: Partial<Location>) => {
    setLocations(prev => prev.map(location => location.id === id ? { ...location, ...locationData } : location));
  };

  const deleteLocation = (id: string) => {
    setLocations(prev => prev.filter(location => location.id !== id));
  };

  // Dashboard Stats
  const getDashboardStats = (): DashboardStats => {
    return {
      totalItems: items.length,
      outOfStockItems: items.filter(item => item.isOutOfStock).length,
      loanedItems: items.filter(item => item.isOnLoan).length,
      totalCategories: categories.length,
      recentActivities: activities.slice(0, 5),
    };
  };

  const value: DataContextType = {
    categories,
    items,
    loans,
    activities,
    purchaseItems,
    locations,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    addLoan,
    returnLoan,
    addPurchaseItem,
    updatePurchaseItem,
    deletePurchaseItem,
    addLocation,
    updateLocation,
    deleteLocation,
    getDashboardStats,
    isLoading,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
