import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Types for catering marketplace state management
 */
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  portionSizes: Array<{ size: string; multiplier: number }>;
  description: string;
  preparationTime: number;
  allergens?: string[];
}

export interface QuotationLineItem {
  menuItemId: string;
  menuItem?: MenuItem;
  portionSize: string;
  quantityPerGuest: number;
  pricePerGuest: number;
  lineTotal: number;
}

export interface EventPackageBuilder {
  eventId?: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  location: string;
  cuisinePreferences: string[];
  serviceMode: "onsite" | "pickup" | "delivery";
  items: QuotationLineItem[];
  specialRequests?: string;
  dietaryRestrictions?: string;
  totalEstimate: number;
  depositPercentage: number;
  estimatedDeposit: number;
}

export interface Quotation {
  id: string;
  catererId: string;
  caterName: string;
  eventId: string;
  items: QuotationLineItem[];
  depositPercentage: number;
  depositAmount: number;
  totalAmount: number;
  expiresAt: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  receivedAt: string;
}

export interface QuotationComparison {
  quotations: Quotation[];
  selectedCatererId?: string;
  notes?: Record<string, string>; // catererId -> notes
}

/**
 * State type for the catering event store
 */
export type CateringState = {
  // Event package builder
  eventPackageBuilder: EventPackageBuilder | null;
  quotations: Quotation[];
  quotationComparison: QuotationComparison;
  selectedQuotationId?: string;
  
  // UI state
  loading: boolean;
  error: string | null;
};

/**
 * Actions type for the catering event store
 */
