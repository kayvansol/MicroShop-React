export const initialBasket = {
  customerId: 4,
  items: [],
  error: null,
};

export function basketReducer(state, action) {

  switch (action.type) {

    case "ADD_ITEM": {
      const exists = state.items.find(
        (x) => x.productId === action.payload.productId
      );

      let updated;
      if (exists) {
        updated = state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...state.items, { ...action.payload, quantity: 1 }];
      }

      return { ...state, items: updated, error: null };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) => i.productId !== action.payload.productId
        ),
      };

    case "INCREASE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };

    case "DECREASE_QTY":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((x) => x.quantity > 0), // اگر شد 0 حذف می‌شود
      };

    case "SET_CUSTOMER":
      return { ...state, customerId: action.payload };

    case "LOAD_FROM_JSON":
      return action.payload;

    default:
      return state;
  }
  
}
