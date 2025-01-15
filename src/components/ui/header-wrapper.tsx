'use client'

import { Header1 } from "./header";
import { usePathname } from "next/navigation";

export function HeaderWrapper() {
  const pathname = usePathname();
  const hideHeaderPaths = ["/auth/login", "/auth/signup", "/dashboard"];
  
  if (hideHeaderPaths.includes(pathname)) {
    return null;
  }

  return (<Header1 />);
}