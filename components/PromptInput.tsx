'use client';

import { useState, useRef } from 'react';
import { Wand2, Upload, Link as LinkIcon, X, Sparkles } from 'lucide-react';
import '@/styles/prompt-input.css';

interface PromptInputProps {
  onGenerate: (
    prompt: string,
    patternCount: number,
    referenceImages: string[],
    referenceUrls: string[]
  ) => void;
  isGenerating: boolean;
}

export function PromptInput({ onGenerate, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [patternCount, setPatternCount] = useState(3);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [referenceUrls, setReferenceUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReferenceImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = () => {
    if (currentUrl.trim()) {
      setReferenceUrls((prev) => [...prev, currentUrl.trim()]);
      setCurrentUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveUrl = (index: number) => {
    setReferenceUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!prompt.trim()) {
      alert('プロンプトを入力してください');
      return;
    }

    onGenerate(prompt, patternCount, referenceImages, referenceUrls);
  };

  return (
    <div className="prompt-container">
      <div className="section-header">
        <div className="header-left">
          <div className="icon-wrapper">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2>生成設定</h2>
            <p className="section-subtitle">UI生成パラメータの設定</p>
          </div>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="input-section">
        <label className="input-label">
          <span className="label-text">デザイン要件</span>
          <span className="label-badge">必須</span>
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例: ダークテーマのダッシュボード。サイドバー、統計カード、インタラクティブなチャート、モダンなアニメーションを含む..."
          className="prompt-textarea"
          rows={5}
        />
      </div>

      {/* Pattern Count */}
      <div className="input-section">
        <label className="input-label">
          <span className="label-text">生成数</span>
          <span className="count-badge">{patternCount} パターン</span>
        </label>
        <div className="slider-wrapper">
          <input
            type="range"
            min="1"
            max="20"
            value={patternCount}
            onChange={(e) => setPatternCount(Number(e.target.value))}
            className="range-slider"
          />
          <div className="slider-track-fill" style={{ width: `${(patternCount - 1) / 19 * 100}%` }} />
        </div>
        <div className="slider-labels">
          <span>1</span>
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
        </div>
      </div>

      {/* Reference Images */}
      <div className="input-section">
        <label className="input-label">
          <span className="label-text">参考画像</span>
          <span className="label-badge optional">オプション</span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden-input"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="upload-button"
          type="button"
        >
          <Upload className="w-4 h-4" />
          画像をアップロード
          <div className="button-shine" />
        </button>

        {referenceImages.length > 0 && (
          <div className="images-grid">
            {referenceImages.map((img, index) => (
              <div key={index} className="image-card">
                <img src={img} alt={`Reference ${index + 1}`} className="reference-image" />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="remove-button"
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="image-overlay" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reference URLs */}
      <div className="input-section">
        <label className="input-label">
          <span className="label-text">参考URL</span>
          <span className="label-badge optional">オプション</span>
        </label>
        <div className="url-input-group">
          <input
            type="url"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
            placeholder="https://example.com"
            className="url-input"
          />
          <button
            onClick={handleAddUrl}
            className="add-url-button"
            type="button"
          >
            <LinkIcon className="w-4 h-4" />
            追加
          </button>
        </div>

        {referenceUrls.length > 0 && (
          <div className="urls-list">
            {referenceUrls.map((url, index) => (
              <div key={index} className="url-item">
                <LinkIcon className="url-icon" size={14} />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="url-link"
                >
                  {url}
                </a>
                <button
                  onClick={() => handleRemoveUrl(index)}
                  className="url-remove"
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleSubmit}
        disabled={isGenerating}
        className="generate-button"
        type="button"
      >
        <div className="button-bg" />
        <div className="button-content">
          {isGenerating ? (
            <>
              <div className="spinner" />
              <span>{patternCount}パターン生成中...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>{patternCount}パターン生成</span>
            </>
          )}
        </div>
        <div className="button-glow" />
      </button>
    </div>
  );
}
