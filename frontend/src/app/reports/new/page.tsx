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
import { FullPageLoading, ErrorDisplay } from '@/components/common';
import Button from '@/components/common/Button';

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
  const [previews, setPreviews] = useState<string[]>([]);
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
    // Show a helpful message when division is selected
    if (div) {
      toast.success(`Division selected: ${div}`);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    setValue("district", districtName);

    // Auto-fill coordinates if district has them
    if (districtName && selectedDivision) {
      const district = districts.find(d => d.name === districtName);
      if (district && district.latitude && district.longitude) {
        setValue("latitude", district.latitude.toString());
        setValue("longitude", district.longitude.toString());
        toast.success(`District selected: ${districtName}. Coordinates auto-filled!`);
      } else {
        toast.success(`District selected: ${districtName}. Please fetch your exact location.`);
      }
    }
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

    // Validate division (CRITICAL - prevents unmapped reports)
    if (!data.division || data.division.trim() === "") {
      toast.error("Division is required! Please select your division.");
      return;
    }

    // Validate district
    if (!data.district || data.district.trim() === "") {
      toast.error("District is required! Please select your district.");
      return;
    }

    // Validate coordinates
    if (!data.latitude || !data.longitude) {
      toast.error("Please fetch your location using the 'Get Current Location' button");
      return;
    }

    // Validate images
    if (!data.image || data.image.length === 0) {
      toast.error("Please upload at least one image");
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

      // Location data
      const locationData = {
        address: `${data.address}, ${data.district}, ${data.division}`,
        district: data.district,
        division: data.division, // Add division as separate field
        coordinates: [parseFloat(data.longitude!), parseFloat(data.latitude!)],
      };

      // Convert images to base64
      let base64Images: string[] = [];
      if (data.image && data.image.length > 0) {
        toast.loading("Processing images...", { id: "image-processing" });

        const imagePromises = Array.from(data.image).map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        });

        base64Images = await Promise.all(imagePromises);
        toast.dismiss("image-processing");
      }

      // Prepare request body
      const requestBody = {
        title: data.title,
        description: data.description,
        problemType: problemType,
        category: data.category, // Save original category
        subcategory: data.subcategory || null, // Save subcategory
        severity: data.severity,
        location: locationData,
        images: base64Images,
      };

      // Debug log
      console.log('=== Frontend Debug ===');
      console.log('Form Data:', data);
      console.log('Problem Type:', problemType);
      console.log('Location Data:', locationData);
      console.log('Images count:', base64Images.length);
      console.log('=====================');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await res.json();

      console.log('Server Response:', result);
      console.log('Response Status:', res.status);

      toast.dismiss(submitToast);

      if (!res.ok) {
        console.error('Error Response:', result);
        throw new Error(result.message || result.error || "Failed to submit report");
      }

      toast.success("Report submitted successfully! 🎉");
      reset();
      setPreviews([]);
      setDistricts([]);

      // Redirect to user's my-reports page after 1.5 seconds
      setTimeout(() => {
        router.push("/dashboard/user/my-reports");
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
    return <FullPageLoading message="Preparing Form" submessage="Setting up report submission form..." />;
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

        {/* Important Notice Banner */}
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-start">
            <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3 shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                📍 Location Information Required
              </h3>
              <p className="text-blue-800 text-sm">
                <strong>Division and District are mandatory fields.</strong> Please ensure you select both to help us route your report to the correct authorities. Reports without complete location data cannot be properly mapped and processed.
              </p>
            </div>
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition ${errors.category ? "border-red-500" : "border-gray-300"
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.subcategory ? "border-red-500" : "border-gray-300"
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition ${errors.title ? "border-red-500" : "border-gray-300"
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition ${errors.severity ? "border-red-500" : "border-gray-300"
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
                <label className="block font-semibold text-gray-800 mb-2 text-base">
                  Division <span className="text-red-500 text-lg">*</span>
                  <span className="text-xs font-normal text-gray-500 ml-2">(Required for mapping)</span>
                </label>
                <select
                  {...register("division", { required: "Division is required" })}
                  value={selectedDivision}
                  onChange={handleDivisionChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition font-medium ${errors.division ? "border-red-500 bg-red-50" : selectedDivision ? "border-green-500 bg-green-50" : "border-gray-300"
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
                  <p className="text-red-500 text-sm mt-1 font-semibold">⚠️ {errors.division.message}</p>
                )}
                {selectedDivision && !errors.division && (
                  <p className="text-green-600 text-sm mt-1 font-medium">✓ Division selected</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-2 text-base">
                  District <span className="text-red-500 text-lg">*</span>
                  <span className="text-xs font-normal text-gray-500 ml-2">(Required for mapping)</span>
                </label>
                <select
                  {...register("district", { required: "District is required" })}
                  onChange={handleDistrictChange}
                  disabled={!selectedDivision}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition font-medium disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.district ? "border-red-500 bg-red-50" : watch("district") ? "border-green-500 bg-green-50" : "border-gray-300"
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
                  <p className="text-red-500 text-sm mt-1 font-semibold">⚠️ {errors.district.message}</p>
                )}
                {watch("district") && !errors.district && (
                  <p className="text-green-600 text-sm mt-1 font-medium">✓ District selected</p>
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition ${errors.address ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Latitude <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("latitude", { required: "Please fetch your location" })}
                  placeholder="Click 'Get Current Location' button below"
                  readOnly
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-50 cursor-not-allowed ${errors.latitude ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.latitude && (
                  <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>
                )}
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Longitude <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("longitude", { required: "Please fetch your location" })}
                  placeholder="Click 'Get Current Location' button below"
                  readOnly
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-50 cursor-not-allowed ${errors.longitude ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.longitude && (
                  <p className="text-red-500 text-sm mt-1">{errors.longitude.message}</p>
                )}
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
              <p className="text-red-500 text-sm mt-2">
                * Location coordinates are required. Please click the button above to fetch.
              </p>
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
              className={`w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition ${errors.description ? "border-red-500" : "border-gray-300"
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
            <label className="block font-medium text-gray-700 mb-3">
              Upload Images <span className="text-red-500">* (Required - Maximum 5 images, 5MB each)</span>
            </label>
            <div className="space-y-4">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition ${errors.image ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}>
                <FaUpload className="text-gray-500 text-2xl mb-2" />
                <p className="text-sm text-gray-500 font-semibold">Click to upload images (Required)</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WebP up to 5MB each</p>
                <input
                  type="file"
                  {...register("image", {
                    required: "At least one image is required",
                    onChange: (e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        // Update previews
                        const newPreviews: string[] = [];
                        for (let i = 0; i < Math.min(files.length, 5); i++) {
                          newPreviews.push(URL.createObjectURL(files[i]));
                        }
                        setPreviews(newPreviews);

                        if (files.length > 5) {
                          toast.error("Maximum 5 images allowed. First 5 will be uploaded.");
                        }
                      }
                    }
                  })}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
              </label>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
              )}

              {previews.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-green-600 mb-2">
                    ✓ {previews.length} image(s) selected
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-green-300 shadow">
                        <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => {
                            // Remove preview
                            const newPreviews = previews.filter((_, i) => i !== index);
                            setPreviews(newPreviews);

                            // If all images removed, clear the file input
                            if (newPreviews.length === 0) {
                              setValue("image", undefined as any);
                              // Force re-render by creating a new empty FileList
                              const input = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
                              if (input) {
                                input.value = '';
                              }
                            }
                          }}
                          title="Remove image"
                          aria-label="Remove image"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        >
                          <FaTimes size={12} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs text-center py-1">
                          Image {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="text-center pt-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm font-semibold">
                ⚠️ All fields are mandatory including images and location coordinates
              </p>
            </div>
            <Button
              variant="primary"
              size="xl"
              iconPosition="right"
              fullWidth
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
            <p className="text-gray-500 text-sm mt-3">
              By submitting, you agree to our terms and conditions
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
