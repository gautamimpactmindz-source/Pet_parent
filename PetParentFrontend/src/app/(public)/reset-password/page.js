import PageResetPasswordClient from "./PageResetPasswordClient";
import { Suspense } from "react";

export default function PageResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageResetPasswordClient />
    </Suspense>
  );
}
