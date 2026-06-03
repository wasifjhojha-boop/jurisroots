import "@/App.css";
import "@/index.css"

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import GlobalBreadcrumbs from "@/components/GlobalBreadcrumbs";
import Home from "@/pages/Home";
// import Services from "@/pages/Services";
import Coverage from "@/pages/Coverage";
import CityPage from "@/pages/CityPage";
import Process from "@/pages/Process";
import Documents from "@/pages/Documents";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
// import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import CaseDetail from "@/pages/CaseDetail";
import Admin from "@/pages/Admin";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
// import Reviews from "@/pages/Reviews";
import Disclaimer from "@/components/Disclaimer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App flex flex-col min-h-screen bg-white">
          <Header />
          <GlobalBreadcrumbs />
          <main className="flex-1">
            <Routes>
        
            <Route path="/" element={<Home />} />
              {/* <Route path="/services" element={<Services />} /> */}
              <Route path="/coverage" element={<Coverage />} />
              <Route path="/coverage/:slug" element={<CityPage />} />
              <Route path="/process" element={<Process />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              {/* <Route path="/reviews" element={<Reviews />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/case/:id"
                element={
                  <ProtectedRoute>
                    <CaseDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <FloatingActions />
          <Disclaimer />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
