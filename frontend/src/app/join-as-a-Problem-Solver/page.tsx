'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaBuilding,
  FaCode,
  FaFileAlt,
  FaImage,
  FaCheck,
  FaPaperPlane,
  FaIdCard,
  FaHome,
  FaSave,
  FaCalendar,
  FaTransgender,
  FaUserTie,
  FaArrowRight
} from 'react-icons/fa';

// Import divisions data
import divisionsData from '@/data/divisionsData.json';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  division: string;
  district: string;
  address: string;
  profession: string;
  organization: string;
  skills: { value: string; label: string }[];
  motivation: string;
  experience: string;
  profileImage: FileList | null;
  nidOrIdDoc: FileList | null;
  agree: boolean;
}

interface UserInfo {
  email: string;
  name: string;
}

const skillOptions = [
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'public-health', label: 'Public Health' },
  { value: 'education', label: 'Education' },
  { value: 'environment', label: 'Environment' },
  { value: 'safety', label: 'Safety' },
  { value: 'disaster-relief', label: 'Disaster Relief' },
  { value: 'social-services', label: 'Social Services' },
  { value: 'technology', label: 'Technology' },
  { value: 'community-outreach', label: 'Community Outreach' },
  { value: 'legal-aid', label: 'Legal Aid' },
];

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export default function ApplyProblemSolver() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [districts, setDistricts] = useState<{ name: string; latitude: number; longitude: number }[]>([]);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      skills: [],
      agree: false,
      gender: '',
      division: '',
      district: '',
    },
  });

  const selectedDivision = watch('division');
  const profileImage = watch('profileImage');
  const step1Fields = watch(['fullName', 'phone', 'dateOfBirth', 'gender', 'division', 'district', 'address', 'profession']);

  // Check if step 1 is valid
  const isStep1Valid = () => {
    return (
      step1Fields[0] && // fullName
      step1Fields[1] && // phone
      step1Fields[2] && // dateOfBirth
      step1Fields[3] && // gender
      step1Fields[4] && // division
      step1Fields[5] && // district
      step1Fields[6] && // address
      step1Fields[7]    // profession
    );
  };

  useEffect(() => {
    // Check authentication and get user info
    const authToken = localStorage.getItem('nn_auth_token');
    if (!authToken) {
      router.push('/auth/login');
      return;
    }

    // Get user info from localStorage
    const userDataStr = localStorage.getItem('nn_user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      
      // Check if user role is 'user'
      if (userData.role !== 'user') {
        toast.error('Only regular users can apply to become problem solvers');
        router.push('/dashboard');
        return;
      }

      const userInfo: UserInfo = {
        email: userData.email,
        name: userData.name
      };
      setUserInfo(userInfo);
      setValue('email', userInfo.email);
      setValue('fullName', userInfo.name);
    }

    // Load draft from localStorage
    const draft = localStorage.getItem('problem-solver-draft');
    if (draft) {
      const draftData = JSON.parse(draft);
      Object.keys(draftData).forEach(key => {
        setValue(key as keyof FormData, draftData[key]);
      });
    }
  }, [router, setValue]);

  useEffect(() => {
    if (selectedDivision) {
      const division = divisionsData.find(div => div.division === selectedDivision);
      setDistricts(division?.districts || []);
      // Reset district when division changes
      setValue('district', '');
    } else {
      setDistricts([]);
    }
  }, [selectedDivision, setValue]);

  useEffect(() => {
    if (profileImage && profileImage.length > 0) {
      const file = profileImage[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [profileImage]);

  const saveDraft = (data: Partial<FormData>) => {
    setIsSavingDraft(true);
    try {
      localStorage.setItem('problem-solver-draft', JSON.stringify(data));
      toast.success('Draft saved successfully!');
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Prepare the data for API submission
      const submissionData = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        division: data.division,
        district: data.district,
        address: data.address,
        profession: data.profession,
        organization: data.organization || null,
        skills: data.skills.map(skill => skill.value),
        motivation: data.motivation,
        experience: data.experience || null,
        profileImage: data.profileImage?.[0] ? await fileToBase64(data.profileImage[0]) : null,
        nidOrIdDoc: data.nidOrIdDoc?.[0] ? await fileToBase64(data.nidOrIdDoc[0]) : null,
      };

      // Import the API function
      const { problemSolverAPI } = await import('@/utils/api');
      
      const result = await problemSolverAPI.applyAsProblemSolver(submissionData);

      // Clear draft
      localStorage.removeItem('problem-solver-draft');
      
      toast.success('Application submitted successfully! Your application is pending review by authorities.');
      
      // Reset form
      reset();
      
      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/user');
      }, 2500);
      
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const onSaveDraft = () => {
    const formData = watch();
    saveDraft(formData);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const nextStep = async () => {
    // Validate step 1 fields before proceeding
    const isValid = await trigger(['fullName', 'phone', 'dateOfBirth', 'gender', 'division', 'district', 'address', 'profession']);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => setCurrentStep(1);

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a7d2f]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-8 px-4 sm:px-6 lg:px-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#2a7d2f',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Apply to Join as Problem Solver
          </h1>
          <p className="text-gray-600 mb-4">
            Help your community by verifying and resolving public problem reports
          </p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-[#2a7d2f]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 ${currentStep >= 1 ? 'border-[#2a7d2f] bg-[#2a7d2f] text-white' : 'border-gray-400'} flex items-center justify-center text-sm font-semibold`}>
                  1
                </div>
                <span className="ml-2 text-sm">Personal Info</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-[#2a7d2f]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 ${currentStep >= 2 ? 'border-[#2a7d2f] bg-[#2a7d2f] text-white' : 'border-gray-400'} flex items-center justify-center text-sm font-semibold`}>
                  2
                </div>
                <span className="ml-2 text-sm">Background & Skills</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="flex items-center text-sm font-medium text-gray-700">
                        <FaUser className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                        Full Name <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        {...register('fullName', {
                          required: 'Full name is required',
                          minLength: {
                            value: 2,
                            message: 'Full name must be at least 2 characters',
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors"
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                        <FaEnvelope className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                        Email Address <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={userInfo.email}
                        readOnly
                        {...register('email', { required: true })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700">
                        <FaPhone className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                        Phone Number <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[0-9+\-\s()]+$/,
                            message: 'Please enter a valid phone number',
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors"
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                      <label htmlFor="dateOfBirth" className="flex items-center text-sm font-medium text-gray-700">
                        <FaCalendar className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                        Date of Birth <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        id="dateOfBirth"
                        type="date"
                        {...register('dateOfBirth', {
                          required: 'Date of birth is required',
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors"
                      />
                      {errors.dateOfBirth && (
                        <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <label htmlFor="gender" className="flex items-center text-sm font-medium text-gray-700">
                        <FaTransgender className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                        Gender <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        id="gender"
                        {...register('gender', { required: 'Gender is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors"
                      >
                        <option value="">Select Gender</option>
                        {genderOptions.map((gender) => (
                          <option key={gender.value} value={gender.value}>
                            {gender.label}
                          </option>
                        ))}
                      </select>
                      {errors.gender && (
                        <p className="text-red-500 text-sm">{errors.gender.message}</p>
                      )}
                    </div>

                    {/* Profession */}
                    <div className="space-y-2">
                      <label htmlFor="profession" className="flex items-center text-sm font-medium text-gray-700">
                        <FaUserTie className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                        Profession <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        id="profession"
                        type="text"
                        {...register('profession', {
                          required: 'Profession is required',
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors"
                        placeholder="e.g., Teacher, Engineer, Volunteer"
                      />
                      {errors.profession && (
                        <p className="text-red-500 text-sm">{errors.profession.message}</p>
                      )}
                    </div>

                    {/* Division & District in one row */}
                    <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Division */}
                      <div className="space-y-2">
                        <label htmlFor="division" className="flex items-center text-sm font-medium text-gray-700">
                          <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                          Division <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          id="division"
                          {...register('division', { required: 'Division is required' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors"
                        >
                          <option value="">Select Division</option>
                          {divisionsData.map((division) => (
                            <option key={division.division} value={division.division}>
                              {division.division}
                            </option>
                          ))}
                        </select>
                        {errors.division && (
                          <p className="text-red-500 text-sm">{errors.division.message}</p>
                        )}
                      </div>

                      {/* District */}
                      <div className="space-y-2">
                        <label htmlFor="district" className="flex items-center text-sm font-medium text-gray-700">
                          <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                          District <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          id="district"
                          {...register('district', { required: 'District is required' })}
                          disabled={!selectedDivision}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">{selectedDivision ? 'Select District' : 'First select division'}</option>
                          {districts.map((district) => (
                            <option key={district.name} value={district.name}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        {errors.district && (
                          <p className="text-red-500 text-sm">{errors.district.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="lg:col-span-2 space-y-2">
                      <label htmlFor="address" className="flex items-center text-sm font-medium text-gray-700">
                        <FaHome className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                        Full Address <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        id="address"
                        type="text"
                        {...register('address', {
                          required: 'Address is required',
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors"
                        placeholder="Enter your complete address with area, road, and house details"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm">{errors.address.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Step Navigation */}
                  <div className="flex justify-end pt-4">
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStep1Valid()}
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      className="bg-[#2a7d2f] text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors hover:bg-[#236b27]"
                    >
                      <span>Next</span>
                      <FaArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Background & Skills</h2>
                  
                  {/* Organization - Full Width */}
                  <div className="space-y-2">
                    <label htmlFor="organization" className="flex items-center text-sm font-medium text-gray-700">
                      <FaBuilding className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                      Organization (Optional)
                    </label>
                    <input
                      id="organization"
                      type="text"
                      {...register('organization')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors"
                      placeholder="e.g., NGO, Company, Institution"
                    />
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <label htmlFor="skills" className="flex items-center text-sm font-medium text-gray-700">
                      <FaCode className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                      Skills & Expertise <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Controller
                      name="skills"
                      control={control}
                      rules={{ required: 'At least one skill is required' }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isMulti
                          options={skillOptions}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select your skills and expertise..."
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: '1px solid #D1D5DB',
                              borderRadius: '0.5rem',
                              padding: '0.25rem',
                              '&:hover': {
                                borderColor: '#D1D5DB',
                              },
                            }),
                          }}
                        />
                      )}
                    />
                    {errors.skills && (
                      <p className="text-red-500 text-sm">{errors.skills.message}</p>
                    )}
                  </div>

                  {/* Motivation */}
                  <div className="space-y-2">
                    <label htmlFor="motivation" className="flex items-center text-sm font-medium text-gray-700">
                      <FaPaperPlane className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                      Motivation <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      id="motivation"
                      rows={4}
                      {...register('motivation', {
                        required: 'Motivation is required',
                        minLength: {
                          value: 50,
                          message: 'Motivation must be at least 50 characters',
                        },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors resize-none"
                      placeholder="Why do you want to join as a problem solver? (Minimum 50 characters)"
                    />
                    {errors.motivation && (
                      <p className="text-red-500 text-sm">{errors.motivation.message}</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <label htmlFor="experience" className="flex items-center text-sm font-medium text-gray-700">
                      <FaFileAlt className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                      Relevant Experience (Optional)
                    </label>
                    <textarea
                      id="experience"
                      rows={3}
                      {...register('experience')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors resize-none"
                      placeholder="Describe any relevant work or volunteer experience..."
                    />
                  </div>

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Profile Image */}
                    <div className="space-y-2">
                      <label htmlFor="profileImage" className="flex items-center text-sm font-medium text-gray-700">
                        <FaImage className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                        Profile Photo (Optional)
                      </label>
                      <input
                        id="profileImage"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        {...register('profileImage')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2a7d2f] file:text-white hover:file:bg-[#236b27]"
                      />
                      {profileImagePreview && (
                        <div className="mt-2">
                          <img 
                            src={profileImagePreview} 
                            alt="Profile preview" 
                            className="w-20 h-20 rounded-full object-cover border-2 border-[#2a7d2f]"
                          />
                        </div>
                      )}
                    </div>

                    {/* ID Document - Now Required */}
                    <div className="space-y-2">
                      <label htmlFor="nidOrIdDoc" className="flex items-center text-sm font-medium text-gray-700">
                        <FaIdCard className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                        ID Document <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        id="nidOrIdDoc"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        {...register('nidOrIdDoc', {
                          required: 'ID document is required',
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2a7d2f] file:text-white hover:file:bg-[#236b27]"
                      />
                      {errors.nidOrIdDoc && (
                        <p className="text-red-500 text-sm">{errors.nidOrIdDoc.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Agreement */}
                  <div className="flex items-start space-x-3 pt-4">
                    <input
                      id="agree"
                      type="checkbox"
                      {...register('agree', {
                        required: 'You must agree to the terms and conditions',
                      })}
                      className="mt-1 w-4 h-4 text-[#2a7d2f] bg-gray-100 border-gray-300 rounded focus:ring-[#2a7d2f] focus:ring-2"
                    />
                    <label htmlFor="agree" className="text-sm text-gray-700">
                      I agree to the terms and conditions and confirm that all information provided is accurate and truthful. I understand that my application will be reviewed and I may be contacted for verification.
                    </label>
                  </div>
                  {errors.agree && (
                    <p className="text-red-500 text-sm">{errors.agree.message}</p>
                  )}

                  {/* Step Navigation */}
                  <div className="flex justify-between pt-4">
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      className="bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 transition-colors hover:bg-gray-600"
                    >
                      <span>Back</span>
                    </motion.button>

                    <div className="flex space-x-4">
                      <motion.button
                        type="button"
                        onClick={onSaveDraft}
                        disabled={isSavingDraft}
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        className="bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors hover:bg-gray-300"
                      >
                        {isSavingDraft ? (
                          <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FaSave className="w-4 h-4" />
                        )}
                        <span>Save Draft</span>
                      </motion.button>

                      <motion.button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        className="bg-[#2a7d2f] text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors hover:bg-[#236b27]"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="w-4 h-4" />
                            <span>Submit Application</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        .react-select-container .react-select__control {
          border: 1px solid #D1D5DB;
          border-radius: 0.5rem;
          padding: 0.25rem;
        }
        .react-select-container .react-select__control:hover {
          border-color: #D1D5DB;
        }
        .react-select-container .react-select__control--is-focused {
          border-color: #2a7d2f;
          box-shadow: 0 0 0 2px rgba(42, 125, 47, 0.2);
        }
        .react-select-container .react-select__multi-value {
          background-color: #2a7d2f;
        }
        .react-select-container .react-select__multi-value__label {
          color: #fff;
        }
        .react-select-container .react-select__multi-value__remove:hover {
          background-color: #236b27;
          color: #fff;
        }
      `}</style>
    </div>
  );
}