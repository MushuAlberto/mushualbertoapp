import React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, User } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import AvatarMushu from "@/components/AvatarMushu";

type JournalEntry = Tables<"journal_entries">;

interface JournalEntryListProps {
  entries: JournalEntry[];
  loading: boolean;
}

const JournalEntryList: React.FC<JournalEntryListProps> = ({ entries, loading }) => (
  <>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Entradas Recientes
        <Badge variant="secondary">{entries.length}</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-100 mb-3">
        {loading ? (
          <div className="text-center text-sm text-gray-400">Cargando...</div>
        ) : entries.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            Aún no tienes entradas en tu diario.<br />Comienza escribiendo lo que quieras compartir.
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="flex mt-2 items-start gap-2">
              <div className="w-8 flex-shrink-0 flex justify-center pt-1">
                {entry.title === "Respuesta IA" ? (
                  <AvatarMushu size={24} />
                ) : (
                  <User className="h-5 w-5 text-blue-400" />
                )}
              </div>
              <div
                className={`
                  flex-1 rounded-lg px-4 py-2
                  ${entry.title === "Respuesta IA"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-blue-50 text-gray-800"}
                `}
              >
                <div className="whitespace-pre-wrap">{entry.content}</div>
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {entry.created_at && (new Date(entry.created_at)).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </CardContent>
  </>
);

export default JournalEntryList;
