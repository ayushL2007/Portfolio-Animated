import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  title: "Ayush Lahiri | Pixel Portfolio",
  description:
    "Explore Ayush Lahiri's portfolio as a 2D pixel Pokemon-style adventure.",
  authors: [{ name: "Ayush Lahiri" }],
};

export const viewport: Viewport = {
  themeColor: "#1a1c2c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pressStart.variable} ${vt323.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function checkScreenSize() {
                  if (window.innerWidth < 1000 || window.innerHeight < 650) {
                    // Create and style the notification overlay
                    var overlay = document.createElement('div');
                    overlay.id = 'redirect-overlay';
                    overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#1a1c2c;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;font-family:sans-serif;text-align:center;padding:20px;";
                    
                    overlay.innerHTML = "<div><h1 style='font-size:1.5rem;margin-bottom:1rem;'>Screen Too Small</h1><p style='margin-bottom:2rem;'>This pixel adventure requires a larger screen.<br/>Redirecting you to the mobile-friendly site...</p><div style='border:3px solid #fff;width:30px;height:30px;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;'></div></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>";
                    
                    document.documentElement.appendChild(overlay);

                    // Redirect after a brief delay so they can read the message
                    setTimeout(function() {
                      window.location.href = "https://ayush-uyj6.onrender.com/#home";
                    }, 3000); 
                  }
                }
                
                // Only run the check once on initial load to avoid redirecting 
                // while they are in the middle of a session unless absolutely necessary
                if (document.readyState === 'complete') {
                  checkScreenSize();
                } else {
                  window.addEventListener('load', checkScreenSize);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
