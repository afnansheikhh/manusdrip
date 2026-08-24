import { db, isFirebaseConfigured } from "./firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  sizes: string[];
  stock: Record<string, number>;
  status: string; // active, draft, sold_out
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  name: string;
  active: boolean;
}

export interface StoreConfig {
  store_name: string;
  city: string;
  whatsapp_number: string;
  store_address: string;
  instagram_url: string;
  launch_mode: string; // LIVE or COMING_SOON
  low_stock_threshold: number;
  admin_password?: string;
}

// Default Seed categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat_tshirts", name: "T-Shirts", active: true },
  { id: "cat_shirts", name: "Shirts", active: true },
  { id: "cat_hoodies", name: "Hoodies", active: true },
  { id: "cat_pants", name: "Pants", active: true }
];

// Default Settings
const DEFAULT_SETTINGS: StoreConfig = {
  store_name: "ManusDrip (Local Demo)",
  city: "Hospet",
  whatsapp_number: "916366691845",
  store_address: "Vijay Talkies, near Main Bazar, Hospet, Karnataka, India",
  instagram_url: "https://www.instagram.com/crushb0yy_?igsh=MXN3aXp3eTJtbXB1dg==",
  launch_mode: "LIVE",
  low_stock_threshold: 5,
  admin_password: "Manojkumarkhan"
};

