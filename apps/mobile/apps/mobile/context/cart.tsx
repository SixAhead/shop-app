import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { loadCart, saveCart } from "../lib/storage";

export type CartItem = { id: string; title: string; priceCents: number; qty: number };
type State = { items: CartItem[]; loaded: boolean };
type Action =
  | { type: "ADD"; item: Omit<CartItem, "qty"> }
  | { type: "REMOVE_ONE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "CLEAR" }
  | { type: "LOAD"; state: State };

const CartCtx = createContext<{
  state: State;
  add: (i: Omit<CartItem, "qty">) => void;
  removeOne: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}>({ state: { items: [], loaded: false }, add: () => {}, removeOne: () => {}, setQty: () => {}, clear: () => {} });

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD": return action.state;
    case "ADD": {
      const idx = state.items.findIndex(i => i.id === action.item.id);
      const items = [...state.items];
      if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + 1 };
      else items.push({ ...action.item, qty: 1 });
      return { ...state, items };
    }
    case "REMOVE_ONE": {
      const items = state.items
        .map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0);
      return { ...state, items };
    }
    case "SET_QTY": {
      const items = state.items
        .map(i => i.id === action.id ? { ...i, qty: Math.max(0, action.qty) } : i)
        .filter(i => i.qty > 0);
      return { ...state, items };
    }
    case "CLEAR": return { ...state, items: [] };
    default: return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], loaded: false });

  useEffect(() => { (async () => {
    const saved = await loadCart<State>();
    if (saved) dispatch({ type: "LOAD", state: { ...saved, loaded: true } });
    else dispatch({ type: "LOAD", state: { items: [], loaded: true } });
  })(); }, []);

  useEffect(() => { if (state.loaded) saveCart(state); }, [state]);

  const api = useMemo(() => ({
    state,
    add: (item: Omit<CartItem, "qty">) => dispatch({ type: "ADD", item }),
    removeOne: (id: string) => dispatch({ type: "REMOVE_ONE", id }),
    setQty: (id: string, qty: number) => dispatch({ type: "SET_QTY", id, qty }),
    clear: () => dispatch({ type: "CLEAR" }),
  }), [state]);

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}

export function useCart() { return useContext(CartCtx); }
export function useCartCount() { return useContext(CartCtx).state.items.reduce((n, i) => n + i.qty, 0); }
export function useCartTotalCents() { return useContext(CartCtx).state.items.reduce((sum, i) => sum + i.priceCents * i.qty, 0); }
