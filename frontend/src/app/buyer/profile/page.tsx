// frontend/pages/seller/profile.tsx
"use client";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { ProfileFormData, profileSchema } from "@/src/lib/validations/buyer/profile";

export default function SellerProfile() {
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema)
    })

    // Simulate fetching user data (you'll replace this with API call later)
    useEffect(() => {
        const mockUser = {
            name: "Samarth Rajput",
            email: "samarth@example.com"
        }
        setValue("name", mockUser.name)
        setValue("email", mockUser.email)
    }, [setValue])

    const onSubmit = async (data: ProfileFormData) => {
        setLoading(true)
        try {
            // You’ll replace this fetch with real backend update call later
            // For now, just log the data to use the parameter and avoid the unused variable error
            console.log("Submitted data:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000)) // mock delay

            setMessage("Profile updated successfully!")
        } catch (error) {
            console.error(error)
            setMessage("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border shadow rounded">
            <h2 className="text-2xl font-semibold mb-6 text-center">Buyer Profile</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label>Name</label>
                    <input
                        {...register("name")}
                        className="w-full border p-2 rounded mt-1"
                    />
                    <p className="text-red-500 text-sm">{errors.name?.message}</p>
                </div>

                <div>
                    <label>Email</label>
                    <input
                        {...register("email")}
                        className="w-full border p-2 rounded mt-1"
                    />
                    <p className="text-red-500 text-sm">{errors.email?.message}</p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>

                {message && (
                    <p className="text-center text-blue-600 font-medium mt-4">{message}</p>
                )}
            </form>
        </div>
    )
}
