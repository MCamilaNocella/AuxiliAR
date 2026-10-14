import { RichText } from "../RichText"
import type { DataTableProps } from "./DataTable.types"

const CELL = "border-b border-line px-2 py-[0.55rem] align-top [overflow-wrap:anywhere] max-sm:border-0 max-sm:px-0 max-sm:py-[0.1rem]"

/** A table; on phones each row turns into a small stack (no header) */
export const DataTable = ({ head, rows }: DataTableProps) => (
  <table className="mt-3 w-full border-collapse text-[0.95rem]">
    <thead className="max-sm:hidden">
      <tr>
        {head.map((cell) => (
          <th key={cell} className="border-b-2 border-line-strong px-2 py-[0.4rem] text-left text-[0.8rem] tracking-[0.05em] text-muted uppercase">
            {cell}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, index) => (
        <tr key={index} className="max-sm:grid max-sm:border-b max-sm:border-line max-sm:py-2">
          {row.map((cell, k) => (
            <td key={k} className={`${CELL} ${k === 0 ? "font-extrabold" : ""}`}>
              <RichText text={cell} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)
