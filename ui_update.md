# UI 介面遷移指南 (Migration Guide)

本指南將協助您將目前的 "Modernize" UI 風格遷移至 Antigravity 專案。

## 1. 安裝必要套件 (Dependencies)

在您的 Antigravity 專案中，執行以下指令安裝 UI 所需的套件：

```bash
npm install clsx tailwind-merge lucide-react sonner recharts framer-motion
```

- `clsx` & `tailwind-merge`: 用於動態合併 Tailwind class。
- `lucide-react`: 專案使用的圖示庫。
- `sonner`: 漂亮的 Toast 通知元件。
- `recharts`: 用於繪製圖表。
- `framer-motion`: 用於動畫效果。

## 2. 設定 Tailwind CSS (Global Styles)

將以下內容複製到您的全域 CSS 檔案 (例如 `src/index.css` 或 `src/app/globals.css`)。這定義了所有的顏色變數、圓角與字型。

**注意：** 本專案使用 Tailwind CSS v4 的 `@theme` 語法。如果您使用的是 v3，請將變數設定在 `tailwind.config.ts` 中。

```css
@import "tailwindcss";

@theme {
  --font-sans: "Plus Jakarta Sans", "Inter", sans-serif;
  
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-success: var(--success);
  --color-border: var(--border);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  
  --radius-xl: 12px;
  --radius-2xl: 16px;
}

@layer base {
  :root {
    /* Light Mode 淺色模式 */
    --background: #F4F7FB;
    --foreground: #2A3547;
    --surface: #FFFFFF;
    --primary: #5D87FF;
    --primary-foreground: #FFFFFF;
    --success: #13DEB9;
    --border: #EAEFF4;
    --muted: #F8FAFC;
    --muted-foreground: #5A6A85;
  }

  .dark {
    /* Dark Mode 深色模式 */
    --background: #25293C;
    --foreground: #EAEFF4;
    --surface: #2F3349;
    --primary: #7367F0;
    --primary-foreground: #FFFFFF;
    --success: #13DEB9;
    --border: #33394D;
    --muted: #2F3349;
    --muted-foreground: #7C8FAC;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased transition-colors duration-300;
  }
}
```

## 3. 建立 Utility 工具函式

建立 `src/lib/utils.ts` 檔案 (如果目錄不存在請先建立)，用於合併 class 名稱：

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 4. 字型設定 (Fonts)

在您的 `index.html` 的 `<head>` 中加入 Google Fonts 連結，以支援 "Plus Jakarta Sans" 字型：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## 5. 關鍵元件結構 (Key Components)

### Sidebar (側邊欄)
將 `src/components/Sidebar.tsx` 複製到新專案。確保路徑引用正確 (例如 `@/lib/utils`)。

### Layout (版面配置)
參考 `src/app/dashboard/layout.tsx` 的結構：

```tsx
<div className="flex min-h-screen bg-background text-foreground font-sans">
  <Sidebar />
  <main className="flex-1 lg:ml-[280px] p-8 overflow-y-auto h-screen">
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* 頁面內容 */}
      <Outlet /> 
    </div>
  </main>
</div>
```

## 6. 使用範例 (Usage Example)

在您的元件中，使用定義好的語意化顏色變數：

```tsx
// 卡片範例
<div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
  <h2 className="text-lg font-bold text-foreground">標題</h2>
  <p className="text-muted-foreground">次要文字</p>
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl">
    按鈕
  </button>
</div>
```
