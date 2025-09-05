// app/gpx/import/page.tsx
type PageProps = {
  searchParams?: { filename?: string };
};

export default function ImportGPXPage({ searchParams }: PageProps) {
  const filename = typeof searchParams?.filename === "string" ? searchParams.filename : undefined;

  return (
    <div className="prose">
      <h1>Import GPX</h1>
      <p>
        {filename
          ? `Fichier sélectionné : ${filename}`
          : "Sélectionnez un fichier via le bouton « Import GPX » dans le header."}
      </p>
    </div>
  );
}
