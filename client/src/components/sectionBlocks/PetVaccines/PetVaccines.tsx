import { Info } from "lucide-react"
import { blockIcon } from "@/utils/blockIcons"
import { BlockTabs } from "../BlockTabs"
import { RichText } from "../RichText"
import type { PetVaccinesProps } from "./PetVaccines.types"

const CELL = "border-t border-line-strong py-[0.7rem] pr-3 align-top max-sm:border-0 max-sm:py-[0.1rem] max-sm:pr-0"

/** The vaccination calendar of dogs and cats: one tab per species, a table by stage (puppy, adult) and its notes */
export const PetVaccines = ({ species }: PetVaccinesProps) => (
  <BlockTabs
    label="Perros o gatos"
    tabs={species.map(({ label, icon, rows, notes = [] }) => ({
      label,
      icon: blockIcon(icon),
      content: (
        <div>
          <table className="mt-3 w-full border-collapse">
            <thead className="max-sm:hidden">
              <tr>
                {["Cuándo", "Vacuna", "Cómo"].map((heading) => (
                  <th key={heading} className="pr-3 pb-2 text-left text-[0.8rem] font-extrabold tracking-[0.05em] text-muted uppercase">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) =>
                "group" in row ? (
                  <tr key={index}>
                    <th colSpan={3} scope="colgroup" className="pt-[1.1rem] pb-[0.4rem] text-left text-[0.95rem] font-black text-(--category-accent)">
                      {row.group}
                    </th>
                  </tr>
                ) : (
                  <tr key={index} className="max-sm:grid max-sm:border-t max-sm:border-line-strong max-sm:py-[0.6rem]">
                    <td className={`${CELL} font-black text-brand sm:whitespace-nowrap`}>{row[0]}</td>
                    <td className={`${CELL} font-black`}>{row[1]}</td>
                    <td className={CELL}>
                      <RichText text={row[2]} />
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
          {notes.map((note) => (
            <p key={note} className="m-0 mt-2 flex gap-2 text-[0.925rem] text-ink-soft">
              <Info aria-hidden="true" className="mt-[0.15rem] size-[1.25em] shrink-0 text-brand" />
              <span>
                <RichText text={note} />
              </span>
            </p>
          ))}
        </div>
      ),
    }))}
  />
)
