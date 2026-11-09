import { ChevronLeft, ChevronRight, CloudUpload, Ellipsis, ImageUp, Pencil, Plus, SearchIcon, SquareX, ToggleLeft, ToggleRight, Trash2, XCircle } from 'lucide-react'
import { useEffect, useMemo, useOptimistic, useState, useTransition } from 'react'
import { CgHomeAlt } from 'react-icons/cg'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import { uploadProductImg } from '../services/storageServices';
import { createMenuItems, fetchMenuItems } from '../services/menuServices';
import supabase from '../lib/supabase';
import { handleOptimticUpdate } from '../utils/optimsticReducer';
function MenuItems() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedTerm,setSearchedTerms] = useState("");
  const [activeStatus,setActiveStatus] = useState("all");
  const [count, setCount] = useState(0);
  const [isProductImgUploading, setIsProductImgUploading] = useState(false);
  const [confirmedMenuImageUrl, setConfirmedMenuImageUrl] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isActionMode, setIsActionMode] = useState(false);
  const [currentEditMenuItem, setCurrentEditMenu] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isMenuCreating, setIsMenuCreating] = useState(false);
  const [selectedProductImg, setSelectedProductImg] = useState(null);
  const [deletingItem, setIsDeletingItem] = useState(null)
  const [isImageSelected, setImageSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isMenuStatusActive, setIsMenuStatusActive] = useState("all items");

  const [isUpdateCreateMode, setUpdateCreateMode] = useState(false);
  const colorizeActiveMenuStatus = status => status === isMenuStatusActive ? "bg-text text-background" : "";
  const [isToggleAvailableMode, setIsToggleAvailableMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [nextAvailableMenuState, setNextAvailabiltyMenuState] = useState(null);
  const [isPending, startTranstion] = useTransition();
  const [menuItems, setMenuItems] = useState([]);
  const [optimisticMenuItems, setOptimisticMenuItems] = useOptimistic(menuItems, handleOptimticUpdate);
  let limit = 8;
  let offset = (currentPage - 1) * limit

  // USE FORM HOOK TO CONTROL PRODUCT ADDING FORM ///
  const { handleSubmit, register, reset, formState: { errors } } = useForm();

  // handleProducFormSubmit //
  // functions and logic for product image upload //
  const handleSelectedProductImg = e => {
    const file = e.target.files[0];
    const limtiMbs = 5;
    const limitFileSize = limtiMbs * 1024 * 1024
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(`Sorry, we do not accept this file type.`);
        console.log(data.product_image);
        document.getElementById("product_img").value = "";
        setSelectedProductImg(null);
        return
      }
      if (file.size > limitFileSize) {
        toast.error(`Sorry, a valid image must be = < ${limitFileSize}MB.`);
        document.getElementById("product_img").value = "";
        setSelectedProductImg(null);
        return
      }
      // now we validated product image upload //
      setImageSelected(true);
      setSelectedProductImg(file);
      toast.success(`Product's image uploaded successfully, ${file.name}`)
    }
  }

  const totalPages = Math.ceil(count / limit);
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, count);

  const handleProductImageUpload = async () => {
    if (!selectedProductImg) {
      toast.error("please, choose image to upload first");
      return
    }

    if (!user) {
      toast.error("Oops! user must be logged in");
      return
    }

    //  start uploading product image //
    setIsProductImgUploading(true);
    try {
      const { url } = await uploadProductImg(selectedProductImg, user.id, "menu_image");
      toast.success("Your Image Was Uploaded Successfully.");
      setIsImageUploaded(true);
      setConfirmedMenuImageUrl(url);
      document.getElementById("product_img").value = "";
      setSelectedProductImg(null);
    } catch (error) {
      toast.error(error);
      console.error("Error on uploading image", error);
    } finally {
      setIsProductImgUploading(false);
    }
  }

  const handleCreateMode = () => {
    setIsModelOpen(true)
    setIsEditMode(false);
    setCurrentEditMenu(null);
    setSelectedProductImg(null);
    setImageSelected(null);
    setConfirmedMenuImageUrl(null);

    // reset the form of the menu details //
    reset({
      product_name: "",
      product_description: "",
      product_category: "",
      product_price: "",
    })
  }
  const handleEditMenu = item => {
    setIsModelOpen(true)
    setUpdateCreateMode(true)
    setIsEditMode(true);
    setCurrentEditMenu(item)
    reset({
      product_name: item?.name,
      product_description: item?.description,
      product_category: item?.category,
      product_price: item?.price,
    })
    setConfirmedMenuImageUrl(item.image_url ?? null)
  }
  const handleProducFormSubmit = async data => {
    // control SELECTED IMAGE SIZE,TYPE,etc //
    let imageUrl = confirmedMenuImageUrl;
    // Update the image only if the user is selected another image
    if (selectedProductImg) {
      const shouldUpload = confirm("Ther is selected image who has no been uploaded yet. do you want upload");
      if (!shouldUpload) return;
      const { url } = await uploadProductImg(selectedProductImg, user?.id, "menu_image");
      toast.success("Image was uploaded successfully.");
      imageUrl = url;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    if (!imageUrl) {
      toast.error("Please, upload your image");
      return;
    }

    // start updating exist menu or creating new //
    setIsMenuCreating(true);
    // data needed to be create
    const menuItemsData = {
      name: data.product_name.trim(),
      description: data.product_description.trim(),
      category: data.product_category,
      price: Number(data.product_price),
      image_url: imageUrl,
    };
    try {
      if (isEditMode) {
        // reques for update
        const { data, error, count } = await supabase.from("menu_items")
          .update(menuItemsData)
          .eq("id", currentEditMenuItem.id)
          .select()
          .single();

        if (error) {
          console.error("Failed to update menu item", error);
          return
        }
        setMenuItems((items) => items.map(item => item.id === currentEditMenuItem.id ? data : item));
        toast.success("Menu updated");
        setIsModelOpen(false)
      } else {
        // request for create
        const { error } = await createMenuItems(menuItemsData);
        if (error) {
          console.error("Failed to create menu item");
          return;
        }
        setMenuItems(items => [...items, menuItemsData]);
        toast.success("Menu created");
        setIsModelOpen(false)
      }
    } catch (error) {
      console.error("Error occurred", error);
    } finally {
      setIsMenuCreating(false);
    }
  }



  const handleMarkAsUnAvailable = item => {
    setIsModelOpen(true);
    setUpdateCreateMode(false)
    setIsToggleAvailableMode(true);
    setNextAvailabiltyMenuState(false)
    setCurrentEditMenu(item)
  }

  const handleMarkAsAvailable = item => {
    setIsModelOpen(true);
    setUpdateCreateMode(false)
    setIsToggleAvailableMode(true)
    setNextAvailabiltyMenuState(true);
    setCurrentEditMenu(item);
  }

  const handleDelete = item => {
    setIsModelOpen(true);
    setUpdateCreateMode(false)
    setIsDeleteMode(true);
    setIsToggleAvailableMode(false);
    setIsDeletingItem(item);
  }

  const handleToggleAvailablity = async () => {
    try {
      const { data, error } = await supabase.from("menu_items")
        .update({ ...currentEditMenuItem, is_available: nextAvailableMenuState })
        .eq("id", currentEditMenuItem.id);

      if (error) {
        toast.error(`Failed to ${nextAvailableMenuState ? "Mark as Available" : "Unavailable"}`);
        throw error
      }
      setMenuItems(items => items.map(item => item.id == currentEditMenuItem.id ? { ...item, is_available: nextAvailableMenuState } : item));
      toast.success(`You marked as ${nextAvailableMenuState ? "Mark as Available" : "Unavailable"}`);
      setIsActionMode(false);
      setIsModelOpen(false)
    } catch (error) {
      console.error("Failed to update the menu item");
    }
  }

  const handleDeleteAction = async () => {
    startTranstion(async () => {
      setOptimisticMenuItems({
        type: "DELETE_MENU",
        payload: deletingItem
      })
      setIsModelOpen(false)
      try {
        const { error } = await supabase.from("menu_items")
          .delete()
          .eq("id", deletingItem.id);
        if (error) {
          throw error
        }
        setMenuItems(items => items.filter((menu) => menu.id !== deletingItem.id));
        toast.success("Menu deleted.")
      } catch (error) {
        toast.error("Failed to delete menu item");
      }
    })
  }





  // FETCH ALL MENU ITEMS //
  useEffect(() => {
    // start fetching all menu items //
    const getMenuItems = async () => {
      setIsLoading(true)
      try {
        const { data, count } = await fetchMenuItems({ includeHiddenMenus: true, offset: offset, limit: limit });
        setMenuItems(data);
        setCount(count)
      } catch (error) {
        console.error("Failed to fetch menu items", error);
      } finally {
        setIsLoading(false);
      }
    }

    getMenuItems()

  }, [currentPage])


  const status = useMemo(() => {
    const values = ["All", "Available", "Unavailable"];
    return values
  },[activeStatus]);


  const filteredMenuItems = useMemo(() => {
   const query = searchedTerm.trim().toLowerCase();
   return menuItems.filter((item) => {
    const matches_status = activeStatus.toLowerCase() === "all" ? true : activeStatus.toLowerCase() === "available" ? item.is_available : !item.is_available;
    const matchesQuery = !query || [item.name,item.category,item.description].some((vale) => String(vale ?? "").toLowerCase().includes(query))
    return matches_status && matchesQuery
   })
  },[activeStatus,menuItems,searchedTerm])
  return (
    <div className="menu_item_section">
      <div className="location_indicator flex items-center gap-1">
        <Link to={"/"} className='flex items-center gap-1' ><CgHomeAlt className="text-xl text-text/30 cursor-pointer" /><ChevronRight /></Link>
        <h2 className="font-semibold text-text/80">Menu Items</h2>
      </div>
      <div className="header_text mt-8 flex gap-4 md:items-center flex-col md:flex-row justify-between">
        <div className="left flex flex-col gap-2">
          <h1 className="text-xl md:text-3xl font-semibold lg:text-3xl">Menu Items</h1>
          <p className="text-xs md:text-[15px] text-text/85">Manage your restaurant's menu, add new dishes, update prices, and control item availability.</p>
        </div>
        <div className="right">
          {/* create Menu Btn */}
          <button className='flex items-center cursor-pointer text-xs bg-background border-border border py-0.5 px-4 rounded-lg text-text shadow'
            onClick={() => {
              setUpdateCreateMode(true);
              handleCreateMode();
            }}
          >
            <Plus className='w-5' />
            Add Item
          </button>
        </div>
      </div>
      {/* Menu Overview */}
      <div className="overview_cards_container flex gap-4 flex-col md:flex-row  flex-wrap md:*:w-[calc(33.3%-10.66px)] mt-8 *:cursor-pointer *:flex *:flex-col *:gap-2">
        {/* orders */}
        <div className="card bg-surface/35 border border-border rounded-lg p-2 shadow-2xl shadow-background/5">
          <h2>Total Items</h2>
          <h4 className="count font-black text-xl">50</h4>
        </div>
        <div className="card bg-surface/35 border border-border rounded-lg p-2 shadow-2xl shadow-background/5">
          <h2>Available</h2>
          <h4 className="count font-black text-xl text-primary">9</h4>
        </div>
        <div className="card bg-surface/35 border border-border rounded-lg p-2 shadow-2xl shadow-background/5">
          <h2>Unavailable</h2>
          <h4 className="count font-black text-xl text-danger">30</h4>
        </div>
      </div>
      {/* search menu  */}
      <div className="search_menu_Container mt-4 relative">
        <SearchIcon className='w-4 absolute top-1/2 left-2.5 -translate-y-1/2' />
        <input type="text" placeholder='search menu items..' className='text-[15px] pl-8  focus:outline-focus/70 block w-full placeholder:px-0.5 placeholder:py-1 py-2 px-2 border-border border rounded' value={searchedTerm} onChange={(e) => setSearchedTerms(e.target.value.toLowerCase())} />
      </div>
      {/* filter menu btns container */}
      <div className="filter_Menu_status_container mt-4 flex gap-4 items-center overflow-x-auto">
        {status.map((item) => (
          <button
            key={item}
            className={`${activeStatus.toLowerCase() === item.toLowerCase()
                ? "bg-text text-background"
                : ""
              } py-0.5 px-4 text-[11px] cursor-pointer rounded-full md:text-sm border-border border`}
            onClick={() => setActiveStatus(item.toLowerCase())}
          >
            {item}
          </button>
        ))}
      </div>


      <div className="menu_items_Lists_container mt-12 flex gap-4 w-full flex-col md:flex-row flex-wrap">
        {isLoading ? (
          <div className="flex w-full flex-col items-center justify-center gap-3 py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />
            <p className="text-sm text-text/70">
              Loading menu items...
            </p>
          </div>
        ) : filteredMenuItems.length > 0 ? (
          filteredMenuItems.map((item) => (
            <div className="menu_item relative  border-text/10 md:w-[calc(33.33%-10.66px)] lg:w-[calc(25%-12px)] border shadow-lg p-2 rounded-lg flex flex-col gap-1.5 items-start" key={item.id}>
              <div className="image_container h-42 rounded-lg overflow-hidden w-full">
                <img src={item.image_url} className='w-full h-full object-cover' alt={item.name} />
              </div>
              <h2 className='font-semibold'>{item.name}</h2>
              <span className='text-text/80'>{item.category}</span>
              <h3><strong>${item.price}</strong></h3>
              <span className={`py-1 px-3 rounded-full text-[10px] absolute top-3 ring-1 text-xs right-3 font-semibold border-border text-white border ${item.is_available ? "bg-primary" : "bg-[#B91C1C]"}`}>{item.is_available ? "Available" : "Unavailable"}</span>
              <div className="actions *:absolute *:z-50 *:select-none  *:right-2 *:bottom-2 flex items-center justify-between w-full *:cursor-pointer mt-4">
                {isActionMode === item.id ? <XCircle className='w-5' onClick={() => setIsActionMode(null)} /> : <Ellipsis className='w-5' onClick={() => setIsActionMode(item.id)} />}
              </div>

              {isActionMode === item.id && (
                <div className="action_container bg-surface/90 z-40 *:text-sm backdrop-blur-[1.2px] absolute *:cursor-pointer top-0 left-0 h-full flex flex-col gap-2 w-full p-4 rounded-md shadow-2xl">
                  <div className="edit_icon flex *:font-bold items-center gap-2  justify-between hover:bg-text hover:text-background p-2 rounded-md"
                    onClick={() => handleEditMenu(item)}
                  >
                    <h2>Edit</h2>
                    <Pencil className='w-4' />
                  </div>
                  <div className="toggle_visibility_icon hover:bg-text hover:text-background p-2 rounded-md">
                    <button type='button' className='cursor-pointer font-bold flex gap-2 items-center  w-full justify-between' onClick={() => item.is_available ? handleMarkAsUnAvailable(item) : handleMarkAsAvailable(item)}>{item.is_available ? "Mark as unavailable" : "Mark as available"}
                      {item.is_available ? <ToggleRight className='w-4' /> : <ToggleLeft className='w-4' />}
                    </button>
                  </div>
                  <div className="delete_icon hover:text-red-600 flex *:font-semibold items-center gap-2 justify-between hover:bg-text p-2 rounded-md" onClick={() => handleDelete(item)}>
                    <h2>Delete</h2>
                    <Trash2 className='w-4' />
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="menu_items_empty flex items-center justify-between bg-surface w-full p-2 rounded-md border border-border">
            <div className="left flex flex-col gap-2">
              <h2 className='text-base md:text-lg lg:text-xl font-semibold'>No, menu items was found.</h2>
              <p className='text-xs text-text/70'>Add new products that customers can see.</p>
            </div>
            <Plus className='w-10' />
          </div>
        )

        }
      </div>
      {/* OVERLAY FOR PRODUCT ADDING. */}
      {isModelOpen && (
        <>
          <div className="modal_container fixed inset-0 bg-surface/5 z-60 backdrop-blur-sm overflow-y-auto items-center flex justify-center" id='model_container' onClick={() => setIsModelOpen(false)}>
            {/* model content */}
            {
              isUpdateCreateMode ? (
                <div className="content bg-surface border-border border p-6 w-[90%] md:max-w-4xl rounded-md" id='model_content' onClick={(e) => e.stopPropagation()}>
                  <div className="header flex items-center justify-between w-full mb-4">
                    <h2 className="action_title font-semibold text-sm md:text-lg lg:text-xl">{isEditMode ? "Update Product" : "Create New Product"}</h2>
                    <SquareX onClick={() => setIsModelOpen(false)} className='cursor-pointer' />
                  </div>
                  <div className="product_form *:text-xs *:sm:text-[14px]">
                    <form action="" id='product_menu_form' className='flex flex-col gap-1 *:w-full sm:flex-row sm:gap-4 flex-wrap items-center *:sm:w-[calc(50%-10px)]' onSubmit={handleSubmit(handleProducFormSubmit, () => {
                      toast.error("please, fill the required fields.")
                    })}>
                      <div className="item_input flex flex-col gap-2">
                        <label htmlFor="name" className='font-semibold'>Item Name</label>
                        <input type="text" placeholder="Enter item's name" className='border-border border outline-0 focus:outline-1 rounded-md placeholder:text-sm py-1.5 px-3 focus:outline-text' {...register("product_name", {
                          required: "please, this is required field"
                        })} />
                        <p className="erro_handle_text text-xs text-danger">{errors?.product_name?.message}</p>
                      </div>
                      <div className="item_input flex flex-col gap-2">
                        <label htmlFor="description" className='font-semibold'>Item Description</label>
                        <input type="text" placeholder="Enter item's description" className='border-border border outline-0 focus:outline-1 rounded-md placeholder:text-sm py-1.5 px-3 focus:outline-text' {...register("product_description", {
                          required: "please, this is required field"
                        })} />
                        <p className="erro_handle_text text-xs text-danger">{errors?.product_description?.message}</p>
                      </div>
                      <div className="item_input flex flex-col gap-2">
                        <label htmlFor="category" className='font-semibold'>Item Category</label>
                        <input type="text" placeholder="Enter item's cateogry" className='border-border border outline-0 focus:outline-1 rounded-md placeholder:text-sm py-1.5 px-3 focus:outline-text' {...register("product_category", {
                          required: "please, this is required field"
                        })} />
                        <p className="erro_handle_text text-xs text-danger">{errors?.product_category?.message}</p>
                      </div>
                      <div className="item_input flex flex-col gap-2">
                        <label htmlFor="price" className='font-semibold'>Item Price</label>
                        <input type="number"
                          step={"any"}
                          placeholder="Enter item's price" className='border-border border outline-0 focus:outline-1 rounded-md placeholder:text-sm py-1.5 px-3 focus:outline-text'  {...register("product_price", {
                            required: "please, this is required field"
                          })} />
                        <p className="erro_handle_text text-xs text-danger">{errors?.product_price?.message}</p>
                      </div>
                      <div className="item_input flex justify-between">
                        <div className="left_side flex flex-col items-start gap-2">
                          <div className="image_uploader relative h-36 w-36 border p-2 rounded-md flex-col md:flex-row items-center justify-center border-text/25 border-dashed">
                            <ImageUp className='w-14 h-14 justify-self-center' />
                            <input type="file"
                              id='product_img'
                              accept='image/*'
                              onChange={handleSelectedProductImg}
                              className='block file:bg-primary file:hidden absolute inset-0 w-full opacity-0 file:px-2  text-[11px] file:py-0.5 file:border-0 file:rounded file:text-xs' />
                            <p className='text-xs text-center mt-4'>{isEditMode ? "Replace" : "Upload"}<strong>Your Image Here</strong></p>
                          </div>
                          {isImageSelected && (
                            <button type='button' className='text-xs text-danger' onClick={() => {
                              document.getElementById("product_img").value = "";
                              setSelectedProductImg(null);
                              setImageSelected(false);
                            }}>Image is selected: <strong>Undo if needed</strong></button>
                          )}
                          <button type='button'
                            onClick={handleProductImageUpload}
                            className='text-xs bg-text mt-2 text-background px-2 font-black py-1 rounded-sm'>{isProductImgUploading ? isEditMode ? "Image Updating..." : "Image Uploading.." : isEditMode ? "Update Image" : "Upload Image"}</button>
                          <p className="erro_handle_text text-xs text-danger">{errors?.product_image?.message}</p>
                        </div>
                        {isEditMode && (
                          <div className="previous_selected_image">
                            <div className="image_container border-text/20 p-2 h-36 w-36 border border-dashed rounded-md">
                              <img src={currentEditMenuItem?.image_url} alt={currentEditMenuItem?.name} className='w-40 h-auto aspect-square rounded-md' />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="action_btns *:text-xs md:*:text-sm mt-2 flex items-center gap-3">
                        <button type='button' className='bg-red-600 text-white text-xs md:text-sm px-4 py-1 rounded' onClick={() => setIsModelOpen(false)}>Cancel</button>
                        <button type='submit' className='bg-primary text-white px-4 py-1 text-xs md:text-sm rounded'>{isMenuCreating ? isEditMode ? "Updating Menu.." : "Creating Menu.." : isEditMode ? "Update Menu" : "Create Menu"}</button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : isToggleAvailableMode ? (
                <div className="togle_availbility_modal flex items-center justify-center bg-text text-background p-6 rounded-md" onClick={(e) => e.stopPropagation()}>
                  <div className="confirmation flex flex-col gap-3">
                    <h2 className="question text-sm">Are you sure to <strong>{nextAvailableMenuState ? "Mark as available" : "Mark as Unvailable"} </strong></h2>
                    <div className="btns flex items-center gap-4">
                      <button type='button' className='text-red-600 cursor-pointer font-semibold px-3 bg-background py-0.5 rounded-md text-sm' onClick={() => setIsModelOpen(false)}>Cancel</button>
                      <button type='button' className='bg-success text-text cursor-pointer font-semibold text-sm px-3 py-0.5 rounded-md' onClick={handleToggleAvailablity}>Confirm</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="deleteModal flex items-center justify-center bg-text text-background p-6 rounded-md" onClick={(e) => e.stopPropagation()}>
                  <div className="confirmation flex flex-col gap-3">
                    <h2 className="question text-sm">Are you sure to <strong>Delete: {deletingItem?.name}</strong></h2>
                    <div className="btns flex items-center gap-4">
                      <button type='button' className='text-red-600 cursor-pointer font-semibold px-3 bg-background py-0.5 rounded-md text-sm' onClick={() => setIsModelOpen(false)}>Cancel</button>
                      <button type='button' className='bg-success text-text cursor-pointer font-semibold text-sm px-3 py-0.5 rounded-md' onClick={handleDeleteAction}>Confirm</button>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </>
      )}
      <div className="pagination flex items-center gap-4 *:cursor-pointer mt-6">
        <button disabled={currentPage === 1 || isLoading} className='disabled:opacity-20 disabled:cursor-not-allowed' onClick={() => setCurrentPage(prev => prev - 1)}><ChevronLeft /></button>
        <button disabled={currentPage >= totalPages || isLoading} className='disabled:opacity-20 disabled:cursor-not-allowed' onClick={() => setCurrentPage(prev => prev + 1)}><ChevronRight /></button>
      </div>
      <div className="pagination_status mt-6">
        <h2 className='text-xs text-text/70'><strong>{`Showing Items ${startItem}-${endItem} of ${totalPages} ${totalPages > 1 ? "pages" : "page"}`}</strong></h2>
      </div>
    </div>
  )
}

export default MenuItems

