'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import Button from '@/components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaCode,
  FaFileAlt,
  FaCheck,
  FaPaperPlane,
  FaIdCard,
  FaHome,
  FaCalendar,
  FaTransgender,
  FaUserTie,
  FaArrowRight
} from 'react-icons/fa';

// Import divisions data
import divisionsData from '@/data/divisionsData.json';
import { FullPageLoading } from '@/components/common';

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
  nidOrIdDoc: FileList | null;
  nidNumber: string;
  emergencyContact: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  educationLevel: string;
  availability: string;
  languagesSpoken: { value: string; label: string }[];
  previousVolunteerWork: string;
  linkedinProfile: string;
  facebookProfile: string;
  twitterProfile: string;
  websiteProfile: string;
  agree: boolean;
}

interface UserInfo {
  email: string;
  name: string;
}

const professionOptions = [
  { value: '', label: 'Select or type your profession' },
  { value: 'Engineer', label: 'Engineer' },
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Doctor', label: 'Doctor' },
  { value: 'Lawyer', label: 'Lawyer' },
  { value: 'Architect', label: 'Architect' },
  { value: 'Social Worker', label: 'Social Worker' },
  { value: 'Government Employee', label: 'Government Employee' },
  { value: 'Business Person', label: 'Business Person' },
  { value: 'Student', label: 'Student' },
  { value: 'Volunteer', label: 'Volunteer' },
  { value: 'NGO Worker', label: 'NGO Worker' },
  { value: 'Healthcare Professional', label: 'Healthcare Professional' },
  { value: 'IT Professional', label: 'IT Professional' },
  { value: 'Community Leader', label: 'Community Leader' },
  { value: 'Retired Professional', label: 'Retired Professional' },
  { value: 'other', label: 'Other (Type below)' },
];

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
  { value: 'project-management', label: 'Project Management' },
  { value: 'data-analysis', label: 'Data Analysis' },
  { value: 'communication', label: 'Communication & Public Relations' },
  { value: 'financial-management', label: 'Financial Management' },
  { value: 'urban-planning', label: 'Urban Planning' },
  { value: 'medical-healthcare', label: 'Medical & Healthcare' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'research', label: 'Research & Documentation' },
  { value: 'training', label: 'Training & Capacity Building' },
  { value: 'conflict-resolution', label: 'Conflict Resolution' },
];

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const educationLevelOptions = [
  { value: '', label: 'Select Education Level' },
  { value: 'Secondary', label: 'Secondary School (SSC)' },
  { value: 'Higher Secondary', label: 'Higher Secondary (HSC)' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'Bachelor', label: "Bachelor's Degree" },
  { value: 'Master', label: "Master's Degree" },
  { value: 'PhD', label: 'PhD/Doctorate' },
  { value: 'Other', label: 'Other' },
];

const availabilityOptions = [
  { value: '', label: 'Select Availability' },
  { value: 'Full-time', label: 'Full-time (40+ hours/week)' },
  { value: 'Part-time', label: 'Part-time (20-40 hours/week)' },
  { value: 'Weekends', label: 'Weekends Only' },
  { value: 'Flexible', label: 'Flexible (As needed)' },
  { value: 'Limited', label: 'Limited (Few hours/week)' },
];

const relationOptions = [
  { value: '', label: 'Select Relation' },
  { value: 'Father', label: 'Father' },
  { value: 'Mother', label: 'Mother' },
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Sibling', label: 'Sibling' },
  { value: 'Child', label: 'Child' },
  { value: 'Friend', label: 'Friend' },
  { value: 'Colleague', label: 'Colleague' },
  { value: 'Other', label: 'Other' },
];

const languageOptions = [
  { value: 'Bengali', label: 'Bengali' },
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Urdu', label: 'Urdu' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'French', label: 'French' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Mandarin', label: 'Mandarin' },
];

export default function ApplyProblemSolver() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [districts, setDistricts] = useState<{ name: string; latitude: number; longitude: number }[]>([]);
  const [nidDocumentPreview, setNidDocumentPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [professionType, setProfessionType] = useState<string>('');
  const [customProfession, setCustomProfession] = useState<string>('');
  const [educationLevelType, setEducationLevelType] = useState<string>('');
  const [customEducationLevel, setCustomEducationLevel] = useState<string>('');

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
      languagesSpoken: [],
    },
  });

  const selectedDivision = watch('division');
  const nidOrIdDoc = watch('nidOrIdDoc');
  const step1Fields = watch(['fullName', 'phone', 'dateOfBirth', 'gender', 'division', 'district', 'address', 'profession', 'nidNumber', 'emergencyContact', 'emergencyContactName', 'emergencyContactRelation']);

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
      step1Fields[7] && // profession
      step1Fields[8] && // nidNumber
      step1Fields[9] && // emergencyContact
      step1Fields[10] && // emergencyContactName
      step1Fields[11]    // emergencyContactRelation
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

      // Pre-fill all user data
      setValue('email', userData.email || '');
      setValue('fullName', userData.name || '');
      setValue('phone', userData.phone || '');
      setValue('division', userData.division || '');
      setValue('district', userData.district || '');
      setValue('address', userData.address || '');

      // Set profession type if it's in the dropdown
      if (userData.profession) {
        const professionExists = professionOptions.find(opt => opt.value === userData.profession);
        if (professionExists) {
          setProfessionType(userData.profession);
          setValue('profession', userData.profession);
        }
      }

      // Set districts if division exists
      if (userData.division) {
        const division = divisionsData.find(div => div.division === userData.division);
        setDistricts(division?.districts || []);
      }
    }

    // Check for reapply data (rejected application)
    const reapplyDataStr = localStorage.getItem('nn_reapply_data');
    if (reapplyDataStr) {
      try {
        const reapplyData = JSON.parse(reapplyDataStr);

        // Show notification about prefilled data
        toast.success('Your previous application data has been loaded. You can modify any field before resubmitting.', {
          duration: 5000,
        });

        // Display review note if available
        if (reapplyData.reviewNote) {
          setTimeout(() => {
            toast.error(`Previous Rejection Reason: ${reapplyData.reviewNote}`, {
              duration: 10000,
            });
          }, 1000);
        }

        // Pre-fill all fields from previous application
        setValue('fullName', reapplyData.fullName || '');
        setValue('email', reapplyData.email || '');
        setValue('phone', reapplyData.phone || '');
        setValue('dateOfBirth', reapplyData.dateOfBirth ? new Date(reapplyData.dateOfBirth).toISOString().split('T')[0] : '');
        setValue('gender', reapplyData.gender || '');
        setValue('division', reapplyData.division || '');
        setValue('district', reapplyData.district || '');
        setValue('address', reapplyData.address || '');

        // Handle profession
        if (reapplyData.profession) {
          const professionExists = professionOptions.find(opt => opt.value === reapplyData.profession);
          if (professionExists) {
            setProfessionType(reapplyData.profession);
            setValue('profession', reapplyData.profession);
          } else {
            setProfessionType('other');
            setCustomProfession(reapplyData.profession);
            setValue('profession', reapplyData.profession);
          }
        }

        setValue('organization', reapplyData.organization || '');
        setValue('nidNumber', reapplyData.nidNumber || '');
        setValue('emergencyContact', reapplyData.emergencyContact || '');
        setValue('emergencyContactName', reapplyData.emergencyContactName || '');
        setValue('emergencyContactRelation', reapplyData.emergencyContactRelation || '');

        // Handle education level
        if (reapplyData.educationLevel) {
          const educationExists = educationLevelOptions.find(opt => opt.value === reapplyData.educationLevel);
          if (educationExists) {
            setEducationLevelType(reapplyData.educationLevel);
            setValue('educationLevel', reapplyData.educationLevel);
          } else {
            setEducationLevelType('Other');
            setCustomEducationLevel(reapplyData.educationLevel);
            setValue('educationLevel', reapplyData.educationLevel);
          }
        }

        setValue('availability', reapplyData.availability || '');
        setValue('previousVolunteerWork', reapplyData.previousVolunteerWork || '');
        setValue('linkedinProfile', reapplyData.linkedinProfile || '');
        setValue('facebookProfile', reapplyData.facebookProfile || '');
        setValue('twitterProfile', reapplyData.twitterProfile || '');
        setValue('websiteProfile', reapplyData.websiteProfile || '');
        setValue('motivation', reapplyData.motivation || '');
        setValue('experience', reapplyData.experience || '');

        // Handle skills (convert array to Select format)
        if (reapplyData.skills && Array.isArray(reapplyData.skills)) {
          const skillsFormatted = reapplyData.skills.map((skill: string) => ({
            value: skill,
            label: skill.charAt(0).toUpperCase() + skill.slice(1).replace(/-/g, ' ')
          }));
          setValue('skills', skillsFormatted);
        }

        // Handle languages (convert array to Select format)
        if (reapplyData.languagesSpoken && Array.isArray(reapplyData.languagesSpoken)) {
          const languagesFormatted = reapplyData.languagesSpoken.map((lang: string) => ({
            value: lang,
            label: lang
          }));
          setValue('languagesSpoken', languagesFormatted);
        }

        // Set districts based on division
        if (reapplyData.division) {
          const division = divisionsData.find(div => div.division === reapplyData.division);
          setDistricts(division?.districts || []);
        }

        // Clear reapply data after loading
        localStorage.removeItem('nn_reapply_data');
      } catch (error) {
        console.error('Failed to load reapply data:', error);
        toast.error('Failed to load previous application data');
        localStorage.removeItem('nn_reapply_data');
      }
    } else {
      // Load draft from localStorage only if no reapply data
      const draft = localStorage.getItem('problem-solver-draft');
      if (draft) {
        const draftData = JSON.parse(draft);
        Object.keys(draftData).forEach(key => {
          setValue(key as keyof FormData, draftData[key]);
        });
      }
    }
  }, [router, setValue]);

  useEffect(() => {
    if (selectedDivision) {
      const division = divisionsData.find(div => div.division === selectedDivision);
      const newDistricts = division?.districts || [];
      setDistricts(newDistricts);

      // Only reset district if it's not in the new districts list
      const currentDistrict = watch('district');
      const districtExists = newDistricts.some(d => d.name === currentDistrict);
      if (currentDistrict && !districtExists) {
        setValue('district', '');
      }
    } else {
      setDistricts([]);
    }
  }, [selectedDivision, setValue, watch]);

  useEffect(() => {
    if (nidOrIdDoc && nidOrIdDoc.length > 0) {
      const file = nidOrIdDoc[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setNidDocumentPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [nidOrIdDoc]);

  const saveDraft = (data: Partial<FormData>) => {
    setIsSavingDraft(true);
    try {
      localStorage.setItem('problem-solver-draft', JSON.stringify(data));
      toast.success('Draft saved successfully!');
    } catch {
      toast.error('Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const scrollToField = (fieldName: string, step: number) => {
    // Navigate to the correct step first
    setCurrentStep(step);

    // Wait for the step to render, then scroll to the field
    setTimeout(() => {
      const element = document.getElementById(fieldName);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();

        // Add a highlight animation
        element.classList.add('ring-2', 'ring-red-500', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2');
        }, 3000);
      }
    }, 100);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Validate required fields and redirect to first missing field
      if (!data.fullName) {
        toast.error('Please enter your full name');
        scrollToField('fullName', 1);
        setIsSubmitting(false);
        return;
      }
      if (!data.phone) {
        toast.error('Phone number is required');
        scrollToField('phone', 1);
        setIsSubmitting(false);
        return;
      }
      if (!data.dateOfBirth) {
        toast.error('Please select your date of birth');
        scrollToField('dateOfBirth', 1);
        setIsSubmitting(false);
        return;
      }
      if (!data.gender) {
        toast.error('Please select your gender');
        scrollToField('gender', 1);
        setIsSubmitting(false);
        return;
      }
      if (!data.division) {
        toast.error('Please select your division');
        scrollToField('division', 1);
        setIsSubmitting(false);
        return;
      }
      if (!data.district) {
        toast.error('Please select your district');
        scrollToField('district', 1);
        setIsSubmitting(false);
        return;
      }
      if (!data.address) {
        toast.error('Please enter your address');
        scrollToField('address', 1);
        setIsSubmitting(false);
        return;
      }
      if (!data.profession) {
        toast.error('Please select or enter your profession');
        scrollToField('professionSelect', 1);
        setIsSubmitting(false);
        return;
      }
      if (!data.nidNumber) {
        toast.error('Please enter your NID number');
        scrollToField('nidNumber', 1);
        setIsSubmitting(false);
        return;
      }
      if (!data.emergencyContactName) {
        toast.error('Please enter emergency contact name');
        scrollToField('emergencyContactName', 1);
        setIsSubmitting(false);
        return;
      }
      if (!data.emergencyContact) {
        toast.error('Please enter emergency contact number');
        scrollToField('emergencyContact', 1);
        setIsSubmitting(false);
        return;
      }
      if (!data.emergencyContactRelation) {
        toast.error('Please select emergency contact relation');
        scrollToField('emergencyContactRelation', 1);
        setIsSubmitting(false);
        return;
      }
      if (!data.skills || data.skills.length === 0) {
        toast.error('Please select at least one skill');
        scrollToField('skills', 2);
        setIsSubmitting(false);
        return;
      }
      if (!data.motivation) {
        toast.error('Please enter your motivation (minimum 50 characters)');
        scrollToField('motivation', 2);
        setIsSubmitting(false);
        return;
      }
      if (!data.languagesSpoken || data.languagesSpoken.length === 0) {
        toast.error('Please select at least one language you can speak');
        scrollToField('languagesSpoken', 2);
        setIsSubmitting(false);
        return;
      }
      if (!data.linkedinProfile) {
        toast.error('LinkedIn profile is required');
        scrollToField('linkedinProfile', 2);
        setIsSubmitting(false);
        return;
      }
      if (!data.nidOrIdDoc || data.nidOrIdDoc.length === 0) {
        toast.error('Please upload your NID and important documents');
        scrollToField('nidOrIdDoc', 2);
        setIsSubmitting(false);
        return;
      }
      if (!data.agree) {
        toast.error('Please agree to the terms and conditions');
        scrollToField('agree', 2);
        setIsSubmitting(false);
        return;
      }

      // Convert file to base64
      let nidDocBase64 = null;
      try {
        nidDocBase64 = await fileToBase64(data.nidOrIdDoc[0]);
      } catch {
        toast.error('Failed to process document. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Prepare the data for API submission
      const submissionData = {
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        division: data.division,
        district: data.district,
        address: data.address.trim(),
        profession: data.profession.trim(),
        organization: data.organization?.trim() || null,
        skills: Array.isArray(data.skills) ? data.skills.map(skill => skill.value) : [],
        motivation: data.motivation.trim(),
        experience: data.experience?.trim() || null,
        nidOrIdDoc: nidDocBase64,
        nidNumber: data.nidNumber.trim(),
        emergencyContact: data.emergencyContact.trim(),
        emergencyContactName: data.emergencyContactName.trim(),
        emergencyContactRelation: data.emergencyContactRelation,
        educationLevel: data.educationLevel?.trim() || null,
        availability: data.availability || null,
        languagesSpoken: Array.isArray(data.languagesSpoken) ? data.languagesSpoken.map(lang => lang.value) : [],
        previousVolunteerWork: data.previousVolunteerWork?.trim() || null,
        linkedinProfile: data.linkedinProfile.trim(),
        facebookProfile: data.facebookProfile?.trim() || null,
        twitterProfile: data.twitterProfile?.trim() || null,
        websiteProfile: data.websiteProfile?.trim() || null,
      };

      // Debug log to check data
      // console.log('Submission Data:', submissionData);
      // console.log('Skills:', submissionData.skills);
      // console.log('Languages:', submissionData.languagesSpoken);

      // Clear draft
      localStorage.removeItem('problem-solver-draft');

      toast.success('Application submitted successfully! Your application is pending review by authorities.');

      // Reset form
      reset();

      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/user');
      }, 2500);

    } catch (error: unknown) {
      console.error('Submission error:', error);

      // Better error messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.includes('required fields')) {
        toast.error('Please fill in all required fields correctly');
      } else if (errorMessage.includes('already have an application')) {
        toast.error(errorMessage);
      } else if (errorMessage.includes('language')) {
        toast.error('Please select at least one language');
      } else if (errorMessage.includes('skill')) {
        toast.error('Please select at least one skill');
      } else if (errorMessage.includes('LinkedIn')) {
        toast.error('Please provide a valid LinkedIn profile URL');
      } else {
        toast.error(errorMessage || 'Failed to submit application. Please try again.');
      }
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
    const isValid = await trigger(['fullName', 'phone', 'dateOfBirth', 'gender', 'division', 'district', 'address', 'profession', 'nidNumber', 'emergencyContact', 'emergencyContactName', 'emergencyContactRelation']);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => setCurrentStep(1);

  if (!userInfo) {
    return <FullPageLoading text="Loading your information..." />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-4 xs:py-6 sm:py-8 px-3 xs:px-4 sm:px-6 lg:px-8">
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
        {/* Header Card with Gradient */}
        <motion.div variants={itemVariants} className="text-center mb-4 xs:mb-6 sm:mb-8 relative">
          {/* Gradient Background */}
          <div className="h-28 xs:h-32 sm:h-36 md:h-40 bg-linear-to-r from-primary to-[#1e5d22] rounded-xl xs:rounded-2xl shadow-lg mb-4 xs:mb-5 sm:mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-pattern"></div>
            <div className="relative h-full flex flex-col items-center justify-center px-3 xs:px-4 sm:px-6">
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1 xs:mb-2 drop-shadow-lg">
                🔧 Become a Problem Solver
              </h1>
              <p className="text-green-100 font-semibold drop-shadow-md max-w-lg text-xs xs:text-sm sm:text-base">
                Help your community by verifying and resolving public infrastructure issues
              </p>
            </div>
          </div>

          {/* Enhanced Progress Indicator */}
          <div className="flex justify-center mb-4 xs:mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4 md:space-x-6 bg-white rounded-xl xs:rounded-2xl shadow-md px-3 xs:px-4 sm:px-6 md:px-8 py-2 xs:py-3 sm:py-4 border-2 border-primary/10">
              <div className={`flex items-center transition-all duration-300 ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 xs:border-3 font-bold flex items-center justify-center text-xs xs:text-sm transition-all duration-300 ${currentStep >= 1 ? 'border-primary bg-primary text-white shadow-lg' : 'border-gray-300 text-gray-400'}`}>
                  {currentStep >= 1 ? '✓' : '1'}
                </div>
                <span className={`ml-1.5 xs:ml-2 sm:ml-3 font-bold text-[10px] xs:text-xs sm:text-sm hidden xs:inline ${currentStep >= 1 ? 'text-primary' : 'text-gray-500'}`}>Personal Info</span>
              </div>
              <div className={`w-6 xs:w-8 sm:w-12 md:w-16 h-0.5 xs:h-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center transition-all duration-300 ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 xs:border-3 font-bold flex items-center justify-center text-xs xs:text-sm transition-all duration-300 ${currentStep >= 2 ? 'border-primary bg-primary text-white shadow-lg' : 'border-gray-300 text-gray-400'}`}>
                  2
                </div>
                <span className={`ml-1.5 xs:ml-2 sm:ml-3 font-bold text-[10px] xs:text-xs sm:text-sm hidden xs:inline ${currentStep >= 2 ? 'text-primary' : 'text-gray-500'}`}>Skills & Background</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl xs:rounded-2xl shadow-xl p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 border-t-4 border-primary"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 xs:space-y-5 sm:space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8"
                >
                  <div className="flex items-center gap-2 xs:gap-3 pb-3 xs:pb-4 sm:pb-5 md:pb-6 border-b-2 border-primary/20">
                    <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-base xs:text-lg sm:text-xl">
                      👤
                    </div>
                    <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E]">Personal Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                    {/* Full Name */}
                    <div className="space-y-1.5 xs:space-y-2">
                      <label htmlFor="fullName" className="flex items-center text-xs xs:text-sm font-bold text-[#002E2E] mb-2 xs:mb-3">
                        <FaUser className="w-4 h-4 xs:w-5 xs:h-5 mr-1.5 xs:mr-2 text-blue-500" />
                        Full Name (as per NID/Birth Certificate)
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
                        className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium text-sm xs:text-base"
                        placeholder="Enter your full name exactly as it appears on your NID"
                      />
                      <div className="flex items-start gap-1.5 xs:gap-2 p-2 xs:p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                        <span className="text-blue-600 font-bold text-sm xs:text-base sm:text-lg">ℹ️</span>
                        <p className="text-[10px] xs:text-xs text-blue-700 font-semibold">Your name must match your NID document exactly for verification</p>
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-sm font-bold flex items-center gap-1">⚠️ {errors.fullName.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5 xs:space-y-2">
                      <label htmlFor="email" className="flex items-center text-xs xs:text-sm font-bold text-[#002E2E] mb-2 xs:mb-3">
                        <FaEnvelope className="w-4 h-4 xs:w-5 xs:h-5 mr-1.5 xs:mr-2 text-amber-500" />
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={userInfo.email}
                        readOnly
                        {...register('email', { required: true })}
                        className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed font-medium text-gray-700 text-sm xs:text-base"
                      />
                      <p className="text-[10px] xs:text-xs text-gray-600 font-semibold">🔒 Email is locked to your account for security</p>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5 xs:space-y-2">
                      <label htmlFor="phone" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                        <FaPhone className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                        Phone Number <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        readOnly
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^01[0-9]{9}$/,
                            message: 'Phone number must be 11 digits starting with 01',
                          },
                        })}
                        className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm xs:text-base"
                        placeholder="01XXXXXXXXX"
                      />
                      <p className="text-[10px] xs:text-xs text-gray-500">Phone number cannot be changed</p>
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1.5 xs:space-y-2">
                      <label htmlFor="dateOfBirth" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                        <FaCalendar className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                        Date of Birth <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        id="dateOfBirth"
                        type="date"
                        {...register('dateOfBirth', {
                          required: 'Date of birth is required',
                        })}
                        className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
                      />
                      {errors.dateOfBirth && (
                        <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5 xs:space-y-2">
                      <label htmlFor="gender" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                        <FaTransgender className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                        Gender <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        id="gender"
                        {...register('gender', { required: 'Gender is required' })}
                        className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
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
                    <div className="space-y-1.5 xs:space-y-2">
                      <label htmlFor="profession" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                        <FaUserTie className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                        Profession <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        id="professionSelect"
                        aria-label="Select Profession"
                        value={professionType}
                        onChange={(e) => {
                          const value = e.target.value;
                          setProfessionType(value);
                          if (value !== 'other') {
                            setValue('profession', value, { shouldValidate: true });
                            setCustomProfession('');
                          } else {
                            setValue('profession', customProfession, { shouldValidate: true });
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors"
                      >
                        {professionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      {professionType === 'other' && (
                        <input
                          id="professionCustom"
                          type="text"
                          value={customProfession}
                          onChange={(e) => {
                            setCustomProfession(e.target.value);
                            setValue('profession', e.target.value, { shouldValidate: true });
                          }}
                          className="outline-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors mt-2"
                          placeholder="Enter your profession"
                          required
                        />
                      )}

                      <input
                        type="hidden"
                        {...register('profession', {
                          required: 'Profession is required',
                        })}
                        value={professionType === 'other' ? customProfession : professionType}
                      />

                      {errors.profession && (
                        <p className="text-red-500 text-sm">{errors.profession.message}</p>
                      )}
                    </div>

                    {/* NID Number */}
                    <div className="lg:col-span-2 space-y-2">
                      <label htmlFor="nidNumber" className="flex items-center text-sm font-medium text-gray-700">
                        <FaIdCard className="w-4 h-4 mr-2 text-[#2a7d2f]" />
                        National ID (NID) Number <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        id="nidNumber"
                        type="text"
                        {...register('nidNumber', {
                          required: 'NID number is required',
                          pattern: {
                            value: /^[0-9]{10}$|^[0-9]{13}$|^[0-9]{17}$/,
                            message: 'NID must be 10, 13, or 17 digits',
                          },
                        })}
                        className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
                        placeholder="Enter your 10/13/17 digit NID number"
                        maxLength={17}
                      />
                      <p className="text-[10px] xs:text-xs text-gray-500">Enter your National ID number (10, 13, or 17 digits)</p>
                      {errors.nidNumber && (
                        <p className="text-red-500 text-sm">{errors.nidNumber.message}</p>
                      )}
                    </div>

                    {/* Division & District in one row */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                      {/* Division */}
                      <div className="space-y-1.5 xs:space-y-2">
                        <label htmlFor="division" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                          <FaMapMarkerAlt className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                          Division <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          id="division"
                          {...register('division', { required: 'Division is required' })}
                          className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
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
                      <div className="space-y-1.5 xs:space-y-2">
                        <label htmlFor="district" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                          <FaMapMarkerAlt className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                          District <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          id="district"
                          {...register('district', { required: 'District is required' })}
                          disabled={!selectedDivision}
                          className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-sm xs:text-base"
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
                    <div className="md:col-span-2 space-y-1.5 xs:space-y-2">
                      <label htmlFor="address" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                        <FaHome className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                        Full Address <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        id="address"
                        type="text"
                        {...register('address', {
                          required: 'Address is required',
                        })}
                        className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
                        placeholder="Enter your complete address with area, road, and house details"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm">{errors.address.message}</p>
                      )}
                    </div>

                    {/* Emergency Contact Section */}
                    <div className="md:col-span-2">
                      <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-2 xs:mb-3 mt-2 xs:mt-3 sm:mt-4">Emergency Contact Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
                        <div className="space-y-1.5 xs:space-y-2">
                          <label htmlFor="emergencyContactName" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                            <FaUser className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                            Contact Name <span className="text-red-500 ml-1">*</span>
                          </label>
                          <input
                            id="emergencyContactName"
                            type="text"
                            {...register('emergencyContactName', {
                              required: 'Emergency contact name is required',
                            })}
                            className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
                            placeholder="Full name"
                          />
                          {errors.emergencyContactName && (
                            <p className="text-red-500 text-sm">{errors.emergencyContactName.message}</p>
                          )}
                        </div>

                        <div className="space-y-1.5 xs:space-y-2">
                          <label htmlFor="emergencyContact" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                            <FaPhone className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                            Contact Number <span className="text-red-500 ml-1">*</span>
                          </label>
                          <input
                            id="emergencyContact"
                            type="tel"
                            {...register('emergencyContact', {
                              required: 'Emergency contact number is required',
                              pattern: {
                                value: /^01[0-9]{9}$/,
                                message: 'Must be 11 digits starting with 01',
                              },
                            })}
                            className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
                            placeholder="01XXXXXXXXX"
                            maxLength={11}
                          />
                          {errors.emergencyContact && (
                            <p className="text-red-500 text-sm">{errors.emergencyContact.message}</p>
                          )}
                        </div>

                        <div className="space-y-1.5 xs:space-y-2">
                          <label htmlFor="emergencyContactRelation" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                            <FaUserTie className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                            Relation <span className="text-red-500 ml-1">*</span>
                          </label>
                          <select
                            id="emergencyContactRelation"
                            {...register('emergencyContactRelation', {
                              required: 'Relation is required',
                            })}
                            className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
                          >
                            {relationOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors.emergencyContactRelation && (
                            <p className="text-red-500 text-sm">{errors.emergencyContactRelation.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step Navigation */}
                  <div className="flex justify-end pt-4 xs:pt-5 sm:pt-6 md:pt-8 mt-4 xs:mt-5 sm:mt-6 md:mt-8 border-t-2 border-gray-200">
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStep1Valid()}
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      className="bg-linear-to-r from-primary to-[#1e5d22] text-white font-bold py-2 xs:py-2.5 sm:py-3 px-4 xs:px-6 sm:px-8 rounded-lg xs:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5 xs:space-x-2 transition-all hover:shadow-lg transform hover:scale-105 text-sm xs:text-base w-full xs:w-auto justify-center"
                    >
                      <span>Continue to Skills</span>
                      <FaArrowRight className="w-4 h-4 xs:w-5 xs:h-5" />
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
                  className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8"
                >
                  <div className="flex items-center gap-2 xs:gap-3 pb-3 xs:pb-4 sm:pb-5 md:pb-6 border-b-2 border-primary/20">
                    <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-linear-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-base xs:text-lg sm:text-xl">
                      🎯
                    </div>
                    <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E]">Skills & Background</h2>
                  </div>

                  {/* Additional Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                    {/* Organization */}
                    <div className="space-y-1.5 xs:space-y-2">
                      <label htmlFor="organization" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                        <FaBuilding className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                        Organization (Optional)
                      </label>
                      <input
                        id="organization"
                        type="text"
                        {...register('organization')}
                        className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
                        placeholder="e.g., NGO, Company, Institution"
                      />
                    </div>

                    {/* Education Level */}
                    <div className="space-y-1.5 xs:space-y-2">
                      <label htmlFor="educationLevel" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                        <FaFileAlt className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                        Education Level
                      </label>
                      <select
                        id="educationLevelSelect"
                        aria-label="Select Education Level"
                        value={educationLevelType}
                        onChange={(e) => {
                          const value = e.target.value;
                          setEducationLevelType(value);
                          if (value !== 'Other') {
                            setValue('educationLevel', value, { shouldValidate: true });
                            setCustomEducationLevel('');
                          } else {
                            setValue('educationLevel', customEducationLevel, { shouldValidate: true });
                          }
                        }}
                        className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
                      >
                        {educationLevelOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      {educationLevelType === 'Other' && (
                        <input
                          id="educationLevelCustom"
                          type="text"
                          value={customEducationLevel}
                          onChange={(e) => {
                            setCustomEducationLevel(e.target.value);
                            setValue('educationLevel', e.target.value, { shouldValidate: true });
                          }}
                          className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors mt-2 text-sm xs:text-base"
                          placeholder="Enter your education level"
                        />
                      )}

                      <input
                        type="hidden"
                        {...register('educationLevel')}
                        value={educationLevelType === 'Other' ? customEducationLevel : educationLevelType}
                      />
                    </div>

                    {/* Availability */}
                    <div className="space-y-1.5 xs:space-y-2">
                      <label htmlFor="availability" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                        <FaCalendar className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                        Availability
                      </label>
                      <select
                        id="availability"
                        {...register('availability')}
                        className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
                      >
                        {availabilityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Languages Spoken */}
                    <div className="md:col-span-2 space-y-1.5 xs:space-y-2">
                      <label htmlFor="languagesSpoken" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                        <FaCode className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                        Languages Spoken <span className="text-red-500 ml-1">*</span>
                      </label>
                      <Controller
                        name="languagesSpoken"
                        control={control}
                        rules={{ required: 'At least one language is required' }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            isMulti
                            options={languageOptions}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Select languages you can speak..."
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
                      {errors.languagesSpoken && (
                        <p className="text-red-500 text-sm">{errors.languagesSpoken.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2 xs:space-y-3 bg-linear-to-r from-purple-50 to-indigo-50 p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg xs:rounded-xl border-2 border-purple-200">
                    <label htmlFor="skills" className="flex items-center text-xs xs:text-sm font-bold text-[#002E2E] mb-2 xs:mb-3">
                      <FaCode className="w-4 h-4 xs:w-5 xs:h-5 mr-1.5 xs:mr-2 text-purple-600" />
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
                              border: '2px solid #D1D5DB',
                              borderRadius: '0.75rem',
                              padding: '0.5rem',
                              backgroundColor: '#fff',
                              '&:hover': {
                                borderColor: '#a855f7',
                              },
                              '&:focus': {
                                borderColor: '#a855f7',
                              },
                            }),
                          }}
                        />
                      )}
                    />
                    {errors.skills && (
                      <p className="text-red-500 text-sm font-bold flex items-center gap-1">⚠️ {errors.skills.message}</p>
                    )}
                  </div>

                  {/* Motivation */}
                  <div className="space-y-2 xs:space-y-3 bg-linear-to-r from-blue-50 to-cyan-50 p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg xs:rounded-xl border-2 border-blue-200">
                    <label htmlFor="motivation" className="flex items-center text-xs xs:text-sm font-bold text-[#002E2E] mb-2 xs:mb-3">
                      <FaPaperPlane className="w-4 h-4 xs:w-5 xs:h-5 mr-1.5 xs:mr-2 text-blue-600" />
                      Why Do You Want to Join? <span className="text-red-500 ml-1">*</span>
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
                      className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none font-medium text-sm xs:text-base"
                      placeholder="Share your motivation and passion for community development..."
                    />
                    {errors.motivation && (
                      <p className="text-red-500 text-sm font-bold flex items-center gap-1">⚠️ {errors.motivation.message}</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="space-y-1.5 xs:space-y-2">
                    <label htmlFor="experience" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                      <FaFileAlt className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                      Relevant Work Experience (Optional)
                    </label>
                    <textarea
                      id="experience"
                      rows={3}
                      {...register('experience')}
                      className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors resize-none text-sm xs:text-base"
                      placeholder="Describe any relevant work experience..."
                    />
                  </div>

                  {/* Previous Volunteer Work */}
                  <div className="space-y-1.5 xs:space-y-2">
                    <label htmlFor="previousVolunteerWork" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                      <FaCheck className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                      Previous Volunteer Work (Optional)
                    </label>
                    <textarea
                      id="previousVolunteerWork"
                      rows={3}
                      {...register('previousVolunteerWork')}
                      className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors resize-none text-sm xs:text-base"
                      placeholder="Describe any previous volunteer work or community service..."
                    />
                  </div>

                  {/* Social Media Links */}
                  <div className="space-y-3 xs:space-y-4 bg-linear-to-r from-indigo-50 to-purple-50 p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg xs:rounded-xl border-2 border-indigo-200">
                    <div className="flex items-center gap-2 xs:gap-3">
                      <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-indigo-200 rounded-full flex items-center justify-center text-sm xs:text-base sm:text-lg">🔗</div>
                      <h3 className="text-base xs:text-lg font-bold text-[#002E2E]">Social & Professional Links</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                      {/* LinkedIn - Required */}
                      <div className="space-y-1.5 xs:space-y-2">
                        <label htmlFor="linkedinProfile" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                          <FaCode className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                          LinkedIn Profile <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          id="linkedinProfile"
                          type="url"
                          {...register('linkedinProfile', {
                            required: 'LinkedIn profile is required',
                            pattern: {
                              value: /^https?:\/\/(www\.)?linkedin\.com\/.+$/,
                              message: 'Please enter a valid LinkedIn URL',
                            },
                          })}
                          className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
                          placeholder="https://linkedin.com/in/your-profile"
                        />
                        {errors.linkedinProfile && (
                          <p className="text-red-500 text-sm">{errors.linkedinProfile.message}</p>
                        )}
                      </div>

                      {/* Facebook - Optional */}
                      <div className="space-y-1.5 xs:space-y-2">
                        <label htmlFor="facebookProfile" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                          <FaCode className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                          Facebook Profile (Optional)
                        </label>
                        <input
                          id="facebookProfile"
                          type="url"
                          {...register('facebookProfile')}
                          className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
                          placeholder="https://facebook.com/your-profile"
                        />
                      </div>

                      {/* Twitter - Optional */}
                      <div className="space-y-1.5 xs:space-y-2">
                        <label htmlFor="twitterProfile" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                          <FaCode className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                          Twitter/X Profile (Optional)
                        </label>
                        <input
                          id="twitterProfile"
                          type="url"
                          {...register('twitterProfile')}
                          className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
                          placeholder="https://twitter.com/your-profile"
                        />
                      </div>

                      {/* Website - Optional */}
                      <div className="space-y-1.5 xs:space-y-2">
                        <label htmlFor="websiteProfile" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                          <FaCode className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                          Personal Website (Optional)
                        </label>
                        <input
                          id="websiteProfile"
                          type="url"
                          {...register('websiteProfile')}
                          className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors text-sm xs:text-base"
                          placeholder="https://your-website.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div className="space-y-3 xs:space-y-4 bg-linear-to-r from-amber-50 to-orange-50 p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg xs:rounded-xl border-2 border-amber-200">
                    <div className="flex items-center gap-2 xs:gap-3">
                      <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-amber-200 rounded-full flex items-center justify-center text-sm xs:text-base sm:text-lg">📄</div>
                      <h3 className="text-base xs:text-lg font-bold text-[#002E2E]">Required Documents</h3>
                    </div>
                    <div className="space-y-1.5 xs:space-y-2">
                      <label htmlFor="nidOrIdDoc" className="flex items-center text-xs xs:text-sm font-medium text-gray-700">
                        <FaIdCard className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2 text-[#2a7d2f]" />
                        NID & Important Documents <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="p-2 xs:p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg mb-2">
                        <p className="text-[10px] xs:text-xs sm:text-sm text-blue-800">
                          <strong>Required:</strong> Please upload a clear copy of your National ID Card and any other relevant identification documents (e.g., Birth Certificate, Passport). You can upload multiple pages as a single PDF file or multiple image files.
                        </p>
                      </div>
                      <input
                        id="nidOrIdDoc"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        {...register('nidOrIdDoc', {
                          required: 'NID and identification documents are required',
                        })}
                        className="outline-none w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition-colors file:mr-2 xs:file:mr-4 file:py-1 xs:file:py-2 file:px-2 xs:file:px-4 file:rounded-full file:border-0 file:text-[10px] xs:file:text-xs sm:file:text-sm file:font-semibold file:bg-[#2a7d2f] file:text-white hover:file:bg-[#236b27] text-xs xs:text-sm sm:text-base"
                      />
                      {errors.nidOrIdDoc && (
                        <p className="text-red-500 text-sm">{errors.nidOrIdDoc.message}</p>
                      )}

                      {/* Document Preview */}
                      {nidDocumentPreview && (
                        <div className="mt-3 xs:mt-4 p-2 xs:p-3 sm:p-4 border border-gray-300 rounded-lg bg-gray-50">
                          <p className="text-xs xs:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2">Document Preview:</p>
                          {nidOrIdDoc?.[0]?.type === 'application/pdf' ? (
                            <div className="flex items-center space-x-1.5 xs:space-x-2 text-gray-600">
                              <FaFileAlt className="w-5 h-5 xs:w-6 xs:h-6 text-red-500" />
                              <span className="text-xs xs:text-sm truncate">{nidOrIdDoc[0].name}</span>
                            </div>
                          ) : (
                            <div className="relative w-full max-h-48 xs:max-h-56 sm:max-h-64">
                              <Image
                                src={nidDocumentPreview}
                                alt="Document preview"
                                width={400}
                                height={300}
                                className="max-w-full h-auto max-h-48 xs:max-h-56 sm:max-h-64 object-contain border-2 border-[#2a7d2f] rounded-lg"
                                unoptimized
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Agreement */}
                  <div className="bg-linear-to-r from-green-50 to-emerald-50 p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg xs:rounded-xl border-2 border-green-200 space-y-3 xs:space-y-4">
                    <div className="flex items-start space-x-2 xs:space-x-3">
                      <input
                        id="agree"
                        type="checkbox"
                        {...register('agree', {
                          required: 'You must agree to the terms and conditions',
                        })}
                        className="outline-none mt-0.5 xs:mt-1 w-4 h-4 xs:w-5 xs:h-5 text-primary bg-white border-2 border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
                      />
                      <label htmlFor="agree" className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[#002E2E] cursor-pointer leading-relaxed">
                        ✅ I confirm that all information provided is accurate and truthful. I understand that my application will be reviewed by authorities and I may be contacted for verification. I agree to the terms and conditions.
                      </label>
                    </div>
                    {errors.agree && (
                      <p className="text-red-500 text-sm font-bold flex items-center gap-1">⚠️ {errors.agree.message}</p>
                    )}
                  </div>

                  {/* Step Navigation */}
                  <div className="flex flex-col xs:flex-row justify-between pt-4 xs:pt-5 sm:pt-6 md:pt-8 mt-4 xs:mt-5 sm:mt-6 md:mt-8 border-t-2 border-gray-200 gap-3 xs:gap-4">
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      className="bg-linear-to-r from-gray-400 to-gray-500 text-white font-bold py-2 xs:py-2.5 sm:py-3 px-4 xs:px-6 sm:px-8 rounded-lg xs:rounded-xl flex items-center justify-center space-x-1.5 xs:space-x-2 transition-all hover:shadow-lg transform hover:scale-105 text-sm xs:text-base order-2 xs:order-1"
                    >
                      <span>← Back to Info</span>
                    </motion.button>

                    <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-3 sm:space-x-4 order-1 xs:order-2">
                      <Button
                        type="button"
                        onClick={onSaveDraft}
                        variant="ghost"
                        size="lg"
                        isLoading={isSavingDraft}
                      >
                        Save Draft
                      </Button>

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        iconPosition="right"
                        disabled={!isValid}
                        isLoading={isSubmitting}
                      >
                        Submit Application
                      </Button>
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