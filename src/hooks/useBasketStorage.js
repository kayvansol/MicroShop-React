import { useReducer, useEffect } from "react";
import { basketReducer, initialBasket } from "@shared/assets/js/basketReducer";

export function useBasketStorage() {
  const [state, dispatch] = useReducer(
    basketReducer,
    initialBasket,
    (init) => {
      const saved = localStorage.getItem("basket");
      return saved ? JSON.parse(saved) : init;
    }
  );

  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(state));
  }, [state]);

  return { state, dispatch };
}
