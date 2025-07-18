import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'audio' | 'pdf';
  content: string;
  duration?: number;
  completed?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: string;
  instructorAvatar: string;
  thumbnail: string;
  modules: Module[];
  enrolled?: boolean;
  progress?: number;
  rating: number;
  studentsCount: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

interface CourseContextType {
  courses: Course[];
  enrolledCourses: Course[];
  createCourse: (course: Omit<Course, 'id' | 'studentsCount' | 'rating'>) => void;
  enrollInCourse: (courseId: string) => void;
  updateProgress: (courseId: string, progress: number) => void;
  completeLessson: (courseId: string, moduleId: string, lessonId: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Complete React Development Course',
      description: 'Learn React from scratch with hands-on projects and real-world examples. Master components, hooks, state management, and modern React patterns.',
      price: 99.99,
      instructor: 'Sarah Johnson',
      instructorAvatar: '',
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500&h=300',
      modules: [
        {
          id: 'm1',
          title: 'Introduction to React',
          lessons: [
            { id: 'l1', title: 'What is React?', type: 'video', content: 'Introduction to React concepts', duration: 15 },
            { id: 'l2', title: 'Setting up Development Environment', type: 'video', content: 'Setup guide', duration: 20 },
            { id: 'l3', title: 'Your First Component', type: 'video', content: 'Creating components', duration: 25 }
          ]
        },
        {
          id: 'm2',
          title: 'React Hooks',
          lessons: [
            { id: 'l4', title: 'useState Hook', type: 'video', content: 'State management', duration: 30 },
            { id: 'l5', title: 'useEffect Hook', type: 'video', content: 'Side effects', duration: 35 }
          ]
        }
      ],
      rating: 4.8,
      studentsCount: 1250,
      duration: '12 hours',
      level: 'Beginner',
      category: 'Programming'
    },
    {
      id: '2',
      title: 'Advanced JavaScript Mastery',
      description: 'Deep dive into advanced JavaScript concepts including async programming, design patterns, and modern ES6+ features.',
      price: 79.99,
      instructor: 'Michael Chen',
      instructorAvatar: '',
      thumbnail: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500&h=300',
      modules: [
        {
          id: 'm3',
          title: 'Async JavaScript',
          lessons: [
            { id: 'l6', title: 'Promises and Async/Await', type: 'video', content: 'Async programming', duration: 40 },
            { id: 'l7', title: 'Fetch API', type: 'video', content: 'API calls', duration: 25 }
          ]
        }
      ],
      rating: 4.9,
      studentsCount: 890,
      duration: '8 hours',
      level: 'Advanced',
      category: 'Programming'
    },
    {
      id: '3',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of user interface and user experience design. Create beautiful, functional designs that users love.',
      price: 89.99,
      instructor: 'Emily Rodriguez',
      instructorAvatar: '',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500&h=300',
      modules: [
        {
          id: 'm4',
          title: 'Design Principles',
          lessons: [
            { id: 'l8', title: 'Color Theory', type: 'video', content: 'Understanding colors', duration: 30 },
            { id: 'l9', title: 'Typography', type: 'video', content: 'Font selection', duration: 25 }
          ]
        }
      ],
      rating: 4.7,
      studentsCount: 650,
      duration: '10 hours',
      level: 'Beginner',
      category: 'Design'
    }
  ]);

  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  const createCourse = (courseData: Omit<Course, 'id' | 'studentsCount' | 'rating'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      studentsCount: 0,
      rating: 0
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const enrollInCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course && !enrolledCourses.find(c => c.id === courseId)) {
      setEnrolledCourses(prev => [...prev, { ...course, enrolled: true, progress: 0 }]);
    }
  };

  const updateProgress = (courseId: string, progress: number) => {
    setEnrolledCourses(prev => 
      prev.map(course => 
        course.id === courseId ? { ...course, progress } : course
      )
    );
  };

  const completeLessson = (courseId: string, moduleId: string, lessonId: string) => {
    setEnrolledCourses(prev => 
      prev.map(course => {
        if (course.id === courseId) {
          const updatedModules = course.modules.map(module => {
            if (module.id === moduleId) {
              const updatedLessons = module.lessons.map(lesson => 
                lesson.id === lessonId ? { ...lesson, completed: true } : lesson
              );
              return { ...module, lessons: updatedLessons };
            }
            return module;
          });
          return { ...course, modules: updatedModules };
        }
        return course;
      })
    );
  };

  return (
    <CourseContext.Provider value={{ 
      courses, 
      enrolledCourses, 
      createCourse, 
      enrollInCourse, 
      updateProgress,
      completeLessson 
    }}>
      {children}
    </CourseContext.Provider>
  );
};