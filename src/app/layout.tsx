import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: "Country-page",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${beVietnamPro.className} antialiased`}
      >
        <div className=" h-[290px] flex justify-center relative">
        <Image alt=""src="/hero-image.jpg" fill className=" -z-10 object-cover  "   />
        <Link href="/" className=" flex items-center" ><Image alt=""src="/Logo.svg" width={200} height={100} className=""  /></Link>
      </div>
        {children}
      </body>
    </html>
  );
}
