import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="text-lg font-semibold tracking-tight text-neutral-900">
            ProposalAI
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-sm text-neutral-500">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
