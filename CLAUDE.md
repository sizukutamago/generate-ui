# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

UIFORGE - AIを使ってHTML/CSS/JavaScriptのWebページを生成するNext.jsアプリケーション。OpenAI GPT-4oを使用してユーザーのプロンプトから完全なUIコンポーネントを生成する。

## 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 本番サーバー起動
pnpm start

# Lint
pnpm lint

# Playwrightテスト実行（開発サーバー起動後）
pnpm exec playwright test

# Playwrightブラウザインストール
pnpm exec playwright install
```

## アーキテクチャ

### ディレクトリ構成
- `app/` - Next.js App Router
  - `api/generate/route.ts` - UI生成APIエンドポイント
  - `page.tsx` - メインページエントリポイント
- `components/` - Reactコンポーネント
- `types/` - TypeScript型定義
- `styles/` - コンポーネント別CSSファイル
- `tests/` - Playwrightテスト

### データフロー

1. ユーザーがOpenAI APIキーを入力（localStorage保存）
2. `PromptInput`でプロンプトと生成パターン数を設定
3. `/api/generate`がOpenAI GPT-4oでHTML/CSS/JSを生成
4. `GeneratedResults`にカード形式で表示
5. `PreviewModal`でiframeプレビューとコード表示

### 型定義（types/index.ts）
- `GeneratedUI` - 生成されたUIデータ（id, prompt, html, css, js, timestamp）
- `GenerateRequest` - API リクエスト
- `GenerateResponse` - APIレスポンス

### パスエイリアス
`@/*`で プロジェクトルートを参照（tsconfig.json）

## 技術スタック
- Next.js 15 (App Router)
- React 18
- TypeScript
- OpenAI API (GPT-4o)
- Playwright (E2Eテスト)
- pnpm (パッケージマネージャー)

## MCP
- playwright mcp: ブラウザでの動作確認
- context7: ウェブでの情報検索
- sequential-thinking: 深い思考が必要な場合
