import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CourseContext';
import { useCart } from '../contexts/CartContext';
import { Star, Users, Clock, Play, CheckCircle, Award, MessageCircle, ShoppingCart } from 'lucide-react';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { courses, enrolledCourses, enrollInCourse } = useCourses();
  const { addToCart, cartItems } = useCart();
  
  const course = courses.find(c => c.id === id);
  const isEnrolled = enrolledCourses.some(c => c.id === id);
  const isInCart = cartItems.some(item => item.course.id === id);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Курс не найден</h1>
          <Link to="/courses" className="text-blue-600 hover:text-blue-800">
            Назад к курсам
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  const totalDuration = course.modules.reduce((total, module) => 
    total + module.lessons.reduce((moduleTotal, lesson) => moduleTotal + (lesson.duration || 0), 0), 0
  );

  const handleEnroll = () => {
    if (isAuthenticated) {
      enrollInCourse(course.id);
    }
  };

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart(course);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {course.category}
                </span>
                <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                  {course.level}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{course.description}</p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{course.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-5 w-5" />
                  <span>{course.studentsCount} студентов</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-5 w-5" />
                  <span>{Math.round(totalDuration / 60)}ч {totalDuration % 60}м</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {course.instructor.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">Создано {course.instructor}</p>
                  <p className="text-blue-100">Эксперт-преподаватель</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold">{course.price} ₽</span>
                {isEnrolled ? (
                  <Link
                    to={`/learn/${course.id}`}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>Продолжить обучение</span>
                  </Link>
                ) : (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleEnroll}
                      disabled={!isAuthenticated}
                      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAuthenticated ? 'Записаться сейчас' : 'Войдите для записи'}
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={!isAuthenticated || isInCart}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>{isInCart ? 'В корзине' : 'В корзину'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                <div className="bg-white/90 p-4 rounded-full">
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Что вы изучите</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Освоите основы и продвинутые концепции</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Создадите реальные проекты с нуля</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Изучите лучшие практики индустрии</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Подготовитесь к профессиональным возможностям</span>
                </div>
              </div>
            </div>

            {/* Course Curriculum */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Программа курса</h2>
              <div className="space-y-4">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          {moduleIndex + 1}. {module.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {module.lessons.length} уроков
                        </span>
                      </div>
                    </div>
                    <div className="px-6 py-4">
                      <div className="space-y-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {lesson.type === 'video' ? (
                                <Play className="h-4 w-4 text-blue-600" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <span className="text-gray-700 flex-1">
                              {lessonIndex + 1}. {lesson.title}
                            </span>
                            {lesson.duration && (
                              <span className="text-sm text-gray-500">
                                {lesson.duration} мин
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Course Features */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Особенности курса</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{Math.round(totalDuration / 60)} часов видео по запросу</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{totalLessons} уроков</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Сертификат о прохождении</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Поддержка в формате вопрос-ответ</span>
                </div>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ваш преподаватель</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xl font-medium">
                    {course.instructor.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{course.instructor}</h4>
                  <p className="text-sm text-gray-600">Эксперт-преподаватель</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Опытный профессионал с многолетним опытом работы в индустрии и страстью к преподаванию.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;