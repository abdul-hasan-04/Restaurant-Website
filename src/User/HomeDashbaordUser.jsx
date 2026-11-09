import { AArrowDown, ArrowRight, CartonIcon, ChevronRight, ClockArrowUp, HeartIcon, HeaterIcon, HelpCircle, MessageCircleQuestionMark, SearchIcon, ShoppingCart, UtensilsCrossed } from 'lucide-react'
import food_for_welcome_card from "../assets/Ful_Bol_of_Noodles-removebg-preview.png"
import useAuth from '../hooks/useAuth'
import { useEffect, useReducer, useState, useTransition } from 'react';
import supabase from '../lib/supabase';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import specialOfferFood from "../assets/Grilled Chicken with Fresh Garden Salad.png"
import { getCartItem, getOrAddNewCartItem, getOrCreateCart } from '../services/cartServices';
import FeaturedMenuCard from './FeaturedMenuCard';
import { getUserProfile } from '../services/authServices';
import { Link } from 'react-router';
function HomeDashbaordUser() {
    const { profile, user } = useAuth();
    const [featuredMenu, setFeaturedMenu] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [searchedValue,setSearchedValue] = useState("");
    useEffect(() => {
        // fetch featured menu //
        const fetchFeaturedMenu = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const { data, error } = await supabase.from("menu_items")
                    .select("*")
                    .eq("is_available", true)
                    .eq("is_featured", true)
                    .limit(3)
                if (error) {
                    setError(error?.message)
                    throw error
                }
                setFeaturedMenu(data);
            } catch (error) {
                console.error("Failed to fetch featured menus");
                toast.error("Failed to fetch featured menus")
            } finally {
                setIsLoading(false);
            }
        }
        fetchFeaturedMenu();
    }, []);
    const filterItems = featuredMenu.filter((item) => item.name.toLowerCase().includes(searchedValue.toLocaleLowerCase()))
    return (
        <div className="home_dashboard_container">
            <div className="header_search relative bg-primary/5  shadow mb-4 rounded-full">
                <input type="text" placeholder='Search for food' value={searchedValue} onChange={(e) => setSearchedValue(e.target.value)} className='outline-none focus:border-text/20 focus:border border border-text/30 rounded-full block w-full pl-10  text-sm placeholder:text-sm py-3' />
                <SearchIcon className='w-4 absolute top-1/2 -translate-y-1/2 left-3' />
            </div>
            <div className="grid_container grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="main_content col-span-full lg:col-span-3 flex flex-col gap-6">
                    <div className="welcome_section  place-content-center h-50 p-3 bg-linear-to-br from-card/25 shadow-md border border-border/30 to-background/45 rounded-md relative">
                        <div className="food-image absolute h-full right-0 md:top-0 -bottom-30 md:bottom-5 z-50">
                            <img src={food_for_welcome_card} alt={food_for_welcome_card} className='w-16 md:w-36 lg:w-full h-20 md:h-full mix-blend-overlay object-cover rounded-lg' />
                        </div>
                        <div className="text_content_welcome flex flex-col space-y-1 items-start">
                            <h2 className='text-xs uppercase'>Welcome Back</h2>
                            <h1 className='font-black text-sm md:text-xl'>Hello,{profile?.full_name || profile.email.split("@")[0]}</h1>
                            <p className='text-text/60 md:text-sm text-xs'>Let's make today a great one. Check what's new in your restaurant.</p>
                            <button type='button' className='bg-primary px-4 py-1 font-semibold rounded-full text-xs'>Browse Menu</button>
                        </div>
                    </div>
                    <div className="show_case_container flex *:text-center flex-col gap-3 md:flex-row flex-wrap md:*:w-[calc(33.33%-8px)] lg:*:w-[calc(25%-9px)]">
                        <div className="showCase bg-surface  rounded-md shadow border border-border/45 p-4 flex flex-col gap-2 items-center justify-center">
                            <div className="icon_container w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                                <UtensilsCrossed className='w-6 h-6' />
                            </div>
                            <h2 className='text-base md:text-balance font-semibold'>Browse Menu</h2>
                            <p className='text-[11px] text-text/70'>Explore Our Delicious Meals.</p>
                        </div>
                        <div className="showCase bg-surface rounded-md shadow border border-border/45 p-4 flex flex-col gap-2 items-center justify-center">
                            <div className="icon_container w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                                <ShoppingCart className='w-6 h-6' />
                            </div>
                            <h2 className='text-base md:text-balance font-semibold'>View Cart</h2>
                            <p className='text-[11px] text-text/70'>Check Your Selected Items.</p>
                        </div>
                        <div className="showCase bg-surface rounded-md shadow border border-border/45 p-4 flex flex-col gap-2 items-center justify-center">
                            <div className="icon_container w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                                <ClockArrowUp className='w-6 h-6' />
                            </div>
                            <h2 className='text-base md:text-balance font-semibold'>Track Order</h2>
                            <p className='text-[11px] text-text/70'>Watch Your Order's Status.</p>
                        </div>
                        <div className="showCase bg-surface rounded-md shadow border border-border/45 p-4 flex flex-col gap-2 items-center justify-center">
                            <div className="icon_container w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                                <HeartIcon className='w-6 h-6' />
                            </div>
                            <h2 className='text-base md:text-balance font-semibold truncate'>Your Favorites</h2>
                            <p className='text-[11px] text-text/70'>Findout Your Favorite Meals.</p>
                        </div>
                    </div>
                    <div className="featured_menus_container">
                        <div className="1s_row flex items-center justify-between mb-4">
                            <h2 className="title font-semibold">Featured Menu</h2>
                            <Link to={"/menu"} className='className="title text-primary font-semibold text-xs flex items-center cursor-pointer gap-1"'>
                             View All
                            <ArrowRight className='w-4'/>
                            </Link>
                        </div>
                        {isLoading ? (
                            <div className="loading_container flex items-center justify-center">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary">
                                </div>
                            </div>
                        ) : filterItems.length > 0 ? (
                            <div className="featured_menu_listContainer flex gap-4 flex-col md:flex-row md:flex-wrap md:*:w-[calc(33.33%-10.66px)]">
                                {filterItems.map(menu => (
                                   <FeaturedMenuCard menu= {menu} key={menu.id}/>
                                ))}
                            </div>
                        ) : (
                            <h2 className=''>No,featured menu was found.</h2>
                        )
                        }
                    </div>
                </div>
                <div className="side_content col-span-full lg:col-span-1">
                    <div className="sideContent_container flex flex-col gap-4">
                        <div className="recent_orders">
                            <div className="top flex items-center justify-between">
                                <h2 className='text-sm font-semibold'>Your Recent Order</h2>
                                <Link to={"/menu"} className='title text-primary font-semibold  flex text-xs items-center cursor-pointer gap-1'>
                                View All
                                <ArrowRight className='w-4' />
                                </Link>
                            </div>
                            {/* dipslay recent last order for this users */}
                        </div>
                        <div className="special_offer_container overflow-hidden min-h-80 flex items-center relative rounded-xl shadow bg-cover bg-background bg-center bg-no-repeat" style={{ backgroundImage: `url("${specialOfferFood}")` }}>
                            <div className="absolute left-0 right-0 bottom-0 h-full bg-primary/25"></div>
                            <span className='bg-primary px-3 py-2 rounded-full text-xs shadow-2xl font-semibold absolute top-3 left-2 uppercase'>Special Offer</span>
                            <div className="content bg-background/65 p-2 flex flex-col gap-4 items-start w-full">
                                <h2 className='font-black'>Good Food Bring People Together</h2>
                                <p className='text-xs text-text/80 truncate'>Enjoy 20% off on your next order</p>
                                <button className='font-semibold cursor-pointer text-xs flex items-center gap-2 bg-primary px-6 py-1 rounded-full '>Order Now <ArrowRight className='w-4' /></button>
                            </div>
                        </div>
                        <div className="need_help flex bg-surface p-4 rounded-xl gap-3">
                            <MessageCircleQuestionMark />
                            <div className="help_center_text flex flex-col gap-2 items-start">
                                <h2 className='font-black'>Need Help?</h2>
                                <p className='text-xs text-text/65'>Contact our support team for any question or assistance</p>
                                <button className='text-sm font-semibold cursor-pointer bg-primary px-6 py-1 rounded-full '>Get Support</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeDashbaordUser