import supabase from "../lib/supabase"
export const getOrCreateCart = async (userId) => {
  if (!userId) {
    throw new Error("You must be logged in to use a cart.");
  }

  if(!userId) return;
  const { data: existingCart, error: fetchError } =
    await supabase
      .from("carts")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (existingCart) {
    return existingCart;
  }

  const { data: newCart, error: createError } =
    await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select()
      .single();

  if (createError) {
    throw createError;
  }

  return newCart;
};

export const getCartItem = async (cartId) => {
   if(!cartId) return
  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      id,cart_id,menu_item_id,quantity,
      menu_items(
      id,
      name,
      description,
      price,
      image_url
      )
      `).eq("cart_id", cartId)

  if (error) {
    throw error
  }

  return data
}



export const getOrAddNewCartItem = async (cartId, menuItemId) => {
  if(!cartId) return
  const { data: existingCartItem, error: fetchError } = await supabase.from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("menu_item_id", menuItemId)
    .maybeSingle();

  if (fetchError) {
    throw error
  }

  if (existingCartItem) {
    const { data: updateExisting, error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: existingCartItem.quantity + 1 })
      .eq("menu_item_id", menuItemId)
      .eq("cart_id", cartId)
      .select()
      .single();

    if (updateError) {
      throw updateError
    }

    return updateExisting
  }


  const { data: newCartItem, error: newCartItemError } = await supabase
    .from("cart_items")
    .insert({ cart_id: cartId, menu_item_id: menuItemId })
    .select()
    .single();

  if (newCartItemError) {
    console.error("Failed to create new cart Item");
    throw newCartItemError
  }

  return newCartItem
}



export const updateCartItem = async (cartItemId, quantity) => {
  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .select()
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error(
      "No cart item was updated. Check the cart item ID and RLS policies."
    );
  }
  return data;
};


export const deleteCartItem = async id => {
  const { data, error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", id)
}