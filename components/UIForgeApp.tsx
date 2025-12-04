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

  const handleLoadDemo = () => {
    const demoUIs: GeneratedUI[] = [
      {
        id: 'demo-1',
        prompt: 'モダンなポートフォリオサイト。ヒーローセクション、スキル一覧、プロジェクトギャラリー付き',
        html: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ポートフォリオ - 山田太郎</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 100px 20px;
      text-align: center;
    }
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 20px;
    }
    .hero p {
      font-size: 1.5rem;
      opacity: 0.9;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 20px;
    }
    h2 {
      font-size: 2.5rem;
      margin-bottom: 40px;
      text-align: center;
    }
    .skills {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
    }
    .skill-card {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s;
    }
    .skill-card:hover {
      transform: translateY(-5px);
    }
    .skill-card h3 {
      color: #667eea;
      margin-bottom: 10px;
    }
    .projects {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
    .project-card {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    .project-card:hover {
      transform: translateY(-5px);
    }
    .project-image {
      width: 100%;
      height: 200px;
      background: linear-gradient(45deg, #667eea, #764ba2);
    }
    .project-content {
      padding: 20px;
    }
    .project-content h3 {
      color: #667eea;
      margin-bottom: 10px;
    }
    footer {
      background: #333;
      color: white;
      text-align: center;
      padding: 30px;
    }
  </style>
</head>
<body>
  <section class="hero">
    <h1>山田 太郎</h1>
    <p>Web Developer & Designer</p>
  </section>

  <div class="container">
    <h2>スキル</h2>
    <div class="skills">
      <div class="skill-card">
        <h3>フロントエンド</h3>
        <p>React, Vue.js, TypeScript</p>
      </div>
      <div class="skill-card">
        <h3>バックエンド</h3>
        <p>Node.js, Python, PostgreSQL</p>
      </div>
      <div class="skill-card">
        <h3>デザイン</h3>
        <p>Figma, Adobe XD, Photoshop</p>
      </div>
    </div>

    <h2>プロジェクト</h2>
    <div class="projects">
      <div class="project-card">
        <div class="project-image"></div>
        <div class="project-content">
          <h3>ECサイト構築</h3>
          <p>React と Node.js を使用したフルスタックECサイト</p>
        </div>
      </div>
      <div class="project-card">
        <div class="project-image"></div>
        <div class="project-content">
          <h3>タスク管理アプリ</h3>
          <p>Vue.js で作成したリアルタイムタスク管理ツール</p>
        </div>
      </div>
      <div class="project-card">
        <div class="project-image"></div>
        <div class="project-content">
          <h3>コーポレートサイト</h3>
          <p>レスポンシブ対応の企業向けWebサイト</p>
        </div>
      </div>
    </div>
  </div>

  <footer>
    <p>&copy; 2024 Taro Yamada. All rights reserved.</p>
  </footer>

  <script>
    document.querySelectorAll('.skill-card, .project-card').forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      });
    });
  </script>
