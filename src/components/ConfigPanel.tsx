
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Settings, Brain, Zap } from "lucide-react";

interface ConfigPanelProps {
  config: {
    apiKey: string;
    model: string;
    topic: string;
    length: string;
    style: string;
    keywordCount: number;
  };
  setConfig: (config: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, onGenerate, isGenerating }) => {
  const updateConfig = (key: string, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  const styles = [
    { value: 'AIDA', label: 'AIDA (Attention-Interest-Desire-Action)', icon: '🎯' },
    { value: 'How-to', label: 'How-to Guide', icon: '📝' },
    { value: 'Review', label: 'Product Review', icon: '⭐' },
    { value: 'Listicle', label: 'List Article', icon: '📋' },
    { value: 'News', label: 'News Style', icon: '📰' },
    { value: 'Tutorial', label: 'Tutorial', icon: '🎓' }
  ];

  return (
    <Card className="glass h-fit">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-green-500" />
          <CardTitle>ตั้งค่าการสร้างบทความ</CardTitle>
        </div>
        <CardDescription>
          กำหนดค่าต่างๆ เพื่อสร้างบทความ SEO ที่ตรงใจ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-500" />
            <Label className="text-sm font-medium">การตั้งค่า AI</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="ใส่ OpenAI หรือ Gemini API Key"
              value={config.apiKey}
              onChange={(e) => updateConfig('apiKey', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select value={config.model} onValueChange={(value) => updateConfig('model', value)}>
              <SelectTrigger>
                <SelectValue placeholder="เลือก AI Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    OpenAI GPT-4
                  </div>
                </SelectItem>
                <SelectItem value="gemini">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Google Gemini 2.0
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <Label className="text-sm font-medium">เนื้อหาบทความ</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">หัวข้อบทความ</Label>
            <Input
              id="topic"
              placeholder="เช่น วิธีการ SEO เว็บไซต์ให้ติดอันดับ Google"
              value={config.topic}
              onChange={(e) => updateConfig('topic', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">ความยาวบทความ</Label>
            <Select value={config.length} onValueChange={(value) => updateConfig('length', value)}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกความยาว" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">สั้น (300-500 คำ)</SelectItem>
                <SelectItem value="medium">กลาง (500-1000 คำ)</SelectItem>
                <SelectItem value="long">ยาว (1000-2000 คำ)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">สไตล์การเขียน</Label>
            <Select value={config.style} onValueChange={(value) => updateConfig('style', value)}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกสไตล์" />
              </SelectTrigger>
              <SelectContent>
                {styles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    <div className="flex items-center gap-2">
                      <span>{style.icon}</span>
                      {style.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="keywords">จำนวนคีย์เวิร์ด</Label>
              <Badge variant="outline">{config.keywordCount} คีย์เวิร์ด</Badge>
            </div>
            <Slider
              value={[config.keywordCount]}
              onValueChange={([value]) => updateConfig('keywordCount', value)}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <Button 
          onClick={onGenerate}
          disabled={isGenerating || !config.apiKey || !config.topic}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-6 text-lg transition-all duration-200 transform hover:scale-105"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              กำลังสร้างบทความ...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-2" />
              สร้างบทความ SEO
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConfigPanel;
