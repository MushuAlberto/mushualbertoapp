
import React from "react";
import { Car, CircleDashed } from "lucide-react";

const RoadCarsGame: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-60 max-w-md mx-auto p-6 animate-fade-in w-full">
    <div className="flex items-center gap-2 mb-2">
      <Car className="w-8 h-8 text-green-700" />
      <h2 className="text-2xl font-bold text-green-800">Coches en la Carretera</h2>
    </div>
    <div className="text-green-700 mb-2 font-semibold">
      Categoría: Coordinación
    </div>
    <div className="bg-green-50 rounded-lg p-4 text-center shadow border border-green-200 mb-4 w-full">
      <p>
        ¡Pon a prueba tu coordinación!
        <br />
        <span className="text-sm text-gray-500">
          (Muy pronto podrás esquivar obstáculos moviendo los coches por la carretera. ¡Tendrás 50 niveles para completar!)
        </span>
      </p>
      <img
        src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=320&h=120&fit=cover"
        alt="Carretera"
        className="rounded-md mt-3 mx-auto w-full max-w-xs shadow"
        loading="lazy"
      />
    </div>
    <div className="mt-2 text-gray-400 text-xs italic text-center">
      ¡Pronto tendrás que reaccionar rápido y evitar choques!
    </div>
  </div>
);

export default RoadCarsGame;
