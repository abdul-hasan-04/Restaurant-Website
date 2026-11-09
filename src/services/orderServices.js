import supabase from "../lib/supabase"

export const createOrder = async orderInfo => {
    const { data, error } = await supabase.from("orders")
        .insert(orderInfo)
        .select()
        .single();

    if (error) {
        throw error
    }
    return data
}
export const createOrderItem = async (orderItems) => {
    const { data, error } = await supabase
        .from("order_items")
        .insert(orderItems)
        .select();

    console.log("Inserted order items:", data);
    console.log("Insertion error:", error);

    if (error) throw error;

    return data;
};

export const getOrder = async (id, isUser = false) => {
    let query = supabase
        .from("orders")
        .select(`
    *,
    user_info:users(
    full_name,
    email
    )
    `).eq("user_id", id).order("created_at", {ascending : false})
    const { data, error } = await query;

    if (error) {
        console.error("Failed to order", id);
        throw error
    }

    return data
}
export const getOrderItems = async order_id => {
    const { data, error } = await supabase
        .from("order_items")
        .select(`
    id,
    price,
    quantity,
    order_id,
    subtotal,
    menu_items(
     name,
     id,
     image_url
    )
    `).eq("order_id", order_id)

    if (error) {
        throw error
    }

    return data
}
export const getAllOrderItems = async () => {
    const { data, error } = await supabase
        .from("order_items")
        .select(`
    id,
    price,
    quantity,
    order_id,
    subtotal,
    menu_items(
     name,
     id,
     image_url
    )
    `)

    if (error) {
        throw error
    }

    return data
}

export const updateOrderStatus = async (orderId, status) => {
    const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();

    if (error) {
        throw error
    }

    return data
}


export const subscribeToOrders = (callback) => {
    const channel = supabase
        .channel("order_status_channel")
        .on(
            "POSTGRESS_CHANGES",
            {
                event: "*",
                schema: "public",
                table: "orders"
            },
            (payload) => {
                callback(payload);
            }
        )
        .subscribe();

    return channel;
};


export const getAllOrders = async ({offset = 0,limit = 6} = {}) => {
    const { data, error,count} = await supabase
        .from("orders")
        .select(`
        *,
        user_info:users(
        id,
        full_name
        )
        `, {count : "exact"})
        .order("updated_at", { ascending: false })
        .range(offset, offset + limit - 1)
    if (error) throw error;

    return {data, count};
};