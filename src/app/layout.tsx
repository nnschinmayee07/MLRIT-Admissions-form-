import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MLRIT Admissions – Student Enrollment Form',
  description: 'Apply now for admission to Maturi Venkata Subba Rao (MVSR) Engineering College. Fill in your details for MLRIT student enrollment.',
  keywords: ['MLRIT', 'admissions', 'engineering', 'enrollment', 'Hyderabad', 'CSE', 'ECE', 'IT'],
  openGraph: {
    title: 'MLRIT Admissions – Student Enrollment',
    description: 'Join MLRIT — Apply for the 2025 batch across CSE, CSE AI/ML, IT, ECE, EEE, Mechanical and Civil Engineering.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
