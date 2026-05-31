import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { ProjectProvider } from '@/context/ProjectContext';
import { ThemeProvider } from "@/components/theme-provider";
import Script from 'next/script';
import AgiRoot from '@/agi/components/AgiRoot';
import { AgiProvider } from '@/agi/context/AgiContext';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Aim pro 捷報 | 職人專屬的智能總部 - 最小規模，最強產能',
    template: '%s | Aim pro 捷報'
  },
  description: '跨界 Agi 職人團隊為您撐腰，告別單打獨鬥！您的 24H 全能專業合夥人，為您的專業價值提供最強大的後援。',
  keywords: ['AI 經營大腦', '職人智能總部', 'Agi 職人團隊', '虛擬合夥人', 'AI 估價', '自動化合約'],
  authors: [{ name: '捷報科技 Team' }],
  creator: '捷報科技',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://estimator.jiebao.tw',
    title: 'Aim pro 捷報 | 職人專屬的智能總部',
    description: '最小規模，最強產能。跨界 Agi 職人團隊為您撐腰，告別單打獨鬥～您的 24H 全能專業合夥人！',
    siteName: 'Aim pro 捷報',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Aim pro 捷報 - 職人專屬的智能總部',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aim pro 捷報 | 職人專屬的智能總部',
    description: '跨界 Agi 職人團隊為您撐腰，您的 24H 全能專業合夥人。',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 antialiased selection:bg-indigo-500/30">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ProjectProvider>
            <AgiProvider>
              {children}
              <Toaster richColors position="top-right" />
              {/* AGI 顧問室浮動 UI — Portal 層，處理渲染不影響其他元件 */}
              <AgiRoot />
            </AgiProvider>
          </ProjectProvider>
        </ThemeProvider>
        
        {/* Cloudflare Turnstile - Moved outside head and to the end of body */}
        <Script 
          src="https://challenges.cloudflare.com/turnstile/v0/api.js" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}
