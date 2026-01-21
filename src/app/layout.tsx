import type {Metadata} from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/language-provider';
import BodyWrapper from './body-wrapper';


export const metadata: Metadata = {
  title: 'شركة مفتاح النيل للاستثمار والتجارة الدولية (ذ.م.م)',
  description: 'نظام إدارة الشحنات والمالية لشركة مفتاح النيل',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <BodyWrapper>{children}</BodyWrapper>
    </LanguageProvider>
  );
}
