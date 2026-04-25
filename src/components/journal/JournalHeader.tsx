
import React from "react";
import AvatarMushu from "@/components/AvatarMushu";

const JournalHeader: React.FC = () => (
  <div className="text-center">
    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow">
      <AvatarMushu size={64} />
    </div>
    <h1 className="text-3xl font-bold text-gray-800 mb-1">Diario de Vida</h1>
    <p className="text-gray-500 mb-1">
      Escribe tus pensamientos y deja que <b>Mushu</b> (tu perro IA) converse y te aconseje.
    </p>
  </div>
);
export default JournalHeader;
