import { redirect } from "next/navigation";

export default function RootPage() {
  // This tells Next.js: "When someone hits the home URL, 
  // immediately send them to the signup page."
  redirect("/signup"); 
}