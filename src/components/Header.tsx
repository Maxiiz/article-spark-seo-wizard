
import React from 'react';
import { Sparkles, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="w-full border-b bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-green-500" />
            <span className="text-xl font-bold text-gradient">SEO BoostX</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              ฟีเจอร์
            </a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              เกี่ยวกับ
            </a>
            <Button variant="outline" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </Button>
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
