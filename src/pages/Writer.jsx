
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
      // ตัวเลือกที่ 1: ใช้ n8n webhook
      const webhookUrl = 'http://localhost:5678/webhook-test/gen';
      
      const payload = {
        topic: formData.topic,
        length: formData.length,
        style: formData.style,
        keyword_count: formData.keywordCount
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.text();
        setGeneratedArticle(result);
        toast({
          title: "สำเร็จ!",
          description: "สร้างบทความเรียบร้อยแล้ว",
        });
      } else {
        throw new Error('Failed to generate article');
      }
    } catch (error) {
      // Fallback: Mock article สำหรับการทดสอบ
      console.log('Webhook failed, using mock data');
      
      const mockArticle = `# ${formData.topic}

## บทนำ
${formData.topic} เป็นหัวข้อที่สำคัญและน่าสนใจในปัจจุบัน ซึ่งจะช่วยให้ผู้อ่านเข้าใจและได้รับประโยชน์จากข้อมูลที่นำเสนอ

## เนื้อหาหลัก
บทความนี้ใช้สไตล์ ${formData.style} ในการนำเสนอ โดยมีความยาว${formData.length === 'short' ? 'สั้น' : formData.length === 'medium' ? 'กลาง' : 'ยาว'} และจะรวมคีย์เวิร์ดสำคัญ ${formData.keywordCount} คำ

### ประเด็นสำคัญ
1. ข้อมูลพื้นฐานเกี่ยวกับ ${formData.topic}
2. ประโยชน์และความสำคัญ
3. วิธีการประยุกต์ใช้

### แนวทางการดำเนินการ
- ขั้นตอนที่ 1: การวางแผน
- ขั้นตอนที่ 2: การเตรียมการ
- ขั้นตอนที่ 3: การปฏิบัติ

## สรุป
${formData.topic} เป็นเรื่องที่มีความสำคัญและสามารถนำไปประยุกต์ใช้ได้จริง หากผู้อ่านต้องการข้อมูลเพิ่มเติม สามารถศึกษาต่อได้

*บทความนี้สร้างโดย SEO BoostX AI - เครื่องมือเขียนบทความ SEO อัตโนมัติ*`;

      setGeneratedArticle(mockArticle);
      toast({
        title: "สำเร็จ!",
        description: "สร้างบทความเรียบร้อยแล้ว (โหมดทดสอบ)",
      });
    } finally {
      setLoading(false);
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">เขียนบทความ SEO อัตโนมัติ</h1>
            <p className="text-gray-600">สร้างบทความคุณภาพสูงด้วย AI</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ฟอร์มตั้งค่า */}
            <Card className="glass">
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

            {/* แสดงผลลัพธ์ */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>บทความที่สร้างแล้ว</CardTitle>
                <CardDescription>ผลลัพธ์บทความ SEO ที่ AI สร้างให้คุณ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                    <p className="text-gray-600 text-center">
                      กำลังสร้างบทความ SEO ที่ดีที่สุดสำหรับคุณ...
                    </p>
                  </div>
                ) : generatedArticle ? (
                  <>
                    <Textarea
                      value={generatedArticle}
                      readOnly
                      className="min-h-96 font-mono text-sm"
                      placeholder="บทความจะแสดงที่นี่..."
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={copyToClipboard}
                        variant="outline" 
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        คัดลอก
                      </Button>
                      <Button 
                        onClick={downloadArticle}
                        variant="outline" 
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        ดาวน์โหลด
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">ยังไม่มีบทความ</p>
                    <p className="text-sm">กรุณากรอกข้อมูลและกดปุ่ม "สร้างบทความ" เพื่อเริ่มต้น</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Writer;
