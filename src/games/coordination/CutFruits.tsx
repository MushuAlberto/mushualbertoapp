
import React from "react";
import { Slice } from "lucide-react";

const CutFruitsGame: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-60 max-w-md mx-auto p-6 animate-fade-in w-full">
    <div className="flex items-center gap-2 mb-2">
      <Slice className="w-8 h-8 text-pink-700" />
      <h2 className="text-2xl font-bold text-pink-700">Cortar Frutas</h2>
    </div>
    <div className="text-pink-700 mb-2 font-semibold">
      Categoría: Coordinación
    </div>
    <div className="bg-pink-50 rounded-lg p-4 text-center shadow border border-pink-200 mb-4 w-full">
      <p>
        ¡Corta todas las frutas que puedas!
        <br />
        <span className="text-sm text-gray-500">
          (En breve podrás cortar frutas deslizándote velozmente con el mouse o dedo. ¡Supera 50 niveles de dificultad!)
        </span>
      </p>
      <img
        src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=120&fit=cover"
        alt="Frutas jugosas"
        className="rounded-lg mt-3 mx-auto shadow"
        loading="lazy"
      />
    </div>
    <div className="mt-2 text-gray-400 text-xs italic text-center">
      ¡Lo jugoso está por venir!
    </div>
  </div>
);

export default CutFruitsGame;
