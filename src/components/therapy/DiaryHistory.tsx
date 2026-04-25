
import React, { useMemo, useState } from "react";
import { getDiaryEntriesLocal } from "./DiaryLocal";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

function shortDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "2-digit" });
}

const emotionList = [
  { sentiment: "Feliz", emoji: "😊" },
  { sentiment: "Triste", emoji: "😢" },
  { sentiment: "Ansioso", emoji: "😰" },
  { sentiment: "Enojado", emoji: "😠" },
  { sentiment: "Neutro", emoji: "😐" },
];

const DiaryHistory: React.FC = () => {
  const [filter, setFilter] = useState<null | string>(null);
  const [dateFilter, setDateFilter] = useState("");
  const entries = useMemo(() => getDiaryEntriesLocal(), []);

  let filtered = entries;
  if (filter) filtered = filtered.filter(e => e.emotion === filter);
  if (dateFilter) filtered = filtered.filter(e => e.date.slice(0,10) === dateFilter);

  // Obtiene fechas únicas para filtro.
  const uniqueDates = Array.from(new Set(entries.map(e => e.date.slice(0,10))));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <span className="text-sm font-semibold mr-2">Filtrar por emoción:</span>
        {emotionList.map(e =>
          <Badge key={e.sentiment}
            onClick={()=>setFilter(f=>f===e.sentiment?null:e.sentiment)}
            className={`cursor-pointer ${filter===e.sentiment?"bg-blue-200 text-blue-800":"bg-muted"}`}>
              {e.emoji} {e.sentiment}
          </Badge>
        )}
        <Badge onClick={()=>setFilter(null)} className="cursor-pointer">Todas</Badge>
      </div>
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-semibold">Filtrar por fecha:</span>
        <select value={dateFilter}
          className="border px-2 py-1 rounded text-sm"
          onChange={e=>setDateFilter(e.target.value)}>
          <option value="">Todas</option>
          {uniqueDates.map(dateStr=>
            <option key={dateStr} value={dateStr}>{shortDate(dateStr)}</option>
          )}
        </select>
      </div>
      <div className="space-y-3">
        {filtered.length===0
          ?
          <div className="text-gray-400 text-center py-8">No hay entradas para esta selección</div>
          :
          filtered.map(entry =>
            <div key={entry.id}
              className="p-3 rounded-lg border flex flex-col bg-blue-50">
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-2xl">{entry.emoji}</span>
                <span className="font-medium">{entry.emotion}</span>
                <span className="ml-auto text-xs text-muted-foreground">{shortDate(entry.date)}</span>
              </div>
              <div className="mb-1 whitespace-pre-wrap">{entry.content}</div>
              <div className="text-xs text-muted-foreground italic">AI: {entry.summary}</div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default DiaryHistory;
