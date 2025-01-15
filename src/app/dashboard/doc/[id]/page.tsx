"use client"

import { useParams } from "next/navigation";

export default function EditDocPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Edit Document</h1>
      <p>Editing document with ID: {id}</p>
      {/* Add your editing form here */}
    </div>
  );
}
