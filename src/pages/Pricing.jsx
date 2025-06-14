
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const Pricing = () => {
  const { currentUser, userProfile, fetchUserProfile } = useAuth();
  const [loading, setLoading] = useState(null);
  const { toast } = useToast();

  const plans = [
    {
      id: 'free',
      name: 'ฟรี',
      price: '0',
      period: '',
      description: 'สำหรับผู้ใช้ทั่วไป',
      features: [
        'ดูตัวอย่างเท่านั้น',
        'ไม่สามารถสร้างบทความได้',
        'การสนับสนุนพื้นฐาน'
      ],
      color: 'border-gray-200',
      buttonText: 'แผนปัจจุบัน',
      disabled: true
    },
    {
      id: 'monthly',
      name: 'รายเดือน',
      price: '299',
      period: '/เดือน',
      description: 'สำหรับผู้ใช้ประจำ',
      features: [
        'สร้างบทความได้ไม่จำกัด',
        'AI เขียนบทความคุณภาพสูง',
        'ดาวน์โหลดและคัดลอกได้',
        'การสนับสนุนแบบเร็ว'
      ],
      color: 'border-blue-500',
      buttonText: 'อัปเกรดเป็นรายเดือน',
      popular: true
    },
    {
      id: 'yearly',
      name: 'รายปี',
      price: '2,990',
      period: '/ปี',
      description: 'ประหยัดที่สุด (ลด 17%)',
      features: [
        'สร้างบทความได้ไม่จำกัด',
        'AI เขียนบทความคุณภาพสูง',
        'ดาวน์โหลดและคัดลอกได้',
        'การสนับสนุนแบบพรีเมียม',
        'ฟีเจอร์ใหม่ก่อนใคร'
      ],
      color: 'border-green-500',
      buttonText: 'อัปเกรดเป็นรายปี'
    }
  ];

  const handleUpgrade = async (planId) => {
    if (!currentUser) return;

    try {
      setLoading(planId);
      
      // อัปเดตแผนใน Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        plan: planId
      });

      // รีเฟรชข้อมูลผู้ใช้
      await fetchUserProfile(currentUser.uid);

      toast({
        title: "อัปเกรดสำเร็จ!",
        description: `เปลี่ยนเป็นแผน${planId === 'monthly' ? 'รายเดือน' : 'รายปี'}แล้ว`,
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเกรดได้ กรุณาลองใหม่",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4">แผนสมาชิก</h1>
            <p className="text-xl text-gray-600">เลือกแผนที่เหมาะสมกับความต้องการของคุณ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`glass relative ${plan.color} ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      แนะนำ
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">฿{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className="w-full"
                    variant={userProfile?.plan === plan.id ? "outline" : "default"}
                    disabled={userProfile?.plan === plan.id || plan.disabled || loading === plan.id}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {loading === plan.id ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        กำลังอัปเกรด...
                      </>
                    ) : userProfile?.plan === plan.id ? (
                      'แผนปัจจุบัน'
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
