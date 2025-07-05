"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
//   Edit3, 
  Clock,
  CheckCircle,
  Package
} from 'lucide-react';
import { createClient } from '@/lib/client';
import { useRouter } from 'next/navigation';
import { Header } from '../Header';

// Types based on actual students database structure
interface StudentProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  training_package: 'basic' | 'standard' | 'premium';
  preferred_time_slots: string[];
  has_license_theory: boolean;
  emergency_contact: string;
  emergency_phone: string;
  terms_accepted: boolean;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
  updated_at: string;
}

const ProfileView: React.FC = () => {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'training' | 'emergency'>('overview');
  const [age, setAge] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const supabase = createClient();
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }

        // Fetch student data
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (studentError) {
          if (studentError.code === 'PGRST116') {
            // No student record found, redirect to onboarding
            router.push('/student/onboardingForm');
            return;
          }
          throw new Error(studentError.message);
        }

        setStudent(studentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [router]);

  useEffect(() => {
    if (student) {
      const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age;
      };
      setAge(calculateAge(student.date_of_birth));
    }
  }, [student]);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </motion.div>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const getPackageInfo = (packageType: string) => {
    const packages = {
      basic: { name: 'Basic Package', price: '₦150,000', color: 'bg-blue-500' },
      standard: { name: 'Standard Package', price: '₦250,000', color: 'bg-purple-500' },
      premium: { name: 'Premium Package', price: '₦350,000', color: 'bg-pink-500' }
    };
    return packages[packageType as keyof typeof packages] || packages.basic;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/auth/login')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  const packageInfo = getPackageInfo(student.training_package);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="pb-20">
          <Header />
        </div>
      <div className="absolute top-0 z-[0] h-screen w-full bg-purple-950/10 dark:bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-sm overflow-x-hidden rounded-2xl shadow-lg border border-gray-100 p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-24 h-24 rounded-full border-4 border-purple-100 shadow-lg overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-12 w-12 text-purple-600" />
                </div>
              </div>
            </motion.div>
            
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{student.first_name} {student.last_name}</h1>
              <p className="text-gray-600 mb-4">Student at DriverPro</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Age {age !== null ? age : ''}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Joined {formatDate(student.created_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Package className="h-4 w-4" />
                  <span>{packageInfo.name}</span>
                </div>
              </div>
            </div>
            
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md"
            >
              <Edit3 className="h-5 w-5" />
            </motion.button> */}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <StatCard
            icon={<Package className="h-6 w-6 text-white" />}
            label="Training Package"
            value={packageInfo.name}
            color="bg-purple-500"
          />
          <StatCard
            icon={<CheckCircle className="h-6 w-6 text-white" />}
            label="Status"
            value={student.status.charAt(0).toUpperCase() + student.status.slice(1)}
            color="bg-green-500"
          />
          <StatCard
            icon={<Clock className="h-6 w-6 text-white" />}
            label="Member Since"
            value={formatDate(student.created_at)}
            color="bg-pink-500"
          />
        </motion.div>

        {/* Content Tabs */}
        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8 py-4">
              {(['overview', 'training', 'emergency'] as const).map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                    activeTab === tab
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-600">{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-600">{student.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-600">{student.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-600">Date of Birth: {formatDate(student.date_of_birth)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-600">
                            License Theory: {student.has_license_theory ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Package className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-600">Package: {packageInfo.name} - {packageInfo.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'training' && (
                <motion.div
                  key="training"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Training Details</h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Training Package</h4>
                      <p className="text-gray-600">{packageInfo.name} - {packageInfo.price}</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Preferred Time Slots</h4>
                      <div className="flex flex-wrap gap-2">
                        {student.preferred_time_slots.map((slot, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'emergency' && (
                <motion.div
                  key="emergency"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-red-400" />
                        <span className="text-gray-600">{student.emergency_contact}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-red-400" />
                        <span className="text-gray-600">{student.emergency_phone}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileView;