
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Copy, Download, Loader2, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const Writer = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    topic: '',
    length: 'medium',
    style: 'How-to',
    keywordCount: 3
  });
  
  const [generatedArticle, setGeneratedArticle] = useState('');
  const [loading, setLoading] = useState(false);

  // ตรวจสอบแผนสมาชิก
  useEffect(() => {
    if (userProfile && userProfile.plan === 'free') {
      toast({
        title: "จำเป็นต้องอัปเกรด",
        description: "กรุณาอัปเกรดแผนสมาชิกเพื่อใช้งานฟีเจอร์นี้",
        variant: "destructive"
      });
      navigate('/pricing');
    }
  }, [userProfile, navigate, toast]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateArticle = async () => {
    if (!formData.topic.trim()) {
      toast({
        title: "ข้อมูลไม่ครบ",
        description: "กรุณากรอกหัวข้อบทความ",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const webhookUrl = 'http://localhost:5678/webhook-test/gen';
      
      const payload = {
        topic: formData.topic,
        length: formData.length,
        style: formData.style,
        keyword_count: formData.keywordCount
      };

      console.log('Sending payload to webhook:', payload);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        let result;
        
        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
          console.log('JSON response from webhook:', result);
          
          // ตรวจสอบว่ามีเนื้อหาบทความหรือไม่
          if (result.article) {
            setGeneratedArticle(result.article);
          } else if (result.content) {
            setGeneratedArticle(result.content);
          } else if (result.output) {
            setGeneratedArticle(result.output);
          } else if (result.text) {
            setGeneratedArticle(result.text);
          } else if (result.message === "Workflow was started") {
            // หากยังไม่ได้ผลลัพธ์ ให้รอและลองขอข้อมูลอีกครั้ง
            toast({
              title: "กำลังประมวลผล",
              description: "กำลังสร้างบทความ กรุณารอสักครู่...",
            });
            
            // ลองดึงข้อมูลอีกครั้งหลังจาก 3 วินาที
            setTimeout(() => {
              fetchArticleResult();
            }, 3000);
            return;
          } else {
            // ถ้าไม่มีเนื้อหาในรูปแบบที่คาดหวัง ให้แสดง JSON ทั้งหมด
            setGeneratedArticle(JSON.stringify(result, null, 2));
          }
        } else {
          result = await response.text();
          console.log('Text response from webhook:', result);
          setGeneratedArticle(result);
        }
        
        toast({
          title: "สำเร็จ!",
          description: "สร้างบทความเรียบร้อยแล้ว",
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error generating article:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับ webhook ได้ กรุณาตรวจสอบการเชื่อมต่อ",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับดึงผลลัพธ์บทความ (ใช้เมื่อ workflow started)
  const fetchArticleResult = async () => {
    try {
      const resultUrl = 'http://localhost:5678/webhook-test/result'; // URL สำหรับดึงผลลัพธ์
      
      const response = await fetch(resultUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        let result;
        
        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
        } else {
          result = await response.text();
        }
        
        console.log('Article result from webhook:', result);
        
        if (typeof result === 'string' && result.trim()) {
          setGeneratedArticle(result);
          toast({
            title: "สำเร็จ!",
            description: "ได้รับบทความจาก AI แล้ว",
          });
        } else if (result.article || result.content || result.output) {
          setGeneratedArticle(result.article || result.content || result.output);
          toast({
            title: "สำเร็จ!",
            description: "ได้รับบทความจาก AI แล้ว",
          });
        }
      } else {
        console.log('ยังไม่ได้ผลลัพธ์ ลองอีกครั้งใน 3 วินาที');
        setTimeout(() => {
          fetchArticleResult();
        }, 3000);
      }
    } catch (error) {
      console.error('Error fetching article result:', error);
      // ถ้าเกิดข้อผิดพลาด ให้ลองอีกครั้ง
      setTimeout(() => {
        fetchArticleResult();
      }, 5000);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedArticle);
    toast({
      title: "คัดลอกแล้ว!",
      description: "คัดลอกบทความไปยังคลิปบอร์ดแล้ว",
    });
  };

  const downloadArticle = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedArticle], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.topic.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "ดาวน์โหลดแล้ว!",
      description: "ดาวน์โหลดบทความเป็นไฟล์ .txt เรียบร้อย",
    });
  };

  // แสดงหน้าสำหรับผู้ใช้ฟรี
  if (userProfile?.plan === 'free') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="glass">
              <CardContent className="pt-6">
                <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold mb-2">ฟีเจอร์สำหรับสมาชิก</h2>
                <p className="text-gray-600 mb-6">
                  กรุณาอัปเกรดแผนสมาชิกเพื่อใช้งานเครื่องมือเขียนบทความ AI
                </p>
                <Button onClick={() => navigate('/pricing')}>
                  ดูแผนสมาชิก
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">เขียนบทความ SEO อัตโนมัติ</h1>
            <p className="text-gray-600">สร้างบทความคุณภาพสูงด้วย AI</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ฟอร์มตั้งค่า */}
            <div className="lg:col-span-1">
              <Card className="glass sticky top-8">
                <CardHeader>
                  <CardTitle>ตั้งค่าบทความ</CardTitle>
                  <CardDescription>กรอกข้อมูลเพื่อสร้างบทความ SEO</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">หัวข้อบทความ</Label>
                    <Input
                      id="topic"
                      value={formData.topic}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      placeholder="กรอกหัวข้อบทความที่ต้องการ"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length">ความยาวบทความ</Label>
                    <Select value={formData.length} onValueChange={(value) => handleInputChange('length', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">สั้น (300-500 คำ)</SelectItem>
                        <SelectItem value="medium">กลาง (500-800 คำ)</SelectItem>
                        <SelectItem value="long">ยาว (800-1200 คำ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style">สไตล์บทความ</Label>
                    <Select value={formData.style} onValueChange={(value) => handleInputChange('style', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="How-to">How-to (วิธีการ)</SelectItem>
                        <SelectItem value="AIDA">AIDA (การตลาด)</SelectItem>
                        <SelectItem value="Review">Review (รีวิว)</SelectItem>
                        <SelectItem value="EEAT">E-E-A-T (ความน่าเชื่อถือ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">จำนวนคีย์เวิร์ด</Label>
                    <Select value={formData.keywordCount.toString()} onValueChange={(value) => handleInputChange('keywordCount', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 คีย์เวิร์ด</SelectItem>
                        <SelectItem value="5">5 คีย์เวิร์ด</SelectItem>
                        <SelectItem value="7">7 คีย์เวิร์ด</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={generateArticle} 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        กำลังสร้างบทความ...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        สร้างบทความ
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* แสดงผลลัพธ์ */}
            <div className="lg:col-span-2">
              <Card className="glass h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>บทความที่สร้างแล้ว</CardTitle>
                      <CardDescription>ผลลัพธ์บทความ SEO จาก AI Webhook</CardDescription>
                    </div>
                    {generatedArticle && (
                      <div className="flex gap-2">
                        <Button 
                          onClick={copyToClipboard}
                          variant="outline" 
                          size="sm"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          คัดลอก
                        </Button>
                        <Button 
                          onClick={downloadArticle}
                          variant="outline" 
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          ดาวน์โหลด
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                      <Loader2 className="h-12 w-12 animate-spin text-green-500" />
                      <p className="text-gray-600 text-center text-lg">
                        กำลังส่งคำขอไปยัง AI Webhook และรอผลลัพธ์...
                      </p>
                      <div className="w-64 bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  ) : generatedArticle ? (
                    <div className="space-y-6">
                      {/* แสดงบทความในรูปแบบ formatted */}
                      <div className="bg-white border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                        <div className="prose prose-sm max-w-none">
                          {generatedArticle.split('\n').map((line, index) => {
                            if (line.startsWith('# ')) {
                              return <h1 key={index} className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">{line.substring(2)}</h1>;
                            } else if (line.startsWith('## ')) {
                              return <h2 key={index} className="text-xl font-semibold text-gray-800 mb-3 mt-6">{line.substring(3)}</h2>;
                            } else if (line.startsWith('### ')) {
                              return <h3 key={index} className="text-lg font-medium text-gray-700 mb-2 mt-4">{line.substring(4)}</h3>;
                            } else if (line.startsWith('**') && line.endsWith('**')) {
                              return <p key={index} className="font-semibold text-gray-800 mb-2">{line.substring(2, line.length - 2)}</p>;
                            } else if (line.startsWith('- ')) {
                              return <li key={index} className="text-gray-600 mb-1 ml-4 list-disc">{line.substring(2)}</li>;
                            } else if (line.match(/^\d+\./)) {
                              return <li key={index} className="text-gray-600 mb-1 ml-4 list-decimal">{line.substring(line.indexOf('.') + 2)}</li>;
                            } else if (line.trim()) {
                              return <p key={index} className="text-gray-700 mb-3 leading-relaxed">{line}</p>;
                            } else {
                              return <br key={index} />;
                            }
                          })}
                        </div>
                      </div>
                      
                      {/* Raw text สำหรับแก้ไข */}
                      <div className="space-y-2">
                        <Label>แก้ไขบทความ (ข้อความดิบ)</Label>
                        <Textarea
                          value={generatedArticle}
                          onChange={(e) => setGeneratedArticle(e.target.value)}
                          className="min-h-64 font-mono text-sm"
                          placeholder="บทความจาก Webhook จะแสดงที่นี่..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-500">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-xl font-medium mb-2">ยังไม่มีบทความ</p>
                      <p className="text-sm">กรุณากรอกข้อมูลและกดปุ่ม "สร้างบทความ" เพื่อรับบทความจาก AI Webhook</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Writer;