// --- MOCK LOCALSTORAGE DATABASE BACKEND FOR OFFLINE / NON-CONFIGURED MODE ---
const MockDb = {
  getProducts(): Product[] {
    if (typeof window === "undefined") return [];
    const val = localStorage.getItem("manusdrip_mock_products");
    return val ? JSON.parse(val) : [];
  },
  saveProducts(list: Product[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem("manusdrip_mock_products", JSON.stringify(list));
  },
  getCategories(): Category[] {
    if (typeof window === "undefined") return DEFAULT_CATEGORIES;
    const val = localStorage.getItem("manusdrip_mock_categories");
    if (!val) {
      localStorage.setItem("manusdrip_mock_categories", JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(val);
  },
  saveCategories(list: Category[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem("manusdrip_mock_categories", JSON.stringify(list));
  },
  getSettings(): StoreConfig {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    const val = localStorage.getItem("manusdrip_mock_settings");
    if (!val) {
      localStorage.setItem("manusdrip_mock_settings", JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(val);
  },
  saveSettings(config: StoreConfig) {
    if (typeof window === "undefined") return;
    localStorage.setItem("manusdrip_mock_settings", JSON.stringify(config));
  }
};

export const DbService = {
  // --- PRODUCTS ---
  async getProducts(activeOnly = false): Promise<Product[]> {
    if (!isFirebaseConfigured) {
      let list = MockDb.getProducts();
      if (activeOnly) {
        list = list.filter(p => p.status !== "draft");
      }
      return list;
    }

    try {
      const colRef = collection(db, "products");
      let q = query(colRef, orderBy("id", "asc"));
      
      if (activeOnly) {
        // Filter out drafts on public site
        q = query(colRef, where("status", "==", "active"), orderBy("id", "asc"));
      }

      const snap = await getDocs(q);
      const list: Product[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data() as Product);
      });
      return list;
    } catch (e) {
      console.error("Firestore getProducts error:", e);
      return [];
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    if (!isFirebaseConfigured) {
      const list = MockDb.getProducts();
      return list.find(p => p.id === id) || null;
    }

    try {
      const docRef = doc(db, "products", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as Product;
      }
      return null;
    } catch (e) {
      console.error("Firestore getProduct error:", e);
      return null;
    }
  },

  async addProduct(product: Product): Promise<boolean> {
    if (!isFirebaseConfigured) {
      const list = MockDb.getProducts();
      const idx = list.findIndex(p => p.id === product.id);
      if (idx > -1) {
        list[idx] = product;
      } else {
        list.push(product);
      }
      MockDb.saveProducts(list);
      return true;
    }

    try {
      const docRef = doc(db, "products", product.id);
      await setDoc(docRef, {
        ...product,
        updatedAt: serverTimestamp(),
        createdAt: product.createdAt || serverTimestamp()
      }, { merge: true });
      return true;
    } catch (e) {
      console.error("Firestore addProduct error:", e);
      return false;
    }
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<boolean> {
    if (!isFirebaseConfigured) {
      const list = MockDb.getProducts();
      const idx = list.findIndex(p => p.id === id);
      if (idx > -1) {
        list[idx] = { ...list[idx], ...data };
        MockDb.saveProducts(list);
        return true;
      }
      return false;
    }

    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (e) {
      console.error("Firestore updateProduct error:", e);
      return false;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (!isFirebaseConfigured) {
      const list = MockDb.getProducts();
      const filtered = list.filter(p => p.id !== id);
      MockDb.saveProducts(filtered);
      return true;
    }

    try {
      const docRef = doc(db, "products", id);
      await deleteDoc(docRef);
      return true;
    } catch (e) {
      console.error("Firestore deleteProduct error:", e);
      return false;
    }
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    if (!isFirebaseConfigured) {
      return MockDb.getCategories();
    }

    try {
      const colRef = collection(db, "categories");
      const snap = await getDocs(colRef);
      const list: Category[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data() as Category);
      });
      return list;
    } catch (e) {
      console.error("Firestore getCategories error:", e);
      return [];
    }
  },

  async addCategory(category: Category): Promise<boolean> {
    if (!isFirebaseConfigured) {
      const list = MockDb.getCategories();
      const idx = list.findIndex(c => c.id === category.id);
      if (idx > -1) {
        list[idx] = category;
      } else {
        list.push(category);
      }
      MockDb.saveCategories(list);
      return true;
    }

    try {
      const docRef = doc(db, "categories", category.id);
      await setDoc(docRef, category, { merge: true });
      return true;
    } catch (e) {
      console.error("Firestore addCategory error:", e);
      return false;
    }
  },

  async updateCategory(id: string, name: string, active: boolean): Promise<boolean> {
    if (!isFirebaseConfigured) {
      const list = MockDb.getCategories();
      const idx = list.findIndex(c => c.id === id);
      if (idx > -1) {
        list[idx] = { ...list[idx], name, active };
        MockDb.saveCategories(list);
        return true;
      }
      return false;
    }

    try {
      const docRef = doc(db, "categories", id);
      await updateDoc(docRef, { name, active });
      return true;
    } catch (e) {
      console.error("Firestore updateCategory error:", e);
      return false;
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (!isFirebaseConfigured) {
      const list = MockDb.getCategories();
      const filtered = list.filter(c => c.id !== id);
      MockDb.saveCategories(filtered);
      return true;
    }

    try {
      const docRef = doc(db, "categories", id);
      await deleteDoc(docRef);
      return true;
    } catch (e) {
      console.error("Firestore deleteCategory error:", e);
      return false;
    }
  },

  // --- SETTINGS ---
  async getSettings(): Promise<StoreConfig> {
    if (!isFirebaseConfigured) {
      return MockDb.getSettings();
    }

    try {
      const docRef = doc(db, "settings", "store_config");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { ...DEFAULT_SETTINGS, ...snap.data() } as StoreConfig;
      } else {
        // Initial seed settings if not created
        await setDoc(docRef, DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }
    } catch (e) {
      console.error("Firestore getSettings error:", e);
      return DEFAULT_SETTINGS;
    }
  },

  async updateSettings(data: Partial<StoreConfig>): Promise<boolean> {
    if (!isFirebaseConfigured) {
      const config = MockDb.getSettings();
      const updated = { ...config, ...data };
      MockDb.saveSettings(updated);
      return true;
    }

    try {
      const docRef = doc(db, "settings", "store_config");
      await setDoc(docRef, data, { merge: true });
      return true;
    } catch (e) {
      console.error("Firestore updateSettings error:", e);
      return false;
    }
  },

  // --- DATABASE SEED / INIT ---
  async initializeDatabase(sampleProducts: Product[]): Promise<boolean> {
    if (!isFirebaseConfigured) {
      MockDb.saveProducts(sampleProducts);
      MockDb.saveCategories(DEFAULT_CATEGORIES);
      MockDb.saveSettings(DEFAULT_SETTINGS);
      return true;
    }

    try {
      // 1. Seed Products using batch
      const batch = writeBatch(db);
      sampleProducts.forEach(prod => {
        const docRef = doc(db, "products", prod.id);
        batch.set(docRef, {
          ...prod,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      });
      await batch.commit();

      // 2. Seed Categories
      for (const cat of DEFAULT_CATEGORIES) {
        await this.addCategory(cat);
      }

      // 3. Seed Settings
      await this.getSettings(); // automatically seeds if doesn't exist

      return true;
    } catch (e) {
      console.error("Firestore initializeDatabase error:", e);
      return false;
    }
  }
};
