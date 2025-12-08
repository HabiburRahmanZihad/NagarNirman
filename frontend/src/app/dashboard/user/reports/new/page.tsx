'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaUpload, FaMapMarkerAlt, FaTimes, FaLock, FaCheckCircle, FaExclamationTriangle, FaCamera, FaArrowRight, FaGraduationCap } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loading, FullPageError } from "@/components/common";
import categoryOptions from "@/data/categoryOptions.json";
import divisionData from "@/data/divisionsData.json";
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

interface WeeklyLimitInfo {
  weeklyLimit: number;
  submittedThisWeek: number;
  completedThisWeek: number;
  remaining: number;
  daysLeft: number;
}

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
  const [weeklyLimit, setWeeklyLimit] = useState<WeeklyLimitInfo | null>(null);
  const [isLoadingLimit, setIsLoadingLimit] = useState(true);

  const selectedCategory = watch("category");
  const selectedDivision = watch("division");

  // Fetch weekly limit on component mount
  useEffect(() => {
    const fetchWeeklyLimit = async () => {
      try {
        const token = localStorage.getItem("nn_auth_token");
        if (!token) {
          setIsLoadingLimit(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/weekly-report-limit`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWeeklyLimit(data.data);
        } else {
          console.warn("Could not fetch weekly limit info");
        }
      } catch (error) {
        console.error("Error fetching weekly limit:", error);
      } finally {
        setIsLoadingLimit(false);
      }
    };

    if (isAuthenticated && user?.role === "user") {
      fetchWeeklyLimit();
    } else {
      setIsLoadingLimit(false);
    }
  }, [isAuthenticated, user?.role]);

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

      // Handle rate limit (429) - Weekly submission limit exceeded
      if (res.status === 429) {
        const { limitInfo, daysLeft, message } = result;

        // Show warning toast with detailed limit info
        toast.custom((t) => (
          <div className="bg-white rounded-lg shadow-2xl p-6 border-l-4 border-orange-500 max-w-md">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-1">⚠️</span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Weekly Limit Reached</h3>
                <p className="text-sm text-gray-700 mb-3">
                  {message || "You've reached your weekly report submission limit."}
                </p>
                <div className="bg-orange-50 rounded-md p-3 mb-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reports submitted:</span>
                    <span className="font-semibold text-gray-900">{limitInfo?.submitted}/{limitInfo?.weeklyLimit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reports completed:</span>
                    <span className="font-semibold text-gray-900">{limitInfo?.completed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reset available in:</span>
                    <span className="font-semibold text-orange-600">{daysLeft} day(s)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  💡 Tip: You can submit more reports after marking your current ones as completed!
                </p>
              </div>
            </div>
          </div>
        ), { duration: 6000 });

        console.log('Weekly limit exceeded:', { limitInfo, daysLeft });
        return;
      }

      if (!res.ok) {
        console.error('Error Response:', result);
        throw new Error(result.message || result.error || "Failed to submit report");
      }

      // Success - Show success toast with remaining reports
      const { limitInfo: successLimitInfo } = result;
      toast.custom((t) => (
        <div className="bg-white rounded-lg shadow-2xl p-6 border-l-4 border-green-500 max-w-md">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-1">🎉</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Report Submitted Successfully!</h3>
              <p className="text-sm text-gray-700 mb-3">
                Your report has been submitted and will be reviewed by the authorities.
              </p>
              <div className="bg-green-50 rounded-md p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining reports this week:</span>
                  <span className="font-semibold text-green-600">
                    {successLimitInfo?.remaining || (successLimitInfo?.weeklyLimit - (successLimitInfo?.submitted || 0))} available
                  </span>
                </div>
                {successLimitInfo && successLimitInfo.remaining === 0 && (
                  <div className="text-xs text-gray-600 pt-2 border-t border-green-200">
                    💡 You've used all your reports for this week. Complete your current reports to submit more!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ), { duration: 4000 });

      reset();
      setPreviews([]);
      setDistricts([]);

      // Redirect to user's reports dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/user/my-reports");
      }, 2000);

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
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  // Show access denied if not a user
  if (!isAuthenticated || user?.role !== "user") {
    return (
      <FullPageError
        errorCode={403}
        title="Access Restricted"
        message="Only regular users can submit reports. Please login as a user to continue."
        icon={<FaLock className="w-24 h-24 text-red-500" />}
        showHomeButton={true}
        showBackButton={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between  mb-8 border-b pb-4 bg-white rounded-lg shadow-sm px-6 py-4 border-accent/80">
            <div>
              <h1 className="text-4xl font-extrabold text-[#002E2E] mb-2 flex items-center gap-3">
                <FaUpload className="text-primary" />
                Report Infrastructure Issue
              </h1>
              <p className="text-[#6B7280]">Help improve your community by reporting problems you encounter</p>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-linear-to-r from-primary to-[#1e5d22] text-white rounded-xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <span className="text-xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm opacity-90">Verified User</p>
                <p className="font-bold text-lg">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-white" />
              <span className="font-semibold">Verified</span>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs/Steps Indicator */}
          <div className="bg-linear-to-r from-slate-50 to-slate-100 border-b-2 border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">1</div>
                <span className="font-semibold text-gray-700">Report Details</span>
              </div>
              <FaArrowRight className="text-gray-400" />
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary bg-opacity-30 text-primary font-bold text-sm">2</div>
                <span className="font-semibold text-gray-500">Location</span>
              </div>
              <FaArrowRight className="text-gray-400" />
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary bg-opacity-30 text-primary font-bold text-sm">3</div>
                <span className="font-semibold text-gray-500">Images & Submit</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Weekly Report Limit Display */}
            {isLoadingLimit ? (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg animate-pulse">
                <div className="h-4 bg-blue-200 rounded w-3/4"></div>
              </div>
            ) : weeklyLimit && (
              <div className={`border-l-4 p-4 rounded-lg ${weeklyLimit.remaining === 0
                ? 'bg-red-50 border-red-500'
                : weeklyLimit.remaining === 1
                  ? 'bg-orange-50 border-orange-500'
                  : 'bg-blue-50 border-blue-500'
                }`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">
                    {weeklyLimit.remaining === 0 ? '🔴' : weeklyLimit.remaining === 1 ? '🟠' : '🟢'}
                  </span>
                  <div className="flex-1">
                    <h3 className={`font-bold mb-3 text-lg ${weeklyLimit.remaining === 0
                      ? 'text-red-900'
                      : weeklyLimit.remaining === 1
                        ? 'text-orange-900'
                        : 'text-blue-900'
                      }`}>
                      📊 Weekly Report Status
                    </h3>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className={`p-3 rounded-lg ${weeklyLimit.remaining === 0 ? 'bg-red-100' : weeklyLimit.remaining === 1 ? 'bg-orange-100' : 'bg-blue-100'}`}>
                        <p className="text-xs font-medium opacity-75">Submitted</p>
                        <p className="text-2xl font-bold">{weeklyLimit.submittedThisWeek}/{weeklyLimit.weeklyLimit}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${weeklyLimit.remaining === 0 ? 'bg-red-100' : weeklyLimit.remaining === 1 ? 'bg-orange-100' : 'bg-blue-100'}`}>
                        <p className="text-xs font-medium opacity-75">Remaining</p>
                        <p className="text-2xl font-bold">{weeklyLimit.remaining}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${weeklyLimit.remaining === 0 ? 'bg-red-100' : weeklyLimit.remaining === 1 ? 'bg-orange-100' : 'bg-blue-100'}`}>
                        <p className="text-xs font-medium opacity-75">Completed</p>
                        <p className="text-2xl font-bold">{weeklyLimit.completedThisWeek}</p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${weeklyLimit.remaining === 0
                          ? 'bg-red-500 w-full'
                          : weeklyLimit.remaining === 1
                            ? 'bg-orange-500 w-[80%]'
                            : 'bg-green-500 w-[40%]'
                          }`}
                      ></div>
                    </div>
                    {weeklyLimit.remaining === 0 && (
                      <p className="text-xs text-red-700 mt-3 pt-3 border-t border-red-200">
                        💡 Complete your current reports to unlock more submissions!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Important Notice Banner */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex gap-3">
              <FaExclamationTriangle className="text-yellow-600 text-xl mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-1">Required Information</h3>
                <p className="text-yellow-800 text-sm">
                  All fields marked with <span className="text-red-500 font-bold">*</span> are mandatory. Location coordinates are required for proper mapping.
                </p>
              </div>
            </div>

            {/* Section 1: Report Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-200">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">1</div>
                <h2 className="text-2xl font-bold text-[#002E2E]">Report Details</h2>
              </div>

              {/* Category & Subcategory */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-gray-800 mb-2 text-sm">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("category", { required: "Category is required" })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition font-medium ${errors.category ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <option value="">📋 Select category</option>
                    {Object.keys(categoryOptions).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1 font-semibold flex items-center gap-1">
                      <FaExclamationTriangle className="text-xs" /> {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-2 text-sm">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("subcategory", { required: "Subcategory is required" })}
                    disabled={!selectedCategory}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition font-medium disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.subcategory ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <option value="">
                      {selectedCategory ? "📂 Select subcategory" : "Select category first"}
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
                    <p className="text-red-500 text-sm mt-1 font-semibold flex items-center gap-1">
                      <FaExclamationTriangle className="text-xs" /> {errors.subcategory.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Title & Severity */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-gray-800 mb-2 text-sm">
                    Report Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("title", {
                      required: "Title is required",
                      minLength: { value: 10, message: "Title must be at least 10 characters" },
                      maxLength: { value: 100, message: "Title must not exceed 100 characters" }
                    })}
                    placeholder="e.g. Street light not working on Main Road"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition ${errors.title ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1 font-semibold flex items-center gap-1">
                      <FaExclamationTriangle className="text-xs" /> {errors.title.message}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{watch("title")?.length || 0}/100 characters</p>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-2 text-sm">
                    Severity <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("severity", { required: "Severity is required" })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition font-medium ${errors.severity ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <option value="">⚠️ Select severity</option>
                    <option value="low">🟢 Low - Minor issue</option>
                    <option value="medium">🟡 Medium - Moderate issue</option>
                    <option value="high">🟠 High - Serious issue</option>
                    <option value="urgent">🔴 Urgent - Critical issue</option>
                  </select>
                  {errors.severity && (
                    <p className="text-red-500 text-sm mt-1 font-semibold flex items-center gap-1">
                      <FaExclamationTriangle className="text-xs" /> {errors.severity.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-800 mb-2 text-sm">
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
                  className={`w-full px-4 py-3 border-2 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary transition ${errors.description ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1 font-semibold flex items-center gap-1">
                    <FaExclamationTriangle className="text-xs" /> {errors.description.message}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-xs">
                    {watch("description")?.length || 0}/500 characters
                  </p>
                  {watch("description")?.length >= 20 && (
                    <p className="text-green-600 text-xs font-semibold flex items-center gap-1">
                      <FaCheckCircle /> Good length!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Location Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-200">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">2</div>
                <h2 className="text-2xl font-bold text-[#002E2E] flex items-center gap-2">
                  <FaMapMarkerAlt /> Location Details
                </h2>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <p className="text-blue-900 text-sm font-semibold">
                  📍 Accurate location information helps authorities respond quickly to your report.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-gray-800 mb-2 text-sm">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("division", { required: "Division is required" })}
                    value={selectedDivision}
                    onChange={handleDivisionChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition font-medium ${errors.division ? "border-red-500 bg-red-50" : selectedDivision ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
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
                    <p className="text-red-500 text-sm mt-1 font-semibold flex items-center gap-1">
                      <FaExclamationTriangle className="text-xs" /> {errors.division.message}
                    </p>
                  )}
                  {selectedDivision && !errors.division && (
                    <p className="text-green-600 text-sm mt-1 font-medium flex items-center gap-1">
                      <FaCheckCircle className="text-xs" /> Division selected
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-2 text-sm">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("district", { required: "District is required" })}
                    onChange={handleDistrictChange}
                    disabled={!selectedDivision}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition font-medium disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.district ? "border-red-500 bg-red-50" : watch("district") ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
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
                    <p className="text-red-500 text-sm mt-1 font-semibold flex items-center gap-1">
                      <FaExclamationTriangle className="text-xs" /> {errors.district.message}
                    </p>
                  )}
                  {watch("district") && !errors.district && (
                    <p className="text-green-600 text-sm mt-1 font-medium flex items-center gap-1">
                      <FaCheckCircle className="text-xs" /> District selected
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-2 text-sm">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("address", {
                    required: "Address is required",
                    minLength: { value: 10, message: "Address must be at least 10 characters" }
                  })}
                  placeholder="e.g. House 27, Road 5, Dhanmondi, Dhaka"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition ${errors.address ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1 font-semibold flex items-center gap-1">
                    <FaExclamationTriangle className="text-xs" /> {errors.address.message}
                  </p>
                )}
              </div>

              {/* Coordinates */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <h3 className="font-bold text-blue-900">GPS Coordinates <span className="text-red-500">*</span></h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-semibold text-gray-800 mb-2 text-sm">Latitude</label>
                    <input
                      {...register("latitude", { required: "Please fetch your location" })}
                      placeholder="Will be filled automatically"
                      readOnly
                      className={`w-full px-4 py-3 border-2 rounded-lg bg-white font-mono text-sm ${errors.latitude ? "border-red-500 bg-red-50" : "border-blue-300"
                        }`}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-800 mb-2 text-sm">Longitude</label>
                    <input
                      {...register("longitude", { required: "Please fetch your location" })}
                      placeholder="Will be filled automatically"
                      readOnly
                      className={`w-full px-4 py-3 border-2 rounded-lg bg-white font-mono text-sm ${errors.longitude ? "border-red-500 bg-red-50" : "border-blue-300"
                        }`}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLocationFetch}
                  disabled={isLoadingLocation}
                  className="w-full bg-linear-to-r from-primary to-[#1e5d22] hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition font-bold text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2"
                >
                  <FaMapMarkerAlt />
                  {isLoadingLocation ? "Fetching location..." : "📍 Get Current Location"}
                </button>

                {(watch("latitude") || watch("longitude")) && !errors.latitude && !errors.longitude && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center gap-2">
                    <FaCheckCircle className="text-green-600" />
                    <span className="text-green-700 font-semibold text-sm">Location coordinates captured successfully!</span>
                  </div>
                )}

                {(errors.latitude || errors.longitude) && (
                  <p className="text-red-500 text-sm mt-3 font-semibold flex items-center gap-1">
                    <FaExclamationTriangle className="text-xs" /> Location coordinates are required
                  </p>
                )}
              </div>
            </div>

            {/* Section 3: Images */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-200">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">3</div>
                <h2 className="text-2xl font-bold text-[#002E2E] flex items-center gap-2">
                  <FaCamera /> Upload Evidence
                </h2>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
                <p className="text-purple-900 text-sm font-semibold">
                  📸 Clear photos help authorities understand and respond to the issue better. Upload up to 5 images.
                </p>
              </div>

              <div>
                <label className={`flex flex-col items-center justify-center w-full h-40 border-3 border-dashed rounded-xl cursor-pointer transition ${errors.image ? "border-red-500 bg-red-50 hover:bg-red-100" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaUpload className={`text-4xl mb-2 ${errors.image ? 'text-red-500' : 'text-primary'}`} />
                    <p className="text-sm font-bold text-gray-700">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP up to 5MB each (Maximum 5 images)</p>
                  </div>
                  <input
                    type="file"
                    {...register("image", {
                      required: "At least one image is required",
                      onChange: (e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
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
                  <p className="text-red-500 text-sm mt-2 font-semibold flex items-center gap-1">
                    <FaExclamationTriangle className="text-xs" /> {errors.image.message}
                  </p>
                )}
              </div>

              {previews.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FaCheckCircle className="text-green-600" />
                    <p className="text-sm font-bold text-green-600">
                      {previews.length} image{previews.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative w-full h-32 rounded-xl overflow-hidden border-3 border-green-300 shadow-lg hover:shadow-xl transition group">
                        <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition rounded-xl flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              const newPreviews = previews.filter((_, i) => i !== index);
                              setPreviews(newPreviews);

                              if (newPreviews.length === 0) {
                                setValue("image", undefined as any);
                                const input = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
                                if (input) {
                                  input.value = '';
                                }
                              }
                            }}
                            title="Remove image"
                            aria-label="Remove image"
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                          >
                            <FaTimes size={14} />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs text-center py-2 font-semibold">
                          Image {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Section */}
            <div className="space-y-4 pt-6 border-t-2 border-gray-200">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 text-lg shrink-0" />
                <div>
                  <p className="text-green-900 font-bold mb-1">Ready to submit?</p>
                  <p className="text-green-800 text-sm">
                    Make sure all fields are filled correctly. Your report will be reviewed by authorities within 24 hours.
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                size="xl"
                fullWidth
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Submitting Report..." : "🚀 Submit Report"}
              </Button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-3">
              <FaGraduationCap className="text-2xl text-blue-600" />
              <h3 className="font-bold text-gray-900">Tips for Better Reports</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✓ Be specific in your title</li>
              <li>✓ Include clear details</li>
              <li>✓ Take photos from multiple angles</li>
              <li>✓ Ensure good lighting</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-3">
              <FaCheckCircle className="text-2xl text-green-600" />
              <h3 className="font-bold text-gray-900">What Happens Next</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✓ Report gets verified</li>
              <li>✓ Assigned to authorities</li>
              <li>✓ Status updates on map</li>
              <li>✓ Community upvotes help</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <FaMapMarkerAlt className="text-2xl text-purple-600" />
              <h3 className="font-bold text-gray-900">Location Tips</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✓ Enable GPS for accuracy</li>
              <li>✓ Stand at issue location</li>
              <li>✓ Provide street address</li>
              <li>✓ Clear landmarks help</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
