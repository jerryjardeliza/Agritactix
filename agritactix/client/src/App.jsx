import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';

import AuthPage from './pages/AuthPage';
import MainMenu from './pages/MainMenu';
import LessonsPage from './pages/LessonsPage';
import LessonDetail from './pages/LessonDetail';
import QuizPage from './pages/QuizPage';
import SimulationPage from './pages/SimulationPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLessons from './pages/admin/AdminLessons';
import AdminQuizzes from './pages/admin/AdminQuizzes';
import AdminPlayers from './pages/admin/AdminPlayers';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const token = useStore((s) => s.token);
  return token ? children : <Navigate to="/auth" replace />;
};

const AdminRoute = ({ children }) => {
  const user = useStore((s) => s.user);
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const token = useStore((s) => s.token);

  return (
    <>
      {token && <Navbar />}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<PrivateRoute><MainMenu /></PrivateRoute>} />
        <Route path="/lessons" element={<PrivateRoute><LessonsPage /></PrivateRoute>} />
        <Route path="/lessons/:id" element={<PrivateRoute><LessonDetail /></PrivateRoute>} />
        <Route path="/quiz/:id" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
        <Route path="/simulation" element={<PrivateRoute><SimulationPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/lessons" element={<AdminRoute><AdminLessons /></AdminRoute>} />
        <Route path="/admin/quizzes" element={<AdminRoute><AdminQuizzes /></AdminRoute>} />
        <Route path="/admin/players" element={<AdminRoute><AdminPlayers /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
