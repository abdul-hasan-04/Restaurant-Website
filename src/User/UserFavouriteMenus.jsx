import { Hamburger, Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth';
import supabase from '../lib/supabase';
import UseCart from '../hooks/UseCart';
import { getOrAddNewCartItem, getOrCreateCart } from '../services/cartServices';
import { toast } from 'react-toastify';

function UserFavouriteMenus() {
  const [favMeals,setFavMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {user} = useAuth();
  const {state,dispatch} = UseCart();
  const [isAddingCart,setIsAddingCart] = useState(false);
  useEffect(() => {
    const userId = user?.uid || user?.id || user?.email;
    if (!userId) {
      setFavMeals([]);
      setIsLoading(false);
      return;
    }
    const fetchFavouriteMenus = async () => {
      setIsLoading(true);
      try {
        const {data} = await supabase
        .from("favorite_menu_items")
        .select(`*,
          menu_items(
          name,
          id,
          description,
          image_url,
          price,
          category
          )
          `)
        .eq("user_id", user?.id);
        setFavMeals(data);
      } catch (error) {
         console.error("Failed to fetch liked menus", error);
      } finally {
       setIsLoading(false);
      }
    };

    fetchFavouriteMenus();
  }, [user?.id]);

   const handleAddToCart = async item => {
          dispatch({
              type: "ADD_ITEM",
              payload: item.menu_items
          })
          if (isAddingCart) return;
          setIsAddingCart(true);
          try {
              const cart = await getOrCreateCart(user.id);
              const cartItem = await getOrAddNewCartItem(cart.id, item.menu_item_id);
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
    <div className="favourite_menu_items">
        <div className="top flex items-center justify-between">
           <div className="left flex flex-col gap-2">
             <h2 className='text-xl flex items-center gap-3 md:text-2xl font-black'>My Favorite Meals <Hamburger/></h2>
             <p className='text-text/75 md:text-sm text-xs'>All your favorite meals, together in one place.</p>
           </div>
           <div className="right">
               <span className='bg-primary text-on-primary w-7 h-7 flex border-2 border-border items-center justify-center text-xs rounded-full'>{favMeals?.length}</span>
           </div>
        </div>

        {isLoading ? (
          <div className="mt-8 flex min-h-64 items-center justify-center rounded-2xl border border-border bg-card" role="status" aria-live="polite">
            <span className="text-sm text-text/70">Loading your favorite meals…</span>
          </div>
        ) : favMeals?.length === 0 ? (
          <div className="mt-8 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Heart size={26} />
            </span>
            <h3 className="text-lg font-bold">No favorite meals yet</h3>
            <p className="mt-2 max-w-sm text-sm text-text/70">
              Save meals you love and they’ll be waiting for you here.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {favMeals?.map((meal) => (
              <div key={meal.id} className="overflow-hidden h-full rounded-2xl border border-border bg-surface shadow-sm">
                {meal.menu_items.image_url && (
                  <img src={meal.menu_items.image_url} alt={meal.menu_items.name} className="h-48 w-full object-cover" />
                )}
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3 flex-1">
                    <div>
                      <h3 className="font-bold">{meal.menu_items.name}</h3>
                      {meal.menu_items.category && <p className="mt-1 text-xs text-text/60">{meal.menu_items.category}</p>}
                    </div>
                  </div>
                  {meal.menu_items.description && <p className="mt-3 text-sm text-text/70 truncate">{meal.menu_items.description}</p>}
                  {meal.menu_items.price != null && <p className="mt-4 font-bold">${Number(meal.menu_items.price).toFixed(2)}</p>}
                <button type='button'
                    onClick={() => handleAddToCart(meal)}
                    className='bg-primary cursor-pointer mt-4 flex items-center capitalize font-semibold gap-2 py-0.5 px-2 rounded text-text text-xs'>
                    <ShoppingCart className='w-4' />
                    Add to cart
                </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

export default UserFavouriteMenus