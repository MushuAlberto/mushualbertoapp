
import { Task } from "@/types";

/**
 * Exporta tareas a formato iCalendar (.ics)
 * @param tasks array de tareas (Task[])
 * @param filename nombre del archivo a descargar (recomendado: tareas.ics)
 */
export function exportToICS(tasks: Task[], filename: string = "tareas.ics") {
  if (!tasks || tasks.length === 0) return;
  const encode = (str: string) =>
    ("" + str).replace(/(\r\n|\r|\n)/g, "\\n").replace(/,/g, "\\,");
  // Construir contenido iCal
  let ics =
    "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID=MushuProductivity\nCALSCALE:GREGORIAN\n";
  for (const t of tasks) {
    // Si no tiene fecha límite, lo omitimos (no tiene sentido de evento en calendario)
    if (!t.dueDate) continue;
    const dtstart = t.dueDate.replace(/[-:]/g, "").slice(0, 15) + "Z"; // UTC
    // Usamos el mismo valor para dtend, evento puntual
    ics += `BEGIN:VEVENT
UID:${t.id}@mushuproductivity
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z
DTSTART:${dtstart}
DTEND:${dtstart}
SUMMARY:${encode(t.title)}
DESCRIPTION:${encode(t.description ?? "")}
STATUS:${t.status.toUpperCase()}
END:VEVENT
`;
  }
  ics += "END:VCALENDAR";
  // Descargar archivo
  const blob = new Blob([ics], { type: "text/calendar" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
