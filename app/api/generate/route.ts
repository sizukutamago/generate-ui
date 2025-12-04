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

## Design Reference
以下のサイトを参考に、先進的でクリエイティブなWebデザインを実現してください：

- **Three.js** (https://threejs.org/): 3Dグラフィックス、WebGL表現の参考
- **Codrops** (https://tympanus.net/codrops/): 最先端のWebデザインチュートリアル、クリエイティブなUI/UXパターン、インタラクティブなエフェクト
- **GSAP Showcase** (https://gsap.com/showcase/): プロフェッショナルなアニメーション実装例
- **Awwwards** (https://www.awwwards.com/): 受賞歴のある革新的なWebデザイン

特にCodropsで紹介されているような、実験的でアーティスティックなページ遷移、ホバーエフェクト、スクロールアニメーション、テキストエフェクトを参考にしてください。

## Available Libraries (CDN)
以下のライブラリをCDN経由で利用できます。必要に応じて積極的に使用してください：

### 3D & Graphics
- **Three.js**: <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
- **p5.js**: <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>

### Animation
- **GSAP** (推奨): <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
- **GSAP ScrollTrigger**: <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
- **Anime.js**: <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
- **Lottie**: <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>

### Effects & Utilities
- **Particles.js**: <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
- **Chart.js**: <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
- **Splitting.js** (テキスト分割): <script src="https://unpkg.com/splitting/dist/splitting.min.js"></script>
- **Locomotive Scroll** (スムーススクロール): <script src="https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.js"></script>

GSAPは特に強力です。ScrollTriggerと組み合わせて、スクロール連動アニメーション、パララックス効果、要素の出現アニメーションなどを実装してください。

**重要**: ライブラリを使用する場合は、必ず対応するCDNスクリプトタグをHTMLの<head>または<body>内に含めてください。
例えば、Three.jsを使用する場合は以下のように記述：
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
スクリプトタグなしでライブラリを使用するとエラーになります。

## Design Thinking
Before coding, understand the context and commit to a BOLD aesthetic direction:

Purpose: What problem does this interface solve? Who uses it?
Tone: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, cyberpunk/neon, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
Constraints: Technical requirements (framework, performance, accessibility).
Differentiation: What makes this UNFORGETTABLE? What's the one thing someone will remember?
CRITICAL: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, Three.js, p5.js, etc.) that is:

Production-grade and functional
Visually striking and memorable
Cohesive with a clear aesthetic point-of-view
Meticulously refined in every detail

## Frontend Aesthetics Guidelines
Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
Motion & Animation: Use GSAP or Anime.js for complex animations. CSS animations for simple transitions. Focus on high-impact moments: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
3D & Creative Visuals: When appropriate, use Three.js for 3D scenes, particle systems, and immersive backgrounds. Use p5.js for generative art, creative coding, and interactive visualizations. These libraries can transform a simple page into an unforgettable experience.
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
- **外部ライブラリ（Three.js, GSAP, p5.js等）を使用する場合は、必ずCDNスクリプトタグを<head>内に含める**
  例: <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
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

  // CDN自動注入: ライブラリを使用しているがCDNタグがない場合に注入
  if (html) {
    const cdnMap: { pattern: RegExp; cdn: string }[] = [
      { pattern: /\bTHREE\./i, cdn: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js' },
      { pattern: /\bgsap\./i, cdn: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js' },
      { pattern: /\bScrollTrigger\./i, cdn: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js' },
      { pattern: /\banime\(/i, cdn: 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js' },
      { pattern: /\bp5\./i, cdn: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js' },
      { pattern: /\bparticlesJS\(/i, cdn: 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js' },
      { pattern: /\bChart\(/i, cdn: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js' },
      { pattern: /\blottie\./i, cdn: 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js' },
      { pattern: /\bSplitting\(/i, cdn: 'https://unpkg.com/splitting/dist/splitting.min.js' },
      { pattern: /\bLocomotiveScroll\(/i, cdn: 'https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.js' },
    ];

    const cdnsToInject: string[] = [];
    for (const { pattern, cdn } of cdnMap) {
      // ライブラリを使用しているがCDNタグが含まれていない場合
      if (pattern.test(html) && !html.includes(cdn)) {
        cdnsToInject.push(`<script src="${cdn}"></script>`);
      }
    }

    if (cdnsToInject.length > 0) {
      const cdnTags = cdnsToInject.join('\n    ');
      // </head>の前にCDNタグを注入
      if (html.includes('</head>')) {
        html = html.replace(/<\/head>/i, `    ${cdnTags}\n</head>`);
      } else if (html.includes('<body')) {
        // headがない場合はbodyの前に注入
        html = html.replace(/<body/i, `${cdnTags}\n<body`);
      }
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
