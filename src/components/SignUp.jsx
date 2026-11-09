import React, { useEffect } from 'react'
import { IoEye } from 'react-icons/io5';
import { IoMdEyeOff } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaArrowLeftLong, FaArrowRight } from 'react-icons/fa6';
import { emailReg } from "../utils/inputFormValidation"
import { passwordReg } from "../utils/inputFormValidation"
import { nameReg } from "../utils/inputFormValidation";
import { toast } from 'react-toastify';
import { signUpAuth } from '../services/authServices';
function SignUp() {
    const { register, handleSubmit, watch, trigger, reset, formState: { errors } } = useForm();
    // User Registeration State//
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
    const navigate = useNavigate();
    // STATE FOR IMPLEMENTING SUPBASE SIGNUP FUNCTION AND USER CREATION
     const [isLoading, setIsLoading] = useState(false);
     const handleSubmitForm = async (formData) => {
        const userData = {
           email : formData.email,
           password : formData.password,
           fullName : formData.firstName + " " + formData.lastName
        }

        console.log(userData);
        reset();
        try {
            // start working with registering user to supabase auth schema
            setIsLoading(true);
           const {data, error} =  await signUpAuth(userData?.email, userData?.password, userData?.fullName);
           if(error) {
              toast.error(error);
              throw error
           }
           toast.success("User Registered Successfully.");
           setTimeout(() => {
             navigate("/auth/login")
           }, 1000);
        } catch (error) {
        }finally{
            setIsLoading(false)
        }
    };

    // watch for password //
    const password = watch("password", "");
    const confirmPassword = watch("confirmPassword", "");

    const requirements = [
        {
            label: "8+ characters",
            met: password.length > 8
        },
        {
            label: "uppercase letter",
            met: /[A-Z]/.test(password)
        },
        {
            label: "lowercase letter",
            met: /[a-z]/.test(password),
        },
        {
            label: "number (0–9)",
            met: /\d/.test(password),
        },
        {
            label: "special character",
            met: /[^A-Za-z0-9\s]/.test(password)
        }
    ]


    const score = requirements.filter(item => item.met).length;

    const strengthPassword = () => {
        switch (score) {
            case 0:
                return {
                    text: "No, password",
                    bg: "bg-text/30",
                    textBg: "text-text/30"
                }
            case 1:
                return {
                    text: "Very weak",
                    bg: "bg-red-500",
                    textBg: "text-red-500"
                }
            case 2:
                return {
                    text: "Weak",
                    bg: "bg-orange-500",
                    textBg: "text-orange-500"
                }
            case 3:
                return {
                    text: "Fair",
                    textBg: "text-yellow-500",
                    bg: "bg-yellow-500"
                }
            case 4:
                return {
                    text: "Good",
                    textBg: "text-lime-500",
                    bg: "bg-lime-500"
                }
            case 5:
                return {
                    text: "Strong",
                    textBg : "text-green-500",
                    bg: "bg-green-500"
                }
        }
    }

    useEffect(() => {
        if (confirmPassword) {
            trigger("confirmPassword")
        }
    }, [trigger, confirmPassword, password])
    return (
        <div className="signUpForm_container flex flex-col gap-6">
            <Link to={"/"} className='text-sm flex gap-2 items-center'><FaArrowLeftLong />Back to home</Link>
            <div className="text_container flex flex-col gap-4">
                <h2 className="welcome_text uppercase text-xs">Get Started</h2>
                <h2 className="title font-semibold textxl md:text-2xl lg:text-4xl">Create your account</h2>
                <p className="description font-semibold text-[15px]">Join 2,000+ happy customers <span className='text-text/70 italic font-normal'> enjoying their favorite meals, delivered fresh to their table</span>.</p>
            </div>
            <form action="" className='flex flex-col gap-2' onSubmit={handleSubmit(handleSubmitForm, () => {
                toast.error("Please check the form fields");
            })}>
                <div className="name_container flex flex-col md:flex-row gap-3 md:items-center">
                    <div className="first_name flex flex-col gap-3 flex-1">
                        <label htmlFor="first-name" className='text-xs uppercase'>First Name</label>
                        <input type="text" placeholder='example Ali' className='border border-text/15 py-2  px-2 rounded-md bg-surface shadow-surface text-sm shadow placeholder:text-sm placeholder:p-0.5 block'
                            {...register("firstName", {
                                required: "This Field Is Required",
                                minLength: {
                                    value: 2,
                                    message: "First name must be at least 2 characters"
                                },
                                validate: (value) => nameReg.test(value) || "Use letters only"
                            })} />
                        <p className="error_text text-xs text-red-500 leading-6">{errors?.firstName?.message}</p>
                    </div>
                    <div className="last_name flex-col flex gap-3 flex-1">
                        <label htmlFor="last-name" className='text-xs uppercase'>Last Name</label>
                        <input type="text"
                            {...register("lastName", {
                                required: "This Field Is Required",
                                minLength: {
                                    value: 2,
                                    message: "Last name must be at least 2 characters"
                                },
                                validate: (value) => nameReg.test(value) || "Use letters only"
                            })} placeholder='example Hussein' className='border border-text/15 py-2 px-2 rounded-md bg-surface text-sm shadow-surface shadow placeholder:text-sm placeholder:p-0.5' />
                        <p className="error_text text-xs text-red-500 leading-6 ">{errors?.lastName?.message}</p>
                    </div>
                </div>
                <div className="email flex flex-col gap-3">
                    <label htmlFor="email" className='text-xs uppercase'>Email address</label>
                    <input type="email"
                        {...register("email", {
                            required: "This Field Is Required",
                            validate: (value) => emailReg.test(value) || "Please enter a valid email address"
                        })} placeholder='example alihusein@gmail.com' className='border border-text/15 py-2 bg-surface rounded-md shadow-surface shadow placeholder:text-text/60 px-2 text-sm placeholder:text-sm placeholder:p-0.5' />
                    <p className="error_text text-xs text-red-500 leading-6">{errors?.email?.message}</p>
                </div>
                <div className="password flex flex-col gap-3">
                    <label htmlFor="password" className='text-xs uppercase'>Password</label>
                    <div className="input_container relative">
                        <input id='password_field'
                            {...register("password", {
                                required: "This Field Is Required",
                                validate: (value) => passwordReg.test(value) || "Use 8+ characters, including uppercase, lowercase, and a number"
                            })} type={isPasswordHidden ? "password" : "text"} className='border border-text/15 text-sm shadow bg-surface shadow-surface px-2 block w-full placeholder:p-0.5 py-2 rounded-md placeholder:text-sm ' />
                        <div className="icon absolute right-2 bottom-2.5">
                            {isPasswordHidden ? <IoEye onClick={() => setIsPasswordHidden(false)} /> : <IoMdEyeOff onClick={() => setIsPasswordHidden(true)} />}
                        </div>
                    </div>
                    {password && (
                        <div className="Password_StrenThStatusBar_container flex flex-col gap-2">
                            <div className="password_StatusBar_container *:h-2 mt-2 gap-4 *:w-full flex *:rounded-full">
                                {
                                    requirements.map((item, index) => (
                                        <div key={index} className={`passWord_Strength_Status_Bar gap-2 ${index < score ? strengthPassword().bg : "bg-text/90"}`}>
                                        </div>
                                    ))
                                }
                            </div>

                            <p className={`text-xs font-semibold} ${strengthPassword().textBg}`}>{strengthPassword().text}</p>

                        </div>
                    )}
                    {password && (
                        <div className="passwor_status_strength password_status_text flex *:w-full *:text-xs gap-4 mt-2">
                            {requirements.map((item, index) => (
                                <span key={index} className={`pass_word_strength_StatusText ${item.met ? "text-green-500" : ""}`}>
                                    {item.label}
                                </span>
                            ))
                            }
                        </div>
                    )}
                    <p className="error_text text-xs text-red-500 leading-6">{errors?.password?.message}</p>
                </div>
                <div className="confirm_password flex flex-col gap-3">
                    <label htmlFor="confirm_password" className='text-xs uppercase'>Confirm Password</label>
                    <div className="input_container relative">
                        <input id='confirm_password_field'
                            {...register("confirmPassword", {
                                required: "This Field Is Required",
                                validate: (value) => value === watch("password") || "Passwords do not match"
                            })} type={isConfirmPasswordHidden ? "password" : "text"} className='border px-2 py-2 shadow bg-surface text-sm shadow-surface block w-full border-text/15  placeholder:p-0.5 rounded-md placeholder:text-sm ' />
                        <div className="icon absolute right-2 bottom-2.5">
                            {isConfirmPasswordHidden ? <IoEye onClick={() => setIsConfirmPasswordHidden(false)} /> : <IoMdEyeOff onClick={() => setIsConfirmPasswordHidden(true)} />}
                        </div>
                    </div>
                    <p className="error_text text-xs text-red-500 leading-6">{errors?.confirmPassword?.message}</p>
                </div>
                <button type='submit' className='flex items-center gap-2 text-sm cursor-pointer font-semibold w-full bg-text py-2 px-3 text-background rounded-full justify-center disabled:opacity-10 disabled:cursor-not-allowed' disabled={isLoading}> {isLoading ? "Creating Account.." : "Create Account"} <FaArrowRight /></button>
                <div className="border-b boder-1 my-4 border-text/25"></div>
                <div className="sign_page_redirector flex items-center justify-center">
                    <h2 className='text-sm flex items-center gap-2'>Already have an account? <Link to={"../auth/login"} className='hover:border-b  hover:font-semibold hover:border-text'>Sigin In</Link></h2>
                </div>
            </form>
        </div>
    )
}

export default SignUp


