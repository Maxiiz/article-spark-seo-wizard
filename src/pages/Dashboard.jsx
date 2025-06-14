
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Crown, FileText, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const Dashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-700';
      case 'monthly': return 'bg-blue-100 text-blue-700';
      case 'yearly': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPlanText = (plan) => {
    switch (plan) {
      case 'free': return 'ฟรี';
      case 'monthly': return 'รายเดือน';
      case 'yearly': return 'รายปี';
      default: return 'ไม่ทราบ';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">แดชบอร์ด</h1>
            <p className="text-gray-600">จัดการบัญชีและใช้งาน SEO BoostX</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ข้อมูลผู้ใช้ */}
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  <CardTitle>ข้อมูลผู้ใช้</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">อีเมล</p>
                    <p className="font-medium">{currentUser?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">แผนสมาชิก</p>
                    <Badge className={getPlanColor(userProfile?.plan)}>
                      <Crown className="h-3 w-3 mr-1" />
                      {getPlanText(userProfile?.plan)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* เขียนบทความ */}
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  <CardTitle>เขียนบทความ</CardTitle>
                </div>
                <CardDescription>
                  สร้างบทความ SEO อัตโนมัติด้วย AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/writer">
                  <Button className="w-full">
                    เริ่มเขียนบทความ
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* จัดการแผน */}
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-500" />
                  <CardTitle>จัดการแผน</CardTitle>
                </div>
                <CardDescription>
                  อัปเกรดหรือเปลี่ยนแผนสมาชิก
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/pricing">
                  <Button variant="outline" className="w-full">
                    ดูแผนสมาชิก
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* ปุ่มออกจากระบบ */}
          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              onClick={logout}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
