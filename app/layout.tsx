import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";


const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">

        {children}


      <Toaster position="top-right" richColors/>
      </body>
    </html>
  );
}