</body>
</html>`,
        css: '',
        js: '',
        timestamp: Date.now() - 1000,
      },
      {
        id: 'demo-2',
        prompt: 'ランディングページ。製品紹介、機能一覧、価格表、CTAボタン付き',
        html: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ProductX - 最高のソリューション</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1a1a1a;
    }
    .nav {
      background: white;
      padding: 20px 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav h1 {
      color: #ff6b6b;
      font-size: 1.8rem;
    }
    .nav button {
      background: #ff6b6b;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 25px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }
    .nav button:hover {
      background: #ee5a52;
    }
    .hero {
      background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
      padding: 120px 40px;
      text-align: center;
    }
    .hero h2 {
      font-size: 3.5rem;
      margin-bottom: 20px;
    }
    .hero p {
      font-size: 1.5rem;
      margin-bottom: 40px;
      opacity: 0.8;
    }
    .cta-button {
      background: #ff6b6b;
      color: white;
      border: none;
      padding: 18px 50px;
      border-radius: 30px;
      font-size: 1.2rem;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(255,107,107,0.4);
      transition: all 0.3s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255,107,107,0.5);
    }
    .features {
      padding: 80px 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .features h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 60px;
    }
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
    }
    .feature {
      text-align: center;
      padding: 30px;
    }
    .feature-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #a29bfe, #6c5ce7);
      border-radius: 50%;
      margin: 0 auto 20px;
    }
    .pricing {
      background: #f8f9fa;
      padding: 80px 40px;
    }
    .pricing h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 60px;
    }
    .price-cards {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
    }
    .price-card {
      background: white;
      padding: 40px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    .price-card:hover {
      transform: translateY(-10px);
    }
    .price-card.featured {
      border: 3px solid #ff6b6b;
    }
    .price {
      font-size: 3rem;
      color: #ff6b6b;
      margin: 20px 0;
    }
    .price-card ul {
      list-style: none;
      margin: 30px 0;
      text-align: left;
    }
    .price-card li {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    footer {
      background: #2d3436;
      color: white;
      text-align: center;
      padding: 40px;
    }
  </style>
</head>
<body>
  <nav class="nav">
    <h1>ProductX</h1>
    <button>無料で始める</button>
  </nav>

  <section class="hero">
    <h2>ビジネスを加速させる<br>最高のツール</h2>
    <p>たった3分で始められる、次世代のソリューション</p>
    <button class="cta-button">今すぐ無料トライアル</button>
  </section>

  <section class="features">
    <h2>主な機能</h2>
    <div class="feature-grid">
      <div class="feature">
        <div class="feature-icon"></div>
        <h3>高速処理</h3>
        <p>業界最速のパフォーマンスを実現</p>
      </div>
      <div class="feature">
        <div class="feature-icon"></div>
        <h3>簡単操作</h3>
        <p>直感的なUIで誰でも使える</p>
      </div>
      <div class="feature">
        <div class="feature-icon"></div>
        <h3>安全性</h3>
        <p>エンタープライズレベルのセキュリティ</p>
      </div>
    </div>
  </section>

  <section class="pricing">
    <h2>料金プラン</h2>
    <div class="price-cards">
      <div class="price-card">
        <h3>スターター</h3>
        <div class="price">¥980<span style="font-size: 1rem;">/月</span></div>
        <ul>
          <li>✓ 基本機能</li>
          <li>✓ 5GBストレージ</li>
          <li>✓ メールサポート</li>
        </ul>
        <button class="cta-button">選択する</button>
      </div>
      <div class="price-card featured">
        <h3>プロフェッショナル</h3>
        <div class="price">¥2,980<span style="font-size: 1rem;">/月</span></div>
        <ul>
          <li>✓ 全機能</li>
          <li>✓ 50GBストレージ</li>
          <li>✓ 優先サポート</li>
          <li>✓ API アクセス</li>
        </ul>
        <button class="cta-button">選択する</button>
      </div>
      <div class="price-card">
        <h3>エンタープライズ</h3>
        <div class="price">カスタム</div>
        <ul>
          <li>✓ 無制限</li>
          <li>✓ 専任サポート</li>
          <li>✓ カスタマイズ</li>
          <li>✓ SLA保証</li>
        </ul>
        <button class="cta-button">お問い合わせ</button>
      </div>
    </div>
  </section>

  <footer>
    <p>&copy; 2024 ProductX. All rights reserved.</p>
  </footer>

  <script>
    document.querySelectorAll('.cta-button').forEach(button => {
      button.addEventListener('click', () => {
        alert('ありがとうございます！実際のアプリケーションでは登録ページへ遷移します。');
      });
    });
  </script>
</body>
</html>`,
        css: '',
        js: '',
        timestamp: Date.now() - 2000,
      },
      {
        id: 'demo-3',
        prompt: 'ダークテーマのダッシュボード。チャート、統計カード、サイドバーメニュー付き',
        html: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analytics Dashboard</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      display: flex;
    }
    .sidebar {
      width: 250px;
      background: #1e293b;
      padding: 30px 20px;
      height: 100vh;
      position: fixed;
    }
    .sidebar h2 {
      color: #38bdf8;
      margin-bottom: 40px;
      font-size: 1.5rem;
    }
    .menu-item {
      padding: 15px 20px;
      margin-bottom: 10px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s;
    }
    .menu-item:hover, .menu-item.active {
      background: #334155;
    }
    .main {
      margin-left: 250px;
      flex: 1;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }
    .header h1 {
      font-size: 2rem;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: #1e293b;
      padding: 30px;
      border-radius: 12px;
      border-left: 4px solid #38bdf8;
    }
    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: #38bdf8;
      margin: 10px 0;
    }
    .stat-label {
      color: #94a3b8;
      font-size: 0.9rem;
    }
    .stat-change {
      color: #22c55e;
      font-size: 0.9rem;
      margin-top: 10px;
    }
    .chart-container {
      background: #1e293b;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .chart-container h3 {
      margin-bottom: 20px;
      color: #e2e8f0;
    }
    .chart {
      height: 300px;
      background: linear-gradient(to top, rgba(56, 189, 248, 0.1) 0%, transparent 100%);
      border-radius: 8px;
      display: flex;
      align-items: flex-end;
      gap: 10px;
      padding: 20px;
    }
    .bar {
      flex: 1;
      background: linear-gradient(to top, #38bdf8, #0ea5e9);
      border-radius: 4px 4px 0 0;
      animation: growUp 1s ease-out;
    }
    @keyframes growUp {
      from { height: 0; }
    }
    .table-container {
      background: #1e293b;
      padding: 30px;
      border-radius: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      text-align: left;
      padding: 15px;
      color: #94a3b8;
      border-bottom: 2px solid #334155;
    }
    td {
      padding: 15px;
      border-bottom: 1px solid #334155;
    }
    tr:hover {
      background: #334155;
    }
    .status {
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
    }
    .status.success {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }
    .status.pending {
      background: rgba(251, 191, 36, 0.2);
      color: #fbbf24;
    }
  </style>
</head>
<body>
  <div class="sidebar">
    <h2>📊 Dashboard</h2>
    <div class="menu-item active">ダッシュボード</div>
    <div class="menu-item">アナリティクス</div>
    <div class="menu-item">レポート</div>
    <div class="menu-item">設定</div>
  </div>

  <div class="main">
    <div class="header">
      <h1>概要</h1>
      <div style="color: #94a3b8;">2024年12月3日</div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-label">総訪問者数</div>
        <div class="stat-value">24,563</div>
        <div class="stat-change">↑ 12.5% from last month</div>
      </div>
      <div class="stat-card" style="border-left-color: #a78bfa;">
        <div class="stat-label">売上</div>
        <div class="stat-value" style="color: #a78bfa;">¥1,248K</div>
        <div class="stat-change">↑ 8.2% from last month</div>
      </div>
      <div class="stat-card" style="border-left-color: #f472b6;">
        <div class="stat-label">コンバージョン率</div>
        <div class="stat-value" style="color: #f472b6;">3.24%</div>
        <div class="stat-change">↑ 2.1% from last month</div>
      </div>
      <div class="stat-card" style="border-left-color: #34d399;">
        <div class="stat-label">アクティブユーザー</div>
        <div class="stat-value" style="color: #34d399;">8,432</div>
        <div class="stat-change">↑ 15.3% from last month</div>
      </div>
    </div>

    <div class="chart-container">
      <h3>月別トラフィック</h3>
      <div class="chart">
        <div class="bar" style="height: 60%;"></div>
        <div class="bar" style="height: 75%;"></div>
        <div class="bar" style="height: 45%;"></div>
        <div class="bar" style="height: 85%;"></div>
        <div class="bar" style="height: 65%;"></div>
        <div class="bar" style="height: 90%;"></div>
        <div class="bar" style="height: 100%;"></div>
      </div>
    </div>

    <div class="table-container">
      <h3 style="margin-bottom: 20px;">最近の取引</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>顧客名</th>
            <th>金額</th>
            <th>ステータス</th>
            <th>日付</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#12345</td>
            <td>田中 一郎</td>
            <td>¥25,000</td>
            <td><span class="status success">完了</span></td>
            <td>2024/12/01</td>
          </tr>
          <tr>
            <td>#12346</td>
            <td>佐藤 花子</td>
            <td>¥18,500</td>
            <td><span class="status pending">処理中</span></td>
            <td>2024/12/02</td>
          </tr>
          <tr>
            <td>#12347</td>
            <td>鈴木 次郎</td>
            <td>¥32,100</td>
            <td><span class="status success">完了</span></td>
            <td>2024/12/03</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <script>
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', function() {
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
      });
    });
  </script>
</body>
</html>`,
        css: '',
        js: '',
        timestamp: Date.now() - 3000,
      },
    ];

    setGeneratedUIs([...demoUIs, ...generatedUIs]);
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
              <button onClick={handleLoadDemo} className="demo-button">
                <span className="button-glow" />
                デモを見る（3つのサンプル）
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
