// Importing global CSS styles to ensure consistent styling across the application
import '@/styles/global.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Metadata object defining essential details of the application for better SEO and user understanding
export const metadata = {
  title: 'Card Poker', // Title of the application, displayed in browser tabs and search results
  description: 'A thrilling and immersive online card poker game experience.', // A brief description of the application's purpose and features
}

// The RootLayout component acts as the main wrapper for all other components in the application.
// This pattern is useful for applying consistent layout or styles across various pages or components.
export default function RootLayout({
  children 
}) {
  return (
    <html>
      <body className='bg-cover bg-[url("/bg.png")]'>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}