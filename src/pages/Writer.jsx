import React, { useState } from "react";

export default function Writer() {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("medium");
  const [style, setStyle] = useState("How-to");
  const [keywordCount, setKeywordCount] = useState(3);
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setArticle("");

    try {
      const payload = {
        topic,
        length,
        style,
        keyword_count: Number(keywordCount),
      };

      const response = await fetch("http://localhost:5678/webhook-test/gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      setArticle(text);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการติดต่อ AI Webhook");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(article);
    alert("คัดลอกบทความแล้ว");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([article], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "บทความ-SEO.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">เขียนบทความ SEO ด้วย AI</h1>

      <div className="grid gap-3">
        <input
          type="text"
          placeholder="หัวข้อบทความ"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="p-2 border rounded w-full"
        />

        <select
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="short">สั้น</option>
          <option value="medium">กลาง</option>
          <option value="long">ยาว</option>
        </select>

        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="How-to">How-to</option>
          <option value="AIDA">AIDA</option>
          <option value="Review">Review</option>
        </select>

        <input
          type="number"
          min={1}
          value={keywordCount}
          onChange={(e) => setKeywordCount(e.target.value)}
          className="p-2 border rounded"
          placeholder="จำนวนคีย์เวิร์ด"
        />

        <button
          onClick={handleGenerate}
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "กำลังสร้าง..." : "สร้างบทความ"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {article && (
        <div className="mt-6">
          <h2 className="font-bold mb-2">บทความที่สร้างแล้ว</h2>
          <textarea
            className="w-full h-64 p-4 border rounded"
            readOnly
            value={article}
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleCopy}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              คัดลอก
            </button>
            <button
              onClick={handleDownload}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              ดาวน์โหลด .txt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
