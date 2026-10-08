/** Verified highlights of a place or service ("24 h", "Demanda espontánea", "Atención gratuita") */
export const HighlightBadges = ({ items }: { items: string[] }) =>
  items.length === 0 ? null : (
    <ul role="list" aria-label="Destacados" className="m-0 flex list-none flex-wrap gap-2 p-0">
      {items.map((item) => (
        <li key={item} className="rounded-full border border-control-line bg-brand-soft px-2.5 py-0.5 text-sm font-bold text-brand">
          {item}
        </li>
      ))}
    </ul>
  )
