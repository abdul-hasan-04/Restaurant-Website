import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaArrowLeftLong, FaArrowRight } from 'react-icons/fa6';
import { IoMdEyeOff } from 'react-icons/io';
import { IoEye } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router';
import supabase from '../lib/supabase';
import { siginIn } from '../services/authServices';
import { toast } from 'react-toastify';

function Login() {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    // User Registeration State//
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const navigate = useNavigate("");

    const handleSubmitForm = async data => {

        reset();

        const userCredentials = {
            email : data?.email,
            password : data?.password
        }
        try {
            setIsLoading(true)
            const {data, error} = await siginIn(userCredentials.email, userCredentials.password);
            if(error){
                throw result.error
            }
        } catch (error) {
        }finally{
            setIsLoading(false)
        }

    }
    return (
        <div className="signUpForm_container flex flex-col gap-6 h-screen justify-center">
            <Link to={"/"} className='text-sm flex gap-2 items-center'><FaArrowLeftLong />Back to home</Link>
            <div className="text_container flex flex-col gap-6">
                <h2 className="welcome_text uppercase text-xs">Welcome Back</h2>
                <h2 className="title font-semibold textxl md:text-2xl lg:text-4xl">Sign in to your account</h2>
            </div>
            <form action="" className='flex flex-col gap-4' onSubmit={handleSubmit(handleSubmitForm)}>
                <div className="email flex flex-col gap-3">
                    <label htmlFor="email" className='text-xs uppercase'>Email address</label>
                    <input type="email"
                        {...register("email", {
                            required: "Please enter your email"
                        })}
                        placeholder='example alihusein@gmail.com' className='border border-text/15 py-2 bg-surface rounded-md shadow-surface shadow placeholder:text-text/60 px-2 text-sm placeholder:text-sm placeholder:p-0.5' />
                    <p className="error_text text-xs text-red-500">{errors?.email?.message}</p>
                </div>
                <div className="password flex flex-col gap-3">
                    <label htmlFor="password" className='text-xs uppercase'>Password</label>
                    <div className="input_container relative">
                        <input id='password_field'
                            {...register("password", {
                                required: "Please enter your password"
                            })}
                            type={isPasswordHidden ? "password" : "text"} className='border border-text/15 text-sm shadow bg-surface shadow-surface px-2 block w-full placeholder:p-0.5 py-2 rounded-md placeholder:text-sm ' />
                        <div className="icon absolute right-2 top-2">
                            {isPasswordHidden ? <IoEye onClick={() => setIsPasswordHidden(false)} /> : <IoMdEyeOff onClick={() => setIsPasswordHidden(true)} />}
                        </div>
                    </div>
                    <p className="error_text text-xs text-red-500">{errors?.password?.message}</p>
                </div>
                <button type='submit' className='flex items-center gap-2 text-sm cursor-pointer font-semibold w-full bg-text py-2 px-3 text-background rounded-full justify-center' disabled={isLoading}>{isLoading ? "Signing in..." : "Sign In"}<FaArrowRight /></button>
                <div className="border-b boder-1 my-4 border-text/25"></div>
                <div className="sign_page_redirector flex items-center justify-center">
                    <h2 className='text-sm flex items-center gap-2'>Don't have an account <Link to={"../auth/register"} className='hover:border-b  hover:font-semibold hover:border-text'>Create One</Link></h2>
                </div>
            </form>
        </div>
    )
}

export default Login