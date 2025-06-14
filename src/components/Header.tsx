
import React from 'react';
import { Sparkles, Github, ExternalLink, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="w-full border-b bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-green-500" />
            <span className="text-xl font-bold text-gradient">SEO BoostX</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  แดชบอร์ด
                </Link>
                <Link to="/writer" className="text-gray-600 hover:text-gray-900 transition-colors">
                  เขียนบทความ
                </Link>
                <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                  แผนสมาชิก
                </Link>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {currentUser.email}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  ฟีเจอร์
                </a>
                <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  เกี่ยวกับ
                </a>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    สมัครสมาชิก
                  </Button>
                </Link>
              </>
            )}
          </nav>

          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
