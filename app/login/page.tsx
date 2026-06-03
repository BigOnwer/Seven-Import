import { Suspense } from "react";
import LoginContent from "./components/LoginContent";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
// renomeie o componente atual para LoginContent