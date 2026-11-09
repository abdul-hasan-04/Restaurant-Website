import { AArrowDown, ShoppingCart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import UseCart from '../hooks/UseCart';
import { toast } from 'react-toastify';
import supabase from '../lib/supabase';
import useAuth from '../hooks/useAuth';
import { deleteOrInsert } from '../services/favoriteMenuServices';
import { data } from 'react-router';
import { getOrAddNewCartItem, getOrCreateCart } from '../services/cartServices';

function FeaturedMenuCard({ menu }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [cart, setCart] = useState([]);
    const { state, dispatch } = UseCart();
    const { user } = useAuth();
    const [isAddingCart, setIsAddingCart] = useState(false);


    useEffect(() => {
        if (!user) {
            setIsLiked(false);
            return
        }
        const synchronize = async () => {
            try {
                const { data, error } = await supabase.from("favorite_menu_items")
                    .select("*")
                    .eq("user_id", user?.id)
                    .eq("menu_item_id", menu.id)
                    .maybeSingle()
                setIsLiked(data ?? false)
                if (error) {
                    throw error
                }
            } catch (error) {

            }
        }

        synchronize();

    }, [user?.id])
    const handleLike = async menu => {
        if(!user?.id) return;
        if (isLiking) return;
        setIsLiking(true);
        const nextLike = !isLiked;
        setIsLiked(nextLike);
        try {
            await deleteOrInsert(user.id, menu.id);

        } catch (error) {
            //ROLL_BACK//
            toast.error(`Failed to ${nextLike ? "Like" : "Dislike"}`)
            setIsLiked(!nextLike)
        }

        setIsLiking(false)
    }

    const handleAddToCart = async item => {
        dispatch({
            type: "ADD_ITEM",
            payload: item
        })
        if (isAddingCart) return;
        setIsAddingCart(true);
        try {
            const cart = await getOrCreateCart(user.id);
            const cartItem = await getOrAddNewCartItem(cart.id, item.id);
            dispatch({
                type: "SYNC_CART_ITEM",
                payload: {
                    cartItem: cartItem
                }
            });
        } catch (error) {
            toast.error("Failed");
        } finally {
            setIsAddingCart(false);
        }
    }
    return (
        <div className="featured_item bg-surface border border-text/10 rounded-lg shadow-lg overflow-hidden relative flex-col flex gap-2" key={menu?.id}>
            <div className={`heart text-xl *:cursor-pointer bg-accent w-8 h-8 shadow-2xl absolute bottom-4 right-4 rounded-full flex items-center justify-center`} onClick={() => handleLike(menu)}>
                {isLiked ? <FaHeart className='text-red-600 rounded-full w-4' /> : <FaRegHeart className='w-4' />}
            </div>
            <img src={menu?.image_url} alt={menu?.name} className='w-full h-48 object-cover' />
            <div className="content flex flex-col gap-2 items-start py-4 px-2.5">
                <h2 className="menu_name font-semibold">{menu?.name}</h2>
                <p className="menu_dscription text-xs text-text/80 truncate">{menu?.description}</p>
                <span className='font-black'>{`$${menu?.price}`}</span>
                <button type='button'
                    onClick={() => handleAddToCart(menu)}
                    className='bg-primary cursor-pointer flex items-center capitalize font-semibold gap-2 py-0.5 px-2 rounded text-text text-xs'>
                    <ShoppingCart className='w-4' />
                    Add to cart
                </button>
            </div>
        </div>
    )
}

export default FeaturedMenuCard