import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CourseContext';
import { Award, Download, Calendar, User } from 'lucide-react';

const CertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const { enrolledCourses } = useCourses();

  const completedCourses = enrolledCourses.filter(course => course.progress === 100);

  const generateCertificateId = (courseId: string) => {
    return `CERT-${courseId.toUpperCase()}-${Date.now().toString().slice(-6)}`;
  };

  const downloadCertificate = (course: any) => {
    // In a real app, this would generate and download a PDF certificate
    alert(`Certificate for "${course.title}" would be downloaded as PDF`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-600 mt-2">Your achievements and completed courses</p>
        </div>

        {/* Certificates Grid */}
        {completedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Award className="h-8 w-8" />
                    <span className="text-sm font-mono opacity-75">
                      {generateCertificateId(course.id)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Certificate of Completion</h3>
                  <p className="text-blue-100">LearnHub Online Learning Platform</p>
                </div>
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-gray-600 mb-2">This is to certify that</p>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h4>
                    <p className="text-gray-600 mb-4">has successfully completed the course</p>
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">"{course.title}"</h5>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-1">
                        <User className="h-4 w-4" />
                        <span>Instructor</span>
                      </div>
                      <p className="font-medium text-gray-900">{course.instructor}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-1">
                        <Calendar className="h-4 w-4" />
                        <span>Completed</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Duration: {course.duration}
                    </div>
                    <button
                      onClick={() => downloadCertificate(course)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-8 mx-auto w-fit mb-6">
              <Award className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
            <p className="text-gray-600 mb-6">
              Complete your enrolled courses to earn certificates
            </p>
            <a
              href="/courses"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </a>
          </div>
        )}

        {/* Certificate Benefits */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About Your Certificates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 mx-auto w-fit mb-3">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Verified Achievement</h4>
              <p className="text-sm text-gray-600">
                Each certificate is digitally verified and contains a unique ID
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 mx-auto w-fit mb-3">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Professional Format</h4>
              <p className="text-sm text-gray-600">
                Download as PDF for your portfolio or LinkedIn profile
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 mx-auto w-fit mb-3">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Industry Recognition</h4>
              <p className="text-sm text-gray-600">
                Recognized by leading companies and educational institutions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;