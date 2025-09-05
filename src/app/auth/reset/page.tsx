import { Suspense } from "react";
import ResetForm from "./ResetForm";

export const revalidate = 0;            // évite SSG
export const dynamic = "force-dynamic"; // rendu dynamique

export default function ResetPage() {
  return (
    <Suspense fallback={<div className="container-wide py-16">Chargement…</div>}>
      <ResetForm />
    </Suspense>
  );
}
