
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarMushu from "@/components/AvatarMushu";
import { X, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const FloatingMushuWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="fixed z-50 right-4 bottom-24 md:bottom-28 flex flex-col items-end gap-2 pointer-events-none"
      // bottom-24 para estar arriba de la navbar, pointer-events-none fuera del widget (excepto el botón)
      style={{ minHeight: 70 }}
    >
      {/* Panel desplegable */}
      {open && (
        <div className="pointer-events-auto animate-fade-in bg-white/90 dark:bg-gray-900/90 shadow-2xl rounded-2xl px-5 py-4 mb-2 max-w-xs border border-yellow-100 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div className="flex gap-2 items-center">
              <AvatarMushu size={48} />
              <span className="font-semibold text-blue-900 dark:text-yellow-200 text-base">
                ¡Hola, soy Mushu! ¿Quieres checar tu estado de ánimo?
              </span>
            </div>
            <button
              className="ml-2 p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Cerrar"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          <button
            className={cn(
              "mt-4 flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white px-3 py-1.5 rounded-full text-sm hover:scale-105 transition-transform font-semibold shadow"
            )}
            onClick={() => {
              setOpen(false);
              navigate("/");
            }}
          >
            <Home size={16} />
            Ir a mi bienvenida
          </button>
        </div>
      )}

      {/* Botón flotante de Mushu */}
      <button
        className={cn(
          "pointer-events-auto relative rounded-full border-4 border-yellow-300 bg-white shadow-xl hover:scale-110 active:scale-100 transition-transform focus:outline-none overflow-visible flex items-center justify-center",
          open ? "ring-2 ring-yellow-400 scale-105" : ""
        )}
        style={{
          width: 64,
          height: 64,
          minWidth: 56,
          minHeight: 56,
          boxShadow: "0 4px 16px 0 rgb(0 0 0 / 10%)",
        }}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Cerrar widget de Mushu" : "Abrir widget de Mushu"}
      >
        <span
          className="absolute -inset-1 rounded-full border-4 border-yellow-300"
          style={{ boxShadow: "0 0 10px 2px #ffec80, 0 1px 10px #0002" }}
        />
        <AvatarMushu size={56} className="z-10" />
        <span className="absolute -top-2 -right-2 bg-yellow-400 rounded-full px-2 py-0.5 text-xs text-black shadow font-bold animate-pulse z-10">
          🐾
        </span>
      </button>
    </div>
  );
};

export default FloatingMushuWidget;
