import type { SealNoteProps } from "./SealNote.types"

/** The black octagon of the food labels ("EXCESO EN AZÚCARES") next to what it means. The seal is drawn as it is printed: black */
export const SealNote = ({ title, text }: SealNoteProps) => (
  <div className="flex flex-wrap items-center gap-6">
    <div
      aria-hidden="true"
      className="flex aspect-square w-22 shrink-0 items-center justify-center bg-[#111] p-[0.4rem] text-center text-[0.6rem] leading-[1.1] font-black text-[#f5f5f5] [clip-path:polygon(30%_0,70%_0,100%_30%,100%_70%,70%_100%,30%_100%,0_70%,0_30%)]"
    >
      <div>
        EXCESO EN<span className="block text-xs">AZÚCARES</span>
      </div>
    </div>
    <div className="min-w-0 flex-1 basis-[12rem]">
      <h3 className="m-0 mb-[0.35rem] text-[1.1rem] font-black">{title}</h3>
      <p className="m-0">{text}</p>
    </div>
  </div>
)
