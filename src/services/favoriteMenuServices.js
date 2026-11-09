import { data } from "react-router";
import supabase from "../lib/supabase"

export const deleteOrInsert = async (userId,menuItemId) => {
     const {data: existingFavoriteMenu, error : existingError} = await supabase
     .from("favorite_menu_items")
     .select(`
        *,
        menu_items(
        id,
        name,
        description,
        price,
        image_url
        )
        `)
     .eq("user_id", userId)
     .eq("menu_item_id", menuItemId)
     .maybeSingle();

     if(existingFavoriteMenu) {
         const {data : deletedFavItem, error} = await supabase
         .from("favorite_menu_items")
         .delete()
         .eq("user_id", userId)
         .eq("menu_item_id", menuItemId)
         if(error){
             throw error
         }
         return deletedFavItem;
     }

     const {data : newFavoriteMenuItem, error : newFavError} = await
     supabase.from("favorite_menu_items")
     .insert({
        user_id : userId,
        menu_item_id : menuItemId
     })

     if(newFavError){
         throw newFavError
     }


}