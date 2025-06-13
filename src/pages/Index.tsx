
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Sparkles, Zap, FileText, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ArticleGenerator from '@/components/ArticleGenerator';
import Header from '@/components/Header';
import ConfigPanel from '@/components/ConfigPanel';

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
    if (!config.apiKey || !config.topic) {
      toast({
        title: "ข้อมูลไม่ครบ",
        description: "กรุณาใส่ API Key และหัวข้อบทความ",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Mock API call - ในการใช้งานจริงจะเรียก backend API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockArticle = `# ${config.topic}

## บทนำ
${config.topic} เป็นหัวข้อที่น่าสนใจและมีความสำคัญในปัจจุบัน ซึ่งจะช่วยให้ผู้อ่านเข้าใจและได้รับประโยชน์จากเนื้อหานี้

## เนื้อหาหลัก
บทความนี้จะนำเสนอข้อมูลที่มีประโยชน์เกี่ยวกับ ${config.topic} โดยใช้สไตล์ ${config.style} และความยาว${config.length === 'short' ? 'สั้น' : config.length === 'medium' ? 'กลาง' : 'ยาว'}

### จุดสำคัญ
- ประเด็นสำคัญที่ 1
- ประเด็นสำคัญที่ 2  
- ประเด็นสำคัญที่ 3

## สรุป
สรุปเนื้อหาของ ${config.topic} ที่ได้นำเสนอในบทความนี้

*บทความนี้สร้างโดย SEO BoostX AI*`;

      setGeneratedArticle(mockArticle);
      toast({
        title: "สำเร็จ!",
        description: "สร้างบทความเรียบร้อยแล้ว",
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างบทความได้ กรุณาลองใหม่",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedArticle);
    toast({
      title: "คัดลอกแล้ว!",
      description: "คัดลอกบทความไปยังคลิปบอร์ดแล้ว",
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedArticle], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${config.topic.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "ดาวน์โหลดแล้ว!",
      description: "ดาวน์โหลดบทความเป็นไฟล์ .txt เรียบร้อย",
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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            เครื่องมือเขียนบทความ SEO อัตโนมัติด้วย AI 
            สร้างเนื้อหาคุณภาพสูงได้ในไม่กี่คลิก
          </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <ConfigPanel 
            config={config}
            setConfig={setConfig}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          {/* Article Output */}
          <ArticleGenerator 
            article={generatedArticle}
            onCopy={handleCopy}
            onDownload={handleDownload}
            isGenerating={isGenerating}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
