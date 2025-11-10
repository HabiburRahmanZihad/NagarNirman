'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaUpload, FaMapMarkerAlt, FaTimes, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import categoryOptions from "@/data/categoryOptions.json";
import divisionData from "@/data/divisionsData.json";

type ReportFormData = {
  category: string;
  subcategory: string;
  title: string;
  description: string;
  division: string;
  district: string;
  address: string;
  severity: string;
  image: FileList;
  latitude?: string;
  longitude?: string;
};

export default function NewReportPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } =
    useForm<ReportFormData>();
  const [preview, setPreview] = useState<string | null>(null);
  const [districts, setDistricts] = useState<
    { name: string; latitude: number; longitude: number }[]
  >([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const selectedCategory = watch("category");
  const selectedDivision = watch("division");

  // Check if user is authenticated and has 'user' role
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error("Please login to submit a report");
        router.push("/auth/login");
      } else if (user?.role !== "user") {
        toast.error("Only users can submit reports. Please register as a user.");
        router.push("/");
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const div = e.target.value;
    setValue("division", div);
    const divisionObj = divisionData.find((d) => d.division === div);
    setDistricts(divisionObj?.districts || []);
    setValue("district", "");
  };

  const handleLocationFetch = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoadingLocation(true);
    const loadingToast = toast.loading("Fetching your location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setValue("latitude", latitude.toFixed(6));
        setValue("longitude", longitude.toFixed(6));
        toast.dismiss(loadingToast);
        toast.success("Location fetched successfully!");
        setIsLoadingLocation(false);
      },
      (error) => {
        toast.dismiss(loadingToast);
        toast.error("Unable to fetch your location. Please enable location services.");
        console.error("Geolocation error:", error);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const onSubmit = async (data: ReportFormData) => {
    // Double-check user role before submission
    if (!user || user.role !== "user") {
      toast.error("Only users can submit reports");
      router.push("/");
      return;
    }

    const submitToast = toast.loading("Submitting your report...");

    try {
      const token = localStorage.getItem("nn_auth_token");
      if (!token) {
        toast.dismiss(submitToast);
        toast.error("You must be logged in to submit a report");
        router.push("/auth/login");
        return;
      }

      // Map category to backend problemType
      const problemTypeMap: { [key: string]: string } = {
        "Road & Infrastructure Issues": "road",
        "Lighting & Electrical": "street light",
        "Garbage & Sanitation": "waste management",
        "Water Supply & Leakage": "water supply",
        "Public Facilities": "public property",
        "Environmental Hazards": "other",
        "Safety Issues": "other",
        "Health & Hygiene": "waste management",
        "Transport": "road",
        "Other (General/Custom)": "other"
      };

      const problemType = problemTypeMap[data.category] || "other";

      // Prepare the request body (NOT FormData for now, use JSON)
      const requestBody = {
        title: data.title,
        description: data.description,
        problemType: problemType,
        severity: data.severity,
        location: {
          address: `${data.address}, ${data.district}, ${data.division}`,
          district: data.district,
          coordinates:
            data.latitude && data.longitude
              ? [parseFloat(data.longitude), parseFloat(data.latitude)]
              : [],
        },
        images: [], // For now, we'll handle images separately
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await res.json();

      toast.dismiss(submitToast);

      if (!res.ok) {
        throw new Error(result.message || "Failed to submit report");
      }

      toast.success("Report submitted successfully! 🎉");
      reset();
      setPreview(null);
      setDistricts([]);

      // Redirect to reports page after 1.5 seconds
      setTimeout(() => {
        router.push("/reports");
      }, 1500);

    } catch (error: unknown) {
      toast.dismiss(submitToast);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.error("Report submission error:", error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-12 px-4 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2a7d2f] mx-auto mb-4"></div>
          <p className="text-[#6B7280] text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not a user
  if (!isAuthenticated || user?.role !== "user") {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-12 px-4 flex justify-center items-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="mb-6">
            <FaLock className="text-6xl text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-[#002E2E] mb-3">
              Access Restricted
            </h1>
            <p className="text-[#6B7280] text-lg mb-6">
              Only registered users can submit reports.
              {user?.role && user.role !== "user" && (
                <span className="block mt-2 text-red-600 font-semibold">
                  You are logged in as {user.role}. Please use a user account to submit reports.
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="bg-[#2a7d2f] hover:bg-[#1e5d22] text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Login as User
                </button>
                <button
                  onClick={() => router.push("/auth/register")}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push("/")}
                className="bg-[#2a7d2f] hover:bg-[#1e5d22] text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Go to Homepage
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-12 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#002E2E] mb-2">
            Submit a New Report
          </h1>
          <p className="text-[#6B7280]">Help improve your community by reporting infrastructure issues</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm">
            <span className="font-semibold">✓ Verified User:</span> {user?.name}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Category & Subcategory */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select category</option>
                {Object.keys(categoryOptions).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                {...register("subcategory", { required: "Subcategory is required" })}
                disabled={!selectedCategory}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.subcategory ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">
                  {selectedCategory ? "Select subcategory" : "Select category first"}
                </option>
                {selectedCategory &&
                  categoryOptions[selectedCategory as keyof typeof categoryOptions].map(
                    (sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    )
                  )}
              </select>
              {errors.subcategory && (
                <p className="text-red-500 text-sm mt-1">{errors.subcategory.message}</p>
              )}
            </div>
          </div>

          {/* Title & Severity */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Report Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title", {
                  required: "Title is required",
                  minLength: { value: 10, message: "Title must be at least 10 characters" },
                  maxLength: { value: 100, message: "Title must not exceed 100 characters" }
                })}
                placeholder="e.g. Street light not working on Main Road"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Severity <span className="text-red-500">*</span>
              </label>
              <select
                {...register("severity", { required: "Severity is required" })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition ${
                  errors.severity ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select severity</option>
                <option value="low">🟢 Low - Minor issue</option>
                <option value="medium">🟡 Medium - Moderate issue</option>
                <option value="high">🟠 High - Serious issue</option>
                <option value="urgent">🔴 Urgent - Critical issue</option>
              </select>
              {errors.severity && (
                <p className="text-red-500 text-sm mt-1">{errors.severity.message}</p>
              )}
            </div>
          </div>

          {/* Location & Address */}
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="flex items-center mb-4">
              <FaMapMarkerAlt className="text-yellow-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-700">Location Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Division <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("division", { required: "Division is required" })}
                  value={selectedDivision}
                  onChange={handleDivisionChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition ${
                    errors.division ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select division</option>
                  {divisionData.map((div) => (
                    <option key={div.division} value={div.division}>
                      {div.division}
                    </option>
                  ))}
                </select>
                {errors.division && (
                  <p className="text-red-500 text-sm mt-1">{errors.division.message}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("district", { required: "District is required" })}
                  disabled={!selectedDivision}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.district ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">
                    {selectedDivision ? "Select district" : "Select division first"}
                  </option>
                  {Array.from(new Set(districts.map((d) => d.name))).map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                {...register("address", {
                  required: "Address is required",
                  minLength: { value: 10, message: "Address must be at least 10 characters" }
                })}
                placeholder="e.g. House 27, Road 5, Dhanmondi, Dhaka"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Latitude <span className="text-gray-400 text-sm">(Optional)</span>
                </label>
                <input
                  {...register("latitude")}
                  placeholder="Auto-filled when you click 'Get Location'"
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Longitude <span className="text-gray-400 text-sm">(Optional)</span>
                </label>
                <input
                  {...register("longitude")}
                  placeholder="Auto-filled when you click 'Get Location'"
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleLocationFetch}
                disabled={isLoadingLocation}
                className="bg-[#2a7d2f] hover:bg-[#1e5d22] disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold text-white px-6 py-2 rounded-lg shadow-md flex items-center gap-2"
              >
                <FaMapMarkerAlt />
                {isLoadingLocation ? "Fetching..." : "Get Current Location"}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: { value: 20, message: "Description must be at least 20 characters" },
                maxLength: { value: 500, message: "Description must not exceed 500 characters" }
              })}
              placeholder="Describe the issue clearly... (minimum 20 characters)"
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {watch("description")?.length || 0}/500 characters
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium text-gray-700 mb-3">Upload Image</label>
            <div className="flex gap-6 items-center">
              <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <FaUpload className="text-gray-500 text-2xl mb-2" />
                <p className="text-sm text-gray-500">Upload</p>
                <input
                  type="file"
                  {...register("image")}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setPreview(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </label>

              {preview && (
                <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200 shadow">
                  <Image src={preview} alt="Report preview" fill className="object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setPreview(null)}
                    title="Remove image"
                    aria-label="Remove image"
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#2a7d2f] hover:bg-[#1e5d22] disabled:bg-gray-400 disabled:cursor-not-allowed w-full transition font-bold text-white px-10 py-4 rounded-lg shadow-lg text-lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
            <p className="text-gray-500 text-sm mt-3">
              By submitting, you agree to our terms and conditions
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
