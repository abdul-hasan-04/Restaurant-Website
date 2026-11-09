import { useState } from 'react'
import {
  BadgeCheck,
  Camera,
  ChefHat,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import useAuth from '../hooks/useAuth'
import { toast } from 'react-toastify';
import { uploadProfileAvatar } from '../services/storageServices';
import supabase from '../lib/supabase';
import { Avatar } from '@makozi/react-user-avatar-generator';

function ManageProfile() {
  const { profile, user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [updateFull_name, setUpdateFull_name] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const updateAvatar = (event) => {
    const file = event.target.files?.[0];
    const limitFileSize = 5 * 1024 * 1024;
    if (file && !file.type.startsWith("image")) {
      toast.error("please, upload image file")
      return;
    }

    if (file && file.size > limitFileSize) {
      toast.error("Image file exceeded limit of 5MB");
      return
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setSelectedImage(file);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    let user_profilData = {
      full_name: updateFull_name,
      file: selectedImage
    }
    try {
      const profile_url = await uploadProfileAvatar(user_profilData.file, user?.id);
      if (selectedImage) {
        toast.success("Image Uploaded Successfully.")
      }
      await new Promise((resolve) => setTimeout(() => resolve(), 1000));
      const { data, error } = await supabase
        .from("users")
        .update({
          full_name: user_profilData.full_name,
          avatar_url: profile_url?.url
        }).eq("id", user.id).select().single();

      if (error) {
        throw error
      }
      toast.success("User profile updated successfully.")
    } catch (error) {
      toast.error("Failed to update user profile");
    } finally {

    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-border pb-7 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-primary">
              <ChefHat size={17} /> VILLET CHEF <span className="text-muted">/ Admin</span>
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-[2.5rem]">Your profile</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">Manage your personal information and account details.</p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium text-secondary shadow-sm">
            <ShieldCheck size={17} className="text-primary" /> Secure account
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
          <aside className="h-fit overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_16px_40px_rgba(var(--shadow-color),0.08)]">
            <div className="h-28 bg-linear-to-br from-primary to-accent" />
            <div className="px-6 pb-6">
              <div className="-mt-12 flex items-end justify-between">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-surface bg-card text-3xl font-bold text-primary shadow-lg">
                    {profile?.avatar_url ? <img src={imagePreview || profile?.avatar_url} alt="Profile" className="h-full w-full object-cover" /> : <Avatar name={profile?.full_name} backgroundColor={"primary"} textColor='text' />}
                  </div>
                  <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-surface bg-primary text-on-primary shadow-md transition hover:bg-primary-hover focus-within:ring-4 focus-within:ring-primary/20" aria-label="Upload profile photo">
                    <Camera size={16} />
                  </label>
                  <input id="avatar-upload" type="file" accept="image/*" onChange={updateAvatar} className="sr-only" />
                </div>
                <span className="mb-1 inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
                  <BadgeCheck size={14} /> Active
                </span>
              </div>
              <h2 className="mt-5 text-xl font-bold tracking-tight">{profile?.full_name || 'Your name'}</h2>
              <p className="mt-1 text-sm text-muted">{profile?.role}</p>
              <div className="my-5 h-px bg-border" />
              <div className="space-y-4 text-sm">
                <p className="flex items-center gap-3 text-secondary"><Mail size={17} className="shrink-0 text-primary" />{profile.email}</p>
              </div>
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-primary"><Clock3 size={19} /></div>
                <div><p className="text-xs text-muted">Last updated</p><p className="mt-0.5 text-sm font-semibold">Today, just now</p></div>
              </div>
            </div>
          </aside>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-[0_16px_40px_rgba(var(--shadow-color),0.08)] sm:p-8">
            <div className="mb-7 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-primary"><UserRound size={21} /></div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">Personal information</h2>
                <p className="mt-1 text-sm leading-6 text-muted">Keep your profile details up to date.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-1">
                <label className="block text-sm font-semibold">Full name
                  <input name="name" value={updateFull_name} onChange={(e) => setUpdateFull_name(e.target.value)} className="mt-2 block w-full rounded-xl border border-border bg-input px-4 py-3.5 font-normal text-text outline-none transition duration-200 placeholder:text-muted focus:border-focus focus:ring-4 focus:ring-primary/10" placeholder="Update Your full name" />
                </label>
              </div>
              <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p role="status" className="text-sm font-medium text-primary">{isSaving ? 'Your profile has been saved.' : ''}</p>
                <button type="submit" className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-sm transition duration-200 hover:bg-primary-hover hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary/20">
                  <Save size={16} /> {isSaving ? "Saving Changes" : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

export default ManageProfile