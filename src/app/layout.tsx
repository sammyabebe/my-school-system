// src/app/layout.tsx
import '../styles/globals.css'; // Changed from './styles/globals.css'
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'School Management System',
  description: 'A system for managing admins and students',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}