'use client';

import { useParams } from 'next/navigation';

export default function TutorProfilePage() {
  const { tutorId } = useParams();

  return (
    <div>
      <h1 className="text-xl font-semibold">Tutor Profile</h1>
      <p>Tutor ID: {tutorId}</p>
    </div>
  );
}
