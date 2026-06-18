import { redirect } from "next/navigation";

const AuthenticatedHomePage = () => {
  redirect("/dashboard");
};

export default AuthenticatedHomePage;
