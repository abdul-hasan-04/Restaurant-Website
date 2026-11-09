import supabase from "../lib/supabase"

export const createMenuItems = async (menu_item) => {

  const {data,error} = await supabase
  .from("menu_items")
  .insert(menu_item)
  .select()
  .single();

  if(error) {
    throw error
  }
  return data
}


export const fetchMenuItems = async({includeHiddenMenus = false, limit = 10, offset = 0} = {}) => {
  let query = supabase.from("menu_items")
  .select("*", { count: "exact" })
  .order("created_at", {ascending : false})
  .range(offset, offset + limit - 1)

  if(!includeHiddenMenus){
     query = query.eq("is_available", true)
  }

  const {data, error, count} = await query;

  if(error){
     throw error
  }

  return {data, error, count}
}