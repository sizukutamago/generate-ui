import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GeneratedUI, GenerateRequest, GenerateResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, patternCount, referenceImages, referenceUrls, apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API Keyが必要です' },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'プロンプトが必要です' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const newUIs: GeneratedUI[] = [];

    for (let i = 0; i < patternCount; i++) {
      const userPrompt = buildPrompt(prompt, i, patternCount, referenceImages, referenceUrls);

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `あなたはプロフェッショナルなWebデザイナー兼フロントエンド開発者です。完全に機能するHTML/CSS/JavaScriptのWebページを生成してください。

要件:
- 完全なHTMLドキュメントを生成（<!DOCTYPE html>から</html>まで）
- CSSは<style>タグ内に記述
- JavaScriptは<script>タグ内に記述
- レスポンシブデザイン
- モダンで美しいデザイン
- 必要に応じてインタラクティブな要素を含める

出力形式（必ずこの形式で返してください）:
\`\`\`html
[完全なHTMLコード]
\`\`\`

\`\`\`css
[CSSコード（styleタグの中身のみ）]
\`\`\`

\`\`\`javascript
[JavaScriptコード（scriptタグの中身のみ）]
\`\`\``
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.8,
      });

      const content = response.choices[0].message.content || '';
      const { html, css, js } = extractCode(content);

      newUIs.push({
        id: `${Date.now()}-${i}`,
        prompt,
        html,
        css,
        js,
        timestamp: Date.now(),
      });
    }

    return NextResponse.json({ success: true, data: newUIs });
  } catch (error: unknown) {
    console.error('Generation error:', error);
    const errorMessage = error instanceof Error ? error.message : '生成中にエラーが発生しました';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

function buildPrompt(
  userPrompt: string,
  index: number,
  total: number,
  images: string[],
  urls: string[]
): string {
  let prompt = `以下の要件でWebページを作成してください:\n\n${userPrompt}\n\n`;

  if (total > 1) {
    prompt += `これは${total}パターン中の${index + 1}番目のバリエーションです。他のバリエーションとは異なるデザインアプローチやレイアウトを採用してください。\n\n`;
  }

  if (urls.length > 0) {
    prompt += `参考URL:\n${urls.join('\n')}\n\n`;
  }

  if (images.length > 0) {
    prompt += `参考画像が${images.length}枚添付されています。これらのデザインを参考にしてください。\n\n`;
  }

  return prompt;
}

function extractCode(content: string): { html: string; css: string; js: string } {
  // More flexible regex patterns to handle various GPT output formats
  const htmlMatch = content.match(/```html\s*\n?([\s\S]*?)```/) ||
                    content.match(/```HTML\s*\n?([\s\S]*?)```/);
  const cssMatch = content.match(/```css\s*\n?([\s\S]*?)```/) ||
                   content.match(/```CSS\s*\n?([\s\S]*?)```/);
  const jsMatch = content.match(/```javascript\s*\n?([\s\S]*?)```/) ||
                  content.match(/```js\s*\n?([\s\S]*?)```/) ||
                  content.match(/```JavaScript\s*\n?([\s\S]*?)```/);

  let html = htmlMatch ? htmlMatch[1].trim() : '';
  const css = cssMatch ? cssMatch[1].trim() : '';
  const js = jsMatch ? jsMatch[1].trim() : '';

  // If HTML doesn't have style tag and css is provided, inject it
  if (html && css && !html.toLowerCase().includes('<style')) {
    html = html.replace(/<\/head>/i, `  <style>\n${css}\n  </style>\n</head>`);
  }

  // If HTML doesn't have script tag and js is provided, inject it
  if (html && js && !html.toLowerCase().includes('<script')) {
    html = html.replace(/<\/body>/i, `  <script>\n${js}\n  </script>\n</body>`);
  }

  // If no HTML found, create a complete document
  if (!html) {
    html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Page</title>
  <style>
${css}
  </style>
</head>
<body>
  <div class="container">
    <p>HTMLコードが正しく抽出できませんでした。</p>
    <pre>${content}</pre>
  </div>
  <script>
${js}
  </script>
</body>
</html>`;
  }

  return { html, css, js };
}
