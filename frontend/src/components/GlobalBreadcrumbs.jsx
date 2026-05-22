import { useLocation } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";

// Routes where breadcrumbs should NOT show
const HIDE = ["/", "/login", "/register", "/admin", "/dashboard"];

export default function GlobalBreadcrumbs() {
  const { pathname } = useLocation();
  if (HIDE.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;
  return <Breadcrumbs />;
}
