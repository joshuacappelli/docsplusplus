import { handlers } from "@/auth";

// Export the basic auth handlers
export const { GET, POST } = handlers;



// Configure which routes should be protected
export const config = {
    matcher: ["/auth/login", "/dashboard", "/protected-route"],
  };
