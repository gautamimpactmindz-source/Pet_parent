"use client"
import { Geist, Inter } from "next/font/google";

import 'swiper/css';
import 'swiper/css/navigation';
import "locomotive-scroll/dist/locomotive-scroll.css";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import PageWrapper from "@/components/page-wrapper/PageWrapper";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ToastContainer } from "react-toastify";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fontGeistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fontInter.variable} ${fontGeistSans.variable}`}>
        <Provider store={store}>
        

        <PageWrapper>
          <ToastContainer position="top-right"
          autoClose={5000}/>
          {children}



        </PageWrapper>


        </Provider>
      </body>
    </html>
  );
}
