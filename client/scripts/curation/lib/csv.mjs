import { parse } from "csv-parse/sync"

/** CSV text → [{ rowNumber, fields }]. Row 1 of the file is the header, so the first record is row 2. The BOM is dropped */
export const parseCsv = (text) => {
  const records = parse(text, { columns: true, bom: true, skip_empty_lines: true, trim: false })
  return records.map((fields, index) => ({ rowNumber: index + 2, fields }))
}
