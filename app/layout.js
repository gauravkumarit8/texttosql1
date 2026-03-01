import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Text to SQL Generator | Convert English to SQL Instantly",
  description: "Free AI Text to SQL tool. Convert natural language into PostgreSQL SQL queries instantly.",
  verification: {
    google: "8bff_rmm7f4UUOQ16NanNyAdzim0MYN0o7hW_HrEx7s"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
