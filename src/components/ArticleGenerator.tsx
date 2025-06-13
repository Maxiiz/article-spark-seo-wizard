
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, FileText, Loader2 } from "lucide-react";

interface ArticleGeneratorProps {
  article: string;
  onCopy: () => void;
  onDownload: () => void;
  isGenerating: boolean;
}

const ArticleGenerator: React.FC<ArticleGeneratorProps> = ({ 
  article, 
  onCopy, 
  onDownload, 
  isGenerating 
}) => {
  return (
    <Card className="glass h-fit">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <CardTitle>บทความที่สร้างแล้ว</CardTitle>
        </div>
        <CardDescription>
          ผลลัพธ์บทความ SEO ที่ AI สร้างให้คุณ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            <p className="text-gray-600 text-center">
              กำลังสร้างบทความ SEO ที่ดีที่สุดสำหรับคุณ...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        ) : article ? (
          <>
            <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {article}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={onCopy}
                variant="outline" 
                className="flex-1 gap-2"
              >
                <Copy className="h-4 w-4" />
                คัดลอกบทความ
              </Button>
              <Button 
                onClick={onDownload}
                variant="outline" 
                className="flex-1 gap-2"
              >
                <Download className="h-4 w-4" />
                ดาวน์โหลด .txt
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">ยังไม่มีบทความ</p>
            <p className="text-sm">
              กรุณาใส่ข้อมูลและกดปุ่ม "สร้างบทความ SEO" เพื่อเริ่มต้น
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticleGenerator;
