'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { ApiKeyInput } from './ApiKeyInput';
import { PromptInput } from './PromptInput';
import { GeneratedResults } from './GeneratedResults';
import { GeneratedUI, GenerateResponse } from '@/types';
import '@/styles/app-styles.css';

export function UIForgeApp() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUIs, setGeneratedUIs] = useState<GeneratedUI[]>([]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) setApiKey(savedApiKey);

    const savedUIs = localStorage.getItem('generated_uis');
    if (savedUIs) {
      try {
        setGeneratedUIs(JSON.parse(savedUIs));
      } catch (e) {
        console.error('Failed to load saved UIs', e);
      }
    }
  }, []);

  // Save generated UIs to localStorage
  useEffect(() => {
    if (generatedUIs.length > 0) {
      localStorage.setItem('generated_uis', JSON.stringify(generatedUIs));
    }
  }, [generatedUIs]);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  };

  const handleGenerate = async (
    prompt: string,
    patternCount: number,
    referenceImages: string[],
    referenceUrls: string[]
  ) => {
    if (!apiKey) {
      alert('OpenAI API Keyを入力してください');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          patternCount,
          referenceImages,
          referenceUrls,
          apiKey,
        }),
      });

      const data: GenerateResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedUIs([...data.data, ...generatedUIs]);
    } catch (error: unknown) {
      console.error('Generation error:', error);
      const errorMessage = error instanceof Error ? error.message : '生成中にエラーが発生しました';
      alert(`エラーが発生しました: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    const updated = generatedUIs.filter(ui => ui.id !== id);
    setGeneratedUIs(updated);
    localStorage.setItem('generated_uis', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (confirm('すべての生成履歴を削除しますか？')) {
      setGeneratedUIs([]);
      localStorage.removeItem('generated_uis');
    }
  };


  return (
    <div className="app-container">
      {/* Animated grid background */}
      <div className="grid-background" />
      <div className="noise-overlay" />

      <div className="content-wrapper">
        {/* Header */}
        <header className="main-header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                <Zap className="w-8 h-8" strokeWidth={2.5} />
              </div>
              <div className="logo-text">
                <h1>UI<span className="highlight">FORGE</span></h1>
                <p className="tagline">AI駆動型インターフェースジェネレーター</p>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-value">{generatedUIs.length}</span>
                <span className="stat-label">生成済み</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {/* API Key Input */}
          <div className="section-wrapper">
            <ApiKeyInput apiKey={apiKey} onChange={handleApiKeyChange} />
          </div>

          {/* Prompt Input */}
          <div className="section-wrapper">
            <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* Generated Results */}
          {generatedUIs.length > 0 && (
            <div className="section-wrapper">
              <GeneratedResults
                generatedUIs={generatedUIs}
                onDelete={handleDelete}
                onClearAll={handleClearAll}
              />
            </div>
          )}

          {generatedUIs.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <Sparkles className="w-16 h-16" />
              </div>
              <h3>準備完了</h3>
              <p>AIを使って魅力的なUIデザインを生成しましょう</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
