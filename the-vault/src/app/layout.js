import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '../components/Navbar';
import Footer from "./Footer.jsx";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <GoogleOAuthProvider clientId="475222485988-fttdbbrqem17ast0kkv9bbadgu1541ko.apps.googleusercontent.com">
          <Navbar />
          {children}
          <Footer />

        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
