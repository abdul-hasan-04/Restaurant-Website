export const initialState = {
    error : null,
    isLoading : true,
    cart : []
}

export const reducer = (state,action) => {
    switch(action.type) {
        // SET_CART,SET_LOADING,SET_ERROR//
        case "SET_LOADING" : {
            return {
                ...state,
                isLoading : action.payload
            }
        }
        case "SET_ERROR" : {
            return {
                ...state,
                error : action.payload
            }
        }
        case "SET_CART" : {
            return {
                ...state,
                cart : action.payload,
                isLoading : false
            }
        }

        case "CLEAR_CART" : {
            return {
                ...state,
                cart : action.payload
            }
        }

          case "ADD_ITEM" : {
            const isMenuItemsExist = state.cart.find((item) => item.menu_item_id === action.payload.id );
            if(isMenuItemsExist){
               return{
                  ...state,
                  cart : state.cart.map((item) => item.menu_item_id === action.payload.id ? {...item, quantity : item.quantity + 1} : item)
               }
            }
            return{
                ...state,
                cart : [...state.cart, { menu_items:action.payload, menu_item_id : action.payload.id, quantity : 1}]
            }
        }

        case "SYNC_CART_ITEM" : {
            const {cartItem} = action.payload;
            const exist = state.cart.some(item => item.menu_item_id == cartItem.menu_item_id);
            if(!exist){
                return{
                    ...state,
                    cart : [...state.cart, {...cartItem, menu_items : 33}]
                }
            }

            return {
                ...state,
                cart : [...state.cart.map((item) => {
                    return item.menu_item_id === cartItem.menu_item_id ? {
                      ...cartItem,
                      ...item
                    } :
                     item
                })]
            }
        }

        case "DELETE_ITEM" : {
           return{
             ...state,
             cart : state.cart.filter((item) => item.menu_item_id !== action.payload)
           }
        }
        case  "INCREASE_QUANTITY" : {
            return {
               ...state,
               cart : state.cart.map((item) => item.menu_item_id === action.payload ? {...item, quantity : item.quantity + 1} : item)
            }
        }
        case  "DECREASE_QUANTITY" : {
            return {
               ...state,
               cart : state.cart.map((item) => item.menu_item_id === action.payload ? {...item, quantity : item.quantity - 1} : item)
            }
        }
        // ROLL_BACKS //
        case  "ROLL_BACK_ADD" : {
           const newlyAddedItem = action.payload;
           const addedMenuItem = state.cart.find((item) => item.menu_item_id === newlyAddedItem.id );
           if(addedMenuItem.quantity > 1){
              return{
                ...state,
                cart : state.cart.map((item) => item.menu_item_id === newlyAddedItem.id ? {...item, quantity : item.quantity - 1} : item)
              }
           }
           return {
            ...state,
            cart : state.cart.filter((item) => item.menu_item_id !== newlyAddedItem.id )
           }
        }

        case "ROLL_BACK_DELETE" : {
            const deleteItem = state.cart.find((item) => item.menu_item_id === action.payload.id);
            return{
                ...state,
                cart : [...action.state, deleteItem]
            }
        }

        case "ROLL_BACK_CLEAR" : {
            return {
                ...state,
                cart : action.payload
            }
        }
        case "ROLL_BACK_UPDATE_QUANTITY" : {
            const updatedItem = state.cart.find((item) => item.menu_item_id === action.payload.id);
            return {
                ...state,
                cart : state.cart.map((item) => item.menu_item_id === updatedItem.id ? {...item, quantity : updatedItem.quantity} : item)
            }
        }

        case "SYNC_REAL_MENU_ITEM" : {
            return {
                ...state,
                cart : state.cart.map((item) => item.menu_item_id === action.payload.id ? {...item, id:action.payload.id} : item)
            }
        }
        default : return state
    }
}