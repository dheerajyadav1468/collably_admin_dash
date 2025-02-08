"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { API_ROUTES } from "../apiroutes"
import { jwtDecode } from "jwt-decode";


const LoginForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Import JWT decoder

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await fetch(API_ROUTES.BRAND_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactEmail: formData.email,
          password: formData.password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", "brand");
        localStorage.setItem("userName", data.brand.brandName);  // ✅ Store brandName
  console.log(data.brand.brandName);
        setError(null);
        router.push("/brandPanel");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };
  

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[430px] p-8 bg-white rounded-lg shadow-lg space-y-6">
        <div className="flex justify-center mb-6">
          <Image src="/images/logo/logo-collably.png" alt="Logo" width={120} height={40} className="object-contain" />
        </div>

        <h4 className="text-3xl font-semibold text-dark mb-6">Login</h4>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium text-dark mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-lg font-medium text-dark mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-[#ff0055] text-white rounded-lg hover:bg-[#e6234d] transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm

