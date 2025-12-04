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

デザインを考える際は下記を意識してください、
Design Thinking
Before coding, understand the context and commit to a BOLD aesthetic direction:

Purpose: What problem does this interface solve? Who uses it?
Tone: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
Constraints: Technical requirements (framework, performance, accessibility).
Differentiation: What makes this UNFORGETTABLE? What's the one thing someone will remember?
CRITICAL: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:

Production-grade and functional
Visually striking and memorable
Cohesive with a clear aesthetic point-of-view
Meticulously refined in every detail
Frontend Aesthetics Guidelines
Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
Spatial Composition: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
Backgrounds & Visual Details: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.
NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

IMPORTANT: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

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

  // Helper: styleタグの内容に実際のCSSルールがあるかチェック
  const hasActualCss = (styleContent: string): boolean => {
    // コメントと空白を除去して、CSSルールがあるかチェック
    const withoutComments = styleContent.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    return /[a-zA-Z0-9\-_\.#\[\]:]+\s*\{/.test(withoutComments);
  };

  // Helper: scriptタグの内容に実際のJSコードがあるかチェック
  const hasActualJs = (scriptContent: string): boolean => {
    const withoutComments = scriptContent
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      .trim();
    return withoutComments.length > 0;
  };

  // CSS injection: 空のstyleタグや実質的なCSSがない場合は置き換え
  if (html && css) {
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (styleMatch) {
      if (!hasActualCss(styleMatch[1])) {
        // 空またはコメントのみのstyleタグを実際のCSSで置き換え
        html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/i, `<style>\n${css}\n</style>`);
      }
    } else {
      // styleタグがない場合は注入
      html = html.replace(/<\/head>/i, `  <style>\n${css}\n  </style>\n</head>`);
    }
  }

  // JavaScript injection: 空のscriptタグや実質的なJSがない場合は置き換え
  if (html && js) {
    const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    if (scriptMatch) {
      if (!hasActualJs(scriptMatch[1])) {
        // 空またはコメントのみのscriptタグを実際のJSで置き換え
        html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/i, `<script>\n${js}\n</script>`);
      }
    } else {
      // scriptタグがない場合は注入
      html = html.replace(/<\/body>/i, `  <script>\n${js}\n  </script>\n</body>`);
    }
  }

  // HTMLが見つからない場合は完全なドキュメントを作成
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