export type CateringActions = {
  // Event package builder
  initEventPackage: (event: Partial<EventPackageBuilder>) => void;
  updateEventPackage: (updates: Partial<EventPackageBuilder>) => void;
  addMenuItemToPackage: (item: QuotationLineItem) => void;
  removeMenuItemFromPackage: (menuItemId: string) => void;
  updateMenuItemQuantity: (menuItemId: string, quantity: number) => void;
  clearEventPackage: () => void;
  calculatePackageTotals: () => void;

  // Quotations
  addQuotation: (quotation: Quotation) => void;
  removeQuotation: (quotationId: string) => void;
  updateQuotation: (quotationId: string, updates: Partial<Quotation>) => void;
  clearQuotations: () => void;
  selectQuotation: (quotationId: string) => void;
  setQuotations: (quotations: Quotation[]) => void;

  // Quotation comparison
  addToComparison: (quotation: Quotation) => void;
  removeFromComparison: (catererId: string) => void;
  addComparisonNote: (catererId: string, note: string) => void;
  setSelectedCaterer: (catererId: string) => void;
  clearComparison: () => void;

  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

const initialEventPackage: EventPackageBuilder = {
  eventName: "",
  eventDate: "",
  eventTime: "",
  guestCount: 0,
  location: "",
  cuisinePreferences: [],
  serviceMode: "onsite",
  items: [],
  specialRequests: "",
  dietaryRestrictions: "",
  totalEstimate: 0,
  depositPercentage: 50,
  estimatedDeposit: 0,
};

/**
 * Zustand store for catering marketplace event, quotation, and booking state
 * Persists to localStorage for session continuity
 */
export const useCateringStore = create<CateringState & CateringActions>()(
  persist(
    (set) => ({
      // Initial state
      eventPackageBuilder: null,
      quotations: [],
      quotationComparison: {
        quotations: [],
      },
      loading: false,
      error: null,

      // Event package builder actions
      initEventPackage: (event) =>
        set({
          eventPackageBuilder: {
            ...initialEventPackage,
            ...event,
          },
        }),

      updateEventPackage: (updates) =>
        set((state) => ({
          eventPackageBuilder: state.eventPackageBuilder
            ? { ...state.eventPackageBuilder, ...updates }
            : null,
        })),

      addMenuItemToPackage: (item) =>
        set((state) => {
          if (!state.eventPackageBuilder) return state;

          const existingItem = state.eventPackageBuilder.items.find(
            (i) => i.menuItemId === item.menuItemId && i.portionSize === item.portionSize
          );

          const updatedItems = existingItem
            ? state.eventPackageBuilder.items.map((i) =>
                i.menuItemId === item.menuItemId && i.portionSize === item.portionSize
                  ? {
                      ...i,
                      quantityPerGuest: i.quantityPerGuest + item.quantityPerGuest,
                      lineTotal: (i.quantityPerGuest + item.quantityPerGuest) * item.pricePerGuest * (state.eventPackageBuilder?.guestCount || 1),
                    }
                  : i
              )
            : [...state.eventPackageBuilder.items, item];

          return {
            eventPackageBuilder: {
              ...state.eventPackageBuilder,
              items: updatedItems,
            },
          };
        }),

      removeMenuItemFromPackage: (menuItemId) =>
        set((state) => {
          if (!state.eventPackageBuilder) return state;

          return {
            eventPackageBuilder: {
              ...state.eventPackageBuilder,
              items: state.eventPackageBuilder.items.filter(
                (i) => i.menuItemId !== menuItemId
              ),
            },
          };
        }),

      updateMenuItemQuantity: (menuItemId, quantity) =>
        set((state) => {
          if (!state.eventPackageBuilder) return state;

          const updatedItems = state.eventPackageBuilder.items.map((item) =>
            item.menuItemId === menuItemId
              ? {
                  ...item,
                  quantityPerGuest: quantity,
                  lineTotal: quantity * item.pricePerGuest * (state.eventPackageBuilder?.guestCount || 1),
                }
              : item
          );

          return {
            eventPackageBuilder: {
              ...state.eventPackageBuilder,
              items: updatedItems,
            },
          };
        }),

      calculatePackageTotals: () =>
        set((state) => {
          if (!state.eventPackageBuilder) return state;

          const totalEstimate = state.eventPackageBuilder.items.reduce(
            (sum, item) => sum + item.lineTotal,
            0
          );

          const estimatedDeposit = totalEstimate * (state.eventPackageBuilder.depositPercentage / 100);

          return {
            eventPackageBuilder: {
              ...state.eventPackageBuilder,
              totalEstimate,
              estimatedDeposit,
            },
          };
        }),

      clearEventPackage: () =>
        set({
          eventPackageBuilder: null,
        }),

      // Quotation actions
      addQuotation: (quotation) =>
        set((state) => {
          const existing = state.quotations.find((q) => q.id === quotation.id);
          if (existing) {
            return {
              quotations: state.quotations.map((q) =>
                q.id === quotation.id ? quotation : q
              ),
            };
          }
          return {
            quotations: [...state.quotations, quotation],
          };
        }),

      removeQuotation: (quotationId) =>
        set((state) => ({
          quotations: state.quotations.filter((q) => q.id !== quotationId),
          quotationComparison: {
            ...state.quotationComparison,
            quotations: state.quotationComparison.quotations.filter(
              (q) => q.id !== quotationId
            ),
          },
        })),

      updateQuotation: (quotationId, updates) =>
        set((state) => ({
          quotations: state.quotations.map((q) =>
            q.id === quotationId ? { ...q, ...updates } : q
          ),
        })),

      clearQuotations: () =>
        set({
          quotations: [],
          selectedQuotationId: undefined,
        }),

      selectQuotation: (quotationId) =>
        set({
          selectedQuotationId: quotationId,
        }),

      setQuotations: (quotations) =>
        set({
          quotations,
        }),

      // Quotation comparison actions
      addToComparison: (quotation) =>
        set((state) => {
          const existing = state.quotationComparison.quotations.find(
            (q) => q.id === quotation.id
          );
          if (existing) return state;

          return {
            quotationComparison: {
              ...state.quotationComparison,
              quotations: [...state.quotationComparison.quotations, quotation],
            },
          };
        }),

      removeFromComparison: (catererId) =>
        set((state) => ({
          quotationComparison: {
            ...state.quotationComparison,
            quotations: state.quotationComparison.quotations.filter(
              (q) => q.catererId !== catererId
            ),
            selectedCatererId:
              state.quotationComparison.selectedCatererId === catererId
                ? undefined
                : state.quotationComparison.selectedCatererId,
          },
        })),

      addComparisonNote: (catererId, note) =>
        set((state) => ({
          quotationComparison: {
            ...state.quotationComparison,
            notes: {
              ...state.quotationComparison.notes,
              [catererId]: note,
            },
          },
        })),

      setSelectedCaterer: (catererId) =>
        set((state) => ({
          quotationComparison: {
            ...state.quotationComparison,
            selectedCatererId: catererId,
          },
        })),

      clearComparison: () =>
        set((state) => ({
          quotationComparison: {
            quotations: [],
            notes: {},
          },
        })),

      // Utility actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      reset: () =>
        set({
          eventPackageBuilder: null,
          quotations: [],
          quotationComparison: { quotations: {} },
          selectedQuotationId: undefined,
          loading: false,
          error: null,
        }),
    }),
    {
      name: "catering-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        eventPackageBuilder: state.eventPackageBuilder,
        quotations: state.quotations,
        quotationComparison: state.quotationComparison,
      }),
    }
  )
);

export default useCateringStore;
