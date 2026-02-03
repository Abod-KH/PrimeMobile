import "./globals.css";
import { Toaster } from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">
        <PageLoader />

        {/* Google Translate Widget */}
        {/* <div className="fixed top-4 right-4 z-50">
          <GoogleTranslate />
        </div> */}

        {children}

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
};

export default RootLayout;
