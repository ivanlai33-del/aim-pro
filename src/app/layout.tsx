import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { ProjectProvider } from '@/context/ProjectContext';
import { ThemeProvider } from "@/components/theme-provider";
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Aim pro 捷報 AI 職人智能總部 | 全球職人智庫 x 智能經營總部',
    template: '%s | Aim pro 捷報'
  },
  description: '專為職人打造的 AI 虛擬總部。深度整合全球跨領域專家大腦與法務、財務、稅務基因，為您的專業價值提供最強大的後援。',
  keywords: ['AI 經營大腦', '全球專家矩陣', '職人法務財務稅務', '虛擬總部', 'AI 估價', '自動化合約'],
  authors: [{ name: '捷報科技 Team' }],
  creator: '捷報科技',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://estimator.jiebao.tw',
    title: '捷報 Estimator Pro | 30秒生成專業報價',
    description: '告別熬夜寫報價單！專業職人的 AI 智能接案系統，自動生成合約與財務規劃。',
    siteName: '捷報 Estimator Pro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '捷報 Estimator Pro - AI 智能接案系統',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '捷報 Estimator Pro | AI 智能接案估價系統',
    description: '30 秒生成精準報價、合約與執行企劃。',
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
            {children}
            <Toaster richColors position="top-right" />
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
