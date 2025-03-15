import { LoginForm } from "./form";
import "./styles.css"; // Import the CSS file

export default function Page() {
  return (
    <div className="background flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
