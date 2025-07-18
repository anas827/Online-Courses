import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CourseContext';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Volume2, 
  FileText, 
  File,
  Award,
  ArrowLeft
} from 'lucide-react';

const LearningPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { enrolledCourses, updateProgress, completeLessson } = useCourses();
  const navigate = useNavigate();

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const course = enrolledCourses.find(c => c.id === courseId);

  useEffect(() => {
    if (!course) {
      navigate('/dashboard');
    }
  }, [course, navigate]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];

  const getAllLessons = () => {
    return course.modules.flatMap(module => 
      module.lessons.map(lesson => ({
        ...lesson,
        moduleId: module.id,
        moduleTitle: module.title
      }))
    );
  };

  const allLessons = getAllLessons();
  const currentLessonGlobalIndex = allLessons.findIndex(lesson => 
    lesson.id === currentLesson?.id
  );

  const completedLessons = allLessons.filter(lesson => lesson.completed).length;
  const totalLessons = allLessons.length;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  const goToNextLesson = () => {
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
    setIsPlaying(false);
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(course.modules[currentModuleIndex - 1].lessons.length - 1);
    }
    setIsPlaying(false);
  };

  const markLessonComplete = () => {
    if (currentModule && currentLesson) {
      completeLessson(course.id, currentModule.id, currentLesson.id);
      
      // Update overall progress
      const newCompletedCount = completedLessons + 1;
      const newProgress = Math.round((newCompletedCount / totalLessons) * 100);
      updateProgress(course.id, newProgress);

      // Show certificate if course is complete
      if (newProgress === 100) {
        setShowCertificate(true);
      }
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-5 w-5" />;
      case 'audio': return <Volume2 className="h-5 w-5" />;
      case 'pdf': return <File className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const renderLessonContent = () => {
    if (!currentLesson) return null;

    switch (currentLesson.type) {
      case 'video':
        return (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <div className="aspect-video flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <div className="bg-white/10 p-8 rounded-full mb-4 mx-auto w-fit">
                  {isPlaying ? (
                    <Pause className="h-16 w-16" />
                  ) : (
                    <Play className="h-16 w-16" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{currentLesson.title}</h3>
                <p className="text-gray-300 mb-4">Video lesson content</p>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isPlaying ? 'Pause' : 'Play'} Video
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white">
            <div className="text-center">
              <div className="bg-white/10 p-6 rounded-full mb-4 mx-auto w-fit">
                <Volume2 className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{currentLesson.title}</h3>
              <p className="text-purple-100 mb-4">Audio lesson content</p>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isPlaying ? 'Pause' : 'Play'} Audio
              </button>
            </div>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <div className="text-center">
              <div className="bg-red-100 p-6 rounded-full mb-4 mx-auto w-fit">
                <File className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{currentLesson.title}</h3>
              <p className="text-gray-600 mb-4">PDF document content</p>
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
                Download PDF
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold mb-4">{currentLesson.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {currentLesson.content || 'This is a text-based lesson. In a real implementation, this would contain the actual lesson content, formatted text, images, and interactive elements.'}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900">{course.title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {completedLessons} of {totalLessons} lessons completed
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900">{progressPercentage}%</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h2>
            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id} className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">{module.title}</h3>
                  </div>
                  <div className="p-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setCurrentModuleIndex(moduleIndex);
                          setCurrentLessonIndex(lessonIndex);
                          setIsPlaying(false);
                        }}
                        className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${
                          moduleIndex === currentModuleIndex && lessonIndex === currentLessonIndex
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {lesson.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <div className="text-gray-400">
                              {getContentIcon(lesson.type)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {lesson.title}
                          </p>
                          {lesson.duration && (
                            <p className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.duration} min
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Lesson Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentLesson?.title}</h2>
                  <p className="text-gray-600">{currentModule?.title}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Lesson {currentLessonGlobalIndex + 1} of {totalLessons}
                  </span>
                  {currentLesson?.duration && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{currentLesson.duration} min</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="mb-8">
              {renderLessonContent()}
            </div>

            {/* Navigation and Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousLesson}
                disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-4">
                {!currentLesson?.completed && (
                  <button
                    onClick={markLessonComplete}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Mark Complete</span>
                  </button>
                )}
                
                <button
                  onClick={goToNextLesson}
                  disabled={currentModuleIndex === course.modules.length - 1 && 
                           currentLessonIndex === currentModule.lessons.length - 1}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="bg-yellow-100 p-4 rounded-full mb-4 mx-auto w-fit">
                <Award className="h-12 w-12 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Congratulations!
              </h3>
              <p className="text-gray-600 mb-6">
                You have successfully completed "{course.title}". Your certificate is now available.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCertificate(false)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowCertificate(false);
                    navigate('/certificates');
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPage;