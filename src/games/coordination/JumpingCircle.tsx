
import React from "react";
import { CircleDashed } from "lucide-react";

const JumpingCircleGame: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-60 max-w-md mx-auto p-6 animate-fade-in w-full">
    <div className="flex items-center gap-2 mb-2">
      <CircleDashed className="w-8 h-8 text-indigo-700" />
      <h2 className="text-2xl font-bold text-indigo-700">Círculo saltarín</h2>
    </div>
    <div className="text-indigo-700 mb-2 font-semibold">
      Categoría: Coordinación
    </div>
    <div className="bg-indigo-50 rounded-lg p-4 text-center shadow border border-indigo-200 mb-4 w-full">
      <p>
        ¡Atento al círculo saltarín!
        <br />
        <span className="text-sm text-gray-500">
          (Próximamente tendrás que hacer clic/tocar el círculo antes de que desaparezca. ¡Serán 50 niveles cada vez más rápidos!)
        </span>
      </p>
      <div className="flex items-center justify-center mt-3">
        <span className="rounded-full shadow-lg bg-indigo-400 w-16 h-16 animate-pulse"></span>
      </div>
    </div>
    <div className="mt-2 text-gray-400 text-xs italic text-center">
      ¡Muy pronto necesitarás reflejos de ninja!
    </div>
  </div>
);

export default JumpingCircleGame;
