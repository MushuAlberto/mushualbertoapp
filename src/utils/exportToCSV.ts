
/**
 * Exporta un array de objetos a CSV y descarga el archivo
 * @param data array de objetos (Tasks/Habits)
 * @param filename nombre a descargar
 */
export function exportToCSV<T>(data: T[], filename: string) {
  if (!data || !data.length) return;
  const keys = Object.keys(data[0]);
  const csv = [
    keys.join(','),
    ...data.map(row => keys.map(k => `"${("" + (row as any)[k])}"`).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
