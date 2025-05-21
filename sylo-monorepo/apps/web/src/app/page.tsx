import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the main dashboard if authenticated, otherwise to login
  // In a real implementation, we would check the authentication status
  redirect("/login");
  
  // This code won't be reached due to the redirect
  return null;
}