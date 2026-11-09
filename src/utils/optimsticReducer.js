export const handleOptimticUpdate = (state, action) => {
  console.log("Reducer ran:", action);
  console.log("Current state:", state);

  switch (action.type) {
    case "EDIT_MENU":
      return state.map((item) =>
        item.id === action.payload.id
          ? action.payload
          : item
      );
    case "DELETE_MENU":
      return state.filter((item) =>
        item.id !== action.payload.id);

    default:
      return state;
  }
};