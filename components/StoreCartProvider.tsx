"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CatalogData, CatalogProduct } from "@/lib/catalog";
import { DEFAULT_CATALOG } from "@/lib/catalog";
import type { StoreCartItem } from "@/lib/orderTypes";
import { StoreCartDrawer } from "./StoreCartDrawer";

const STORAGE_KEY = "barraca-store-cart-v1";

interface StoreCartContextValue {
  catalog: CatalogData;
  items: StoreCartItem[];
  itemCount: number;
  isOpen: boolean;
  addProduct: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getProduct: (productId: string) => CatalogProduct | undefined;
}

const StoreCartContext = createContext<StoreCartContextValue | null>(null);

export function StoreCartProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<CatalogData>(DEFAULT_CATALOG);
  const [items, setItems] = useState<StoreCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(normalizeItems(JSON.parse(stored)));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/catalog", { signal: controller.signal, cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: CatalogData) => setCatalog(data))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const addProduct = useCallback((productId: string, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(20, item.quantity + quantity) }
            : item,
        );
      }
      return [...current, { productId, quantity: Math.max(1, Math.min(20, quantity)) }];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((item) => item.productId !== productId));
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(20, quantity) }
          : item,
      ),
    );
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const getProduct = useCallback(
    (productId: string) => {
      const product = catalog.products.find((entry) => entry.id === productId);
      const category = product
        ? catalog.categories.find((entry) => entry.id === product.categoryId)
        : undefined;
      return product?.visible && category?.visible ? product : undefined;
    },
    [catalog.categories, catalog.products],
  );

  const value = useMemo<StoreCartContextValue>(
    () => ({
      catalog,
      items,
      itemCount: items.reduce(
        (total, item) => total + (getProduct(item.productId) ? item.quantity : 0),
        0,
      ),
      isOpen,
      addProduct,
      updateQuantity,
      removeProduct,
      clearCart: () => setItems([]),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      getProduct,
    }),
    [catalog, items, isOpen, addProduct, updateQuantity, removeProduct, getProduct],
  );

  return (
    <StoreCartContext.Provider value={value}>
      {children}
      <StoreCartDrawer />
    </StoreCartContext.Provider>
  );
}

export function useStoreCart(): StoreCartContextValue {
  const context = useContext(StoreCartContext);
  if (!context) throw new Error("useStoreCart debe usarse dentro de StoreCartProvider.");
  return context;
}

function normalizeItems(value: unknown): StoreCartItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is StoreCartItem =>
        Boolean(
          item &&
            typeof item === "object" &&
            typeof item.productId === "string" &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0,
        ),
    )
    .map((item) => ({ ...item, quantity: Math.min(20, item.quantity) }))
    .slice(0, 30);
}
