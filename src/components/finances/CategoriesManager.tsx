import React, { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast as sonnerToast } from "sonner";

interface Category {
  id: string;
  name: string;
  color: string;
}

const CategoriesManager: React.FC = () => {
  const [categories, setCategories] = useLocalStorage<Category[]>('mushu_categories', []);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#818cf8");
  const [editing, setEditing] = useState<Category | null>(null);

  const addCategory = () => {
    if (!newName.trim()) return;
    
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newName.trim(),
      color: newColor,
    };
    
    setCategories([...categories, newCategory]);
    setNewName("");
    setNewColor("#818cf8");
    sonnerToast.success("Categoría creada exitosamente.");
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
    setEditing(null);
    sonnerToast.success("Categoría actualizada exitosamente.");
  };

  const deleteCategory = (id: string) => {
    if (window.confirm("¿Eliminar categoría?")) {
      setCategories(categories.filter(cat => cat.id !== id));
      sonnerToast.success("Categoría eliminada exitosamente.");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Tus categorías</h3>
      <div className="mb-4 flex gap-2">
        <Input
          value={newName}
          placeholder="Nombre de categoría"
          onChange={e => setNewName(e.target.value)}
          className="w-40"
        />
        <input
          type="color"
          value={newColor}
          onChange={e => setNewColor(e.target.value)}
          className="w-10 h-10 p-0 border rounded cursor-pointer"
        />
        <Button onClick={addCategory} disabled={!newName.trim()}>
          <Plus className="w-4 h-4 mr-1" /> 
          Crear
        </Button>
      </div>
      
      <div className="space-y-2">
        {categories.length === 0 && <p>No tienes categorías aún. ¡Crea tu primera categoría!</p>}
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2 p-2 border rounded">
            {editing?.id === cat.id ? (
              <>
                <Input
                  value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="w-32"
                />
                <input
                  type="color"
                  value={editing.color}
                  onChange={e => setEditing({ ...editing, color: e.target.value })}
                  className="w-10 h-10 p-0 border rounded cursor-pointer"
                />
                <Button
                  size="sm"
                  onClick={() => updateCategory(editing)}
                  disabled={!editing.name.trim()}
                >
                  Guardar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Badge style={{ backgroundColor: cat.color, color: "#fff" }} className="min-w-[80px]">
                  {cat.name}
                </Badge>
                <Button size="icon" variant="ghost" onClick={() => setEditing(cat)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteCategory(cat.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesManager;