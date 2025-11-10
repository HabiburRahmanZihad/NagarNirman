"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaUpload, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
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
  const { register, handleSubmit, watch, reset, setValue } =
    useForm<ReportFormData>();
  const [preview, setPreview] = useState<string | null>(null);
  const [districts, setDistricts] = useState<
    { name: string; latitude: number; longitude: number }[]
  >([]);

  const selectedCategory = watch("category");
  const selectedDivision = watch("division");

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
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setValue("latitude", latitude.toFixed(6));
        setValue("longitude", longitude.toFixed(6));
        toast.success("Location fetched successfully!");
      },
      () => {
        toast.error("Unable to fetch your location.");
      }
    );
  };

  const onSubmit = async (data: ReportFormData) => {
    try {
      const token = localStorage.getItem("nn_auth_token");
      if (!token) throw new Error("You must be logged in");

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("problemType", data.subcategory || data.category);
      formData.append("severity", data.severity);
      formData.append(
        "location",
        JSON.stringify({
          address: data.address,
          division: data.division,
          district: data.district,
          coordinates:
            data.latitude && data.longitude
              ? [parseFloat(data.longitude), parseFloat(data.latitude)]
              : [],
        })
      );

      if (data.image && data.image.length > 0) {
        Array.from(data.image).forEach((file) => formData.append("images", file));
      }

      // Include user ID (replace with actual auth user ID)
      const userIdFromAuth = localStorage.getItem("user_id") || "";
      formData.append("createdBy", userIdFromAuth);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to submit report");

      toast.success("Report submitted successfully!");
      reset();
      setPreview(null);
      setDistricts([]);
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-12 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Submit a new report
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Category & Subcategory */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                {...register("category", { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select category</option>
                {Object.keys(categoryOptions).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                {...register("subcategory", { required: true })}
                disabled={!selectedCategory}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100"
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
            </div>
          </div>

          {/* Title & Severity */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Report Title</label>
              <input
                {...register("title", { required: true })}
                placeholder="e.g. Street light not working"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Severity</label>
              <select
                {...register("severity", { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
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
                <label className="block font-medium text-gray-700 mb-2">Division</label>
                <select
                  value={selectedDivision}
                  onChange={handleDivisionChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select division</option>
                  {divisionData.map((div) => (
                    <option key={div.division} value={div.division}>
                      {div.division}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">District</label>
                <select
                  {...register("district", { required: true })}
                  disabled={!selectedDivision}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100"
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
              </div>
            </div>

            <div className="mt-6">
              <label className="block font-medium text-gray-700 mb-2">Address</label>
              <input
                {...register("address", { required: true })}
                placeholder="e.g. Dhanmondi 27, Dhaka"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block font-medium text-gray-700 mb-2">Latitude</label>
                <input
                  {...register("latitude")}
                  placeholder="Click 'Get Location'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">Longitude</label>
                <input
                  {...register("longitude")}
                  placeholder="Click 'Get Location'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleLocationFetch}
                className="bg-yellow-400 hover:bg-yellow-500 transition font-semibold text-gray-900 px-6 py-2 rounded-lg shadow"
              >
                Get Current Location
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Description</label>
            <textarea
              {...register("description", { required: true })}
              placeholder="Describe the issue clearly..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-yellow-400"
            ></textarea>
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
                  <Image src={preview} alt="Preview" fill className="object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setPreview(null)}
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
              className="bg-yellow-400 hover:bg-yellow-500 w-full transition font-semibold px-10 py-3 rounded-lg shadow-lg"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
