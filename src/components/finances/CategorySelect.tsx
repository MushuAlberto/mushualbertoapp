import React from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Props {
  value: string | null;
  onChange: (categoryId: string | null) => void;
}

const UNCATEGORIZED_VALUE = "none";

const CategorySelect: React.FC<Props> = ({ value, onChange }) => {
  const [categories] = useLocalStorage<Category[]>('mushu_categories', []);

  const normalizedValue = value ?? UNCATEGORIZED_VALUE;

  return (
    <Select
      value={normalizedValue}
      onValueChange={(catId) => {
        if (catId === UNCATEGORIZED_VALUE) {
          onChange(null);
        } else {
          onChange(catId);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sin categoría" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={UNCATEGORIZED_VALUE}>Sin categoría</SelectItem>
        {categories.map(cat => (
          <SelectItem key={cat.id} value={cat.id}>
            <span style={{
              display: "inline-block",
              width: 10,
              height: 10,
              background: cat.color,
              borderRadius: "50%",
              marginRight: 6,
            }} />
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;