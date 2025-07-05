"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Car, User, Phone, Clock, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/client';
import { useRouter } from 'next/navigation';

// Zod validation schema
const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[\d\s-()]{10,}$/, 'Please enter a valid phone number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(10, 'Please enter your complete address'),
  trainingPackage: z.enum(['basic', 'standard', 'premium'], {
    errorMap: () => ({ message: 'Please select a training package' })
  }),
  preferredTimeSlots: z.array(z.string()).min(1, 'Please select at least one time slot'),
  hasLicenseTheory: z.boolean(),
  emergencyContact: z.string().min(2, 'Emergency contact name is required'),
  emergencyPhone: z.string().regex(/^\+?[\d\s-()]{10,}$/, 'Please enter a valid emergency contact number'),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
});

type FormData = z.infer<typeof registrationSchema>;

const StudentRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    trainingPackage: 'basic' as const,
    preferredTimeSlots: [],
    hasLicenseTheory: false,
    emergencyContact: '',
    emergencyPhone: '',
    terms: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }
      
      setUser(user);
      
      // Check if user has already registered as a student
      const { data: existingStudent } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingStudent) {
        // User has already registered, redirect to student page
        router.push('/student');
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const trainingPackages = [
    {
      id: 'basic',
      name: 'Basic Package',
      price: '₦150,000',
      features: ['10 Hours Theory', '15 Hours Practical', 'Road Test Prep'],
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard Package',
      price: '₦250,000',
      features: ['15 Hours Theory', '25 Hours Practical', 'Mock Tests', 'Highway Training'],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium Package',
      price: '₦350,000',
      features: ['20 Hours Theory', '35 Hours Practical', 'Defensive Driving', 'Night Driving', 'Unlimited Mock Tests'],
      popular: false
    }
  ];

  const timeSlots = [
    'Morning (8AM - 12PM)',
    'Afternoon (12PM - 4PM)',
    'Evening (4PM - 8PM)',
    'Weekend Morning (8AM - 12PM)',
    'Weekend Afternoon (12PM - 4PM)'
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTimeSlotChange = (slot: string) => {
    const updatedSlots = formData.preferredTimeSlots.includes(slot)
      ? formData.preferredTimeSlots.filter(s => s !== slot)
      : [...formData.preferredTimeSlots, slot];
    handleInputChange('preferredTimeSlots', updatedSlots);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate form data
      registrationSchema.parse(formData);
      
      const supabase = createClient();
      
      // Check if user is authenticated
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Check if student already exists
      const { data: existingStudent } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', currentUser.id)
        .single();

      if (existingStudent) {
        throw new Error('You have already registered as a student');
      }

      // Insert student data
      const { data, error } = await supabase
        .from('students')
        .insert([
          {
            user_id: currentUser.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            date_of_birth: formData.dateOfBirth,
            address: formData.address,
            training_package: formData.trainingPackage,
            preferred_time_slots: formData.preferredTimeSlots,
            has_license_theory: formData.hasLicenseTheory,
            emergency_contact: formData.emergencyContact,
            emergency_phone: formData.emergencyPhone,
            terms_accepted: formData.terms,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to save registration');
      }

      setIsSubmitted(true);
      console.log('Registration saved successfully:', data);
      
      // Redirect to student page after a short delay
      setTimeout(() => {
        router.push('/student');
      }, 2000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Registration error:', error);
        setErrors({ email: error instanceof Error ? error.message : 'An error occurred during registration' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-white flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering with our driving school. We&apos;ll contact you within 24 hours to schedule your first lesson.
          </p>
          <div className="text-sm text-gray-500">
            Redirecting to student dashboard...
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Car className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">DrivePro Academy</h1>
          </div>
          <p className="text-xl text-gray-600">Start Your Journey to Safe Driving</p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Student Registration</h2>
            <p className="text-purple-100">Fill out the form below to begin your driving education</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Personal Information */}
            <motion.section
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-800">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors bg-white ${
                      errors.firstName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } focus:outline-none`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors bg-white ${
                      errors.lastName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } focus:outline-none`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors bg-white ${
                      errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } focus:outline-none`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors bg-white ${
                      errors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } focus:outline-none`}
                    placeholder="+234 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors bg-white ${
                      errors.dateOfBirth ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } focus:outline-none`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors bg-white ${
                      errors.address ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } focus:outline-none`}
                    placeholder="Enter your complete address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </motion.section>

            {/* Training Package Selection */}
            <motion.section
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center mb-6">
                <Package className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-800">Training Package</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trainingPackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all bg-white ${
                      formData.trainingPackage === pkg.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => handleInputChange('trainingPackage', pkg.id)}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">{pkg.name}</h4>
                      <p className="text-3xl font-bold text-purple-600 mb-4">{pkg.price}</p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
              {errors.trainingPackage && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.trainingPackage}
                </p>
              )}
            </motion.section>

            {/* Time Preferences */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center mb-6">
                <Clock className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-800">Preferred Time Slots</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {timeSlots.map((slot) => (
                  <motion.div
                    key={slot}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all bg-white ${
                      formData.preferredTimeSlots.includes(slot)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => handleTimeSlotChange(slot)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        formData.preferredTimeSlots.includes(slot)
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.preferredTimeSlots.includes(slot) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-gray-800">{slot}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              {errors.preferredTimeSlots && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.preferredTimeSlots}
                </p>
              )}
            </motion.section>

            {/* Emergency Contact */}
            <motion.section
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <Phone className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-800">Emergency Contact</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors bg-white ${
                      errors.emergencyContact ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } focus:outline-none`}
                    placeholder="Emergency contact name"
                  />
                  {errors.emergencyContact && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.emergencyContact}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors bg-white ${
                      errors.emergencyPhone ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } focus:outline-none`}
                    placeholder="Emergency contact phone"
                  />
                  {errors.emergencyPhone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.emergencyPhone}
                    </p>
                  )}
                </div>
              </div>
            </motion.section>

            {/* Additional Information */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasLicenseTheory"
                    checked={formData.hasLicenseTheory}
                    onChange={(e) => handleInputChange('hasLicenseTheory', e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="hasLicenseTheory" className="ml-3 text-gray-700">
                    I already have a learner&apos;s permit or theoretical license
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="terms" className="ml-3 text-gray-700">
                    I agree to the <span className="text-purple-600 hover:underline cursor-pointer">Terms and Conditions</span> and <span className="text-purple-600 hover:underline cursor-pointer">Privacy Policy</span>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.terms}
                  </p>
                )}
              </div>
            </motion.section>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-8"
            >
              <motion.button
                type="button"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Processing Registration...
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;