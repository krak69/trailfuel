"use client";
import { useSearchParams } from "next/navigation";

export default function ImportGPXPage() {
  const q = useSearchParams();
  const filename = q.get("filename");
  return (
    <div className="prose">
      <h1>Import GPX</h1>
      <p>{filename ? `Fichier sélectionné : ${filename}` : "Sélectionnez un fichier via le header."}</p>
    </div>
  );
}
