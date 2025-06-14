
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Sparkles, Zap, FileText, Settings, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ArticleGenerator from '@/components/ArticleGenerator';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';

const Index = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState('');
  const [config, setConfig] = useState({
    apiKey: '',
    model: 'gpt',
    topic: '',
    length: 'medium',
    style: 'AIDA',
    keywordCount: 5
  });

  const handleGenerate = async () => {
    toast({
      title: "ต้องเข้าสู่ระบบ",
      description: "กรุณาเข้าสู่ระบบเพื่อใช้งานฟีเจอร์นี้",
      variant: "destructive"
    });
  };

  const handleCopy = () => {
    toast({
      title: "ต้องเข้าสู่ระบบ",
      description: "กรุณาเข้าสู่ระบบเพื่อใช้งานฟีเจอร์นี้",
      variant: "destructive"
    });
  };

  const handleDownload = () => {
    toast({
      title: "ต้องเข้าสู่ระบบ",
      description: "กรุณาเข้าสู่ระบบเพื่อใช้งานฟีเจอร์นี้",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-green-500" />
            <h1 className="text-4xl md:text-6xl font-bold text-gradient">
              SEO BoostX
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            เครื่องมือเขียนบทความ SEO อัตโนมัติด้วย AI 
            สร้างเนื้อหาคุณภาพสูงได้ในไม่กี่คลิก
          </p>
          
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                เริ่มใช้งานฟรี
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Zap className="h-3 w-3 mr-1" />
              รวดเร็ว
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <FileText className="h-3 w-3 mr-1" />
              คุณภาพสูง
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Settings className="h-3 w-3 mr-1" />
              ปรับแต่งได้
            </Badge>
          </div>
        </div>

        {/* Demo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Configuration Panel - Demo Only */}
          <Card className="glass opacity-75">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-green-500" />
                <CardTitle>การตั้งค่า (ตัวอย่าง)</CardTitle>
              </div>
              <CardDescription>
                ตัวอย่างการตั้งค่าสำหรับสร้างบทความ SEO
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="demo-topic">หัวข้อบทความ</Label>
                <Input
                  id="demo-topic"
                  value="วิธีเขียน SEO ที่ดี"
                  disabled
                  placeholder="กรอกหัวข้อบทความ"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ความยาว</Label>
                  <Select value="medium" disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>สไตล์</Label>
                  <Select value="How-to" disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handleGenerate}
                className="w-full" 
                disabled
              >
                <FileText className="h-4 w-4 mr-2" />
                สร้างบทความ (ต้องเข้าสู่ระบบ)
              </Button>
            </CardContent>
          </Card>

          {/* Article Output - Demo */}
          <Card className="glass opacity-75">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <CardTitle>บทความที่สร้างแล้ว (ตัวอย่าง)</CardTitle>
              </div>
              <CardDescription>
                ตัวอย่างผลลัพธ์บทความ SEO
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-600 font-mono">
{`# วิธีเขียน SEO ที่ดี

## บทนำ
การเขียน SEO ที่ดีเป็นศิลปะที่ต้องใช้ทั้งความรู้
และเทคนิคที่เหมาะสม...

## เนื้อหาหลัก
1. การวิจัยคีย์เวิร์ด
2. การเขียนหัวเรื่องที่น่าสนใจ
3. การสร้างเนื้อหาที่มีคุณภาพ

## สรุป
การเขียน SEO ที่ดีจะช่วยเพิ่มการมองเห็น
ของเว็บไซต์ในผลการค้นหา...

*บทความนี้สร้างโดย SEO BoostX AI*`}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCopy}
                  variant="outline" 
                  className="flex-1 gap-2"
                  disabled
                >
                  <Copy className="h-4 w-4" />
                  คัดลอก
                </Button>
                <Button 
                  onClick={handleDownload}
                  variant="outline" 
                  className="flex-1 gap-2"
                  disabled
                >
                  <Download className="h-4 w-4" />
                  ดาวน์โหลด
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">ความสามารถหลัก</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass">
              <CardContent className="pt-6 text-center">
                <Zap className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-semibold mb-2">สร้างรวดเร็ว</h3>
                <p className="text-gray-600">สร้างบทความ SEO คุณภาพสูงได้ในไม่กี่วินาที</p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="pt-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">คุณภาพสูง</h3>
                <p className="text-gray-600">เนื้อหาที่ผ่านการออกแบบเฉพาะ SEO</p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="pt-6 text-center">
                <Settings className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">ปรับแต่งได้</h3>
                <p className="text-gray-600">เลือกสไตล์และความยาวตามต้องการ</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="glass max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">พร้อมเริ่มต้นแล้วใช่ไหม?</h2>
              <p className="text-gray-600 mb-6">
                สมัครสมาชิกวันนี้เพื่อเริ่มสร้างบทความ SEO ที่ดีที่สุด
              </p>
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  เริ่มใช้งานฟรี
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
