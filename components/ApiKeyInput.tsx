'use client';

import { useState } from 'react';
import { Key, Eye, EyeOff, Shield } from 'lucide-react';
import '@/styles/api-key-input.css';

interface ApiKeyInputProps {
  apiKey: string;
  onChange: (key: string) => void;
}

export function ApiKeyInput({ apiKey, onChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="api-key-container">
      <div className="api-section-header">
        <div className="api-header-left">
          <div className="api-icon-wrapper">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2>API設定</h2>
            <p className="api-section-subtitle">OpenAI APIキーの安全な認証</p>
          </div>
        </div>
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="get-key-link"
        >
          APIキーを取得 →
        </a>
      </div>

      <div className="api-input-group">
        <div className="api-input-wrapper">
          <Key className="api-input-icon" size={18} />
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => onChange(e.target.value)}
            placeholder="sk-proj-..."
            className="api-input"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="api-toggle-visibility"
            type="button"
          >
            {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="api-input-hint">
          <div className="api-hint-dot" />
          ブラウザにローカル保存されます
        </div>
      </div>
    </div>
  );
}
