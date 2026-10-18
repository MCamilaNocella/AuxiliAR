import { ColorThemeSelector } from "@/components/accessibility/ColorThemeSelector"
import { Page } from "@/components/layout/Page"
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings"
import { BACKDROPS, LOGO_SKETCHES, SKETCH_FONTS_URL, THEME_BACKDROPS, THEME_LOGO_SKETCHES } from "./LogoSketches.constants"
import { HeaderAlignmentPreview } from "./LogoSketches.headerPreview"
import { HeaderStyleSelector, SketchCard } from "./LogoSketches.parts"

/** Logo options side by side, and the header's color (bordó or the theme's) to try them with. Only in development */
export const LogoSketches = () => {
  const { settings, update } = useAccessibilitySettings()

  return (
    <Page title="Bocetos de logo" description="Página de prueba, sin link en la web.">
      {/* The fonts of the "Tipografía" sketches: only this design page uses them (React puts the link in <head>) */}
      <link rel="stylesheet" href={SKETCH_FONTS_URL} precedence="default" />
      <section aria-labelledby="header-color" className="mb-8 flex flex-col gap-4 rounded-xl bg-card p-4">
        <div>
          <h2 id="header-color" className="m-0 text-xl font-extrabold text-brand">
            Color del header
          </h2>
          <p className="m-0 text-sm text-muted">Cambia el header de verdad (el de arriba) y queda guardado mientras navegás la app.</p>
        </div>
        <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
          <legend className="mb-2 p-0 text-xs font-bold tracking-widest text-muted uppercase">Header</legend>
          <HeaderStyleSelector />
        </fieldset>
        <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
          <legend className="mb-2 p-0 text-xs font-bold tracking-widest text-muted uppercase">Tema (el mismo de «Ver mejor»)</legend>
          <ColorThemeSelector value={settings.theme} onChange={(theme) => update({ theme })} />
        </fieldset>
      </section>

      <HeaderAlignmentPreview />

      <p className="mt-0 mb-6 rounded-xl bg-card p-4 font-bold">
        Tocá un boceto y aparece en el header de arriba (en toda la app). «Poppins alineada abajo» vuelve al logo de la página.
      </p>

      <h2 className="mt-0 mb-1 text-xl font-extrabold">Para el header según el tema</h2>
      <p className="mt-0 mb-4 text-sm text-muted">Los mismos colores en claro, oscuro y contraste alto: el logo no cambia con el tema.</p>
      <div className="mb-8 grid gap-4">
        {THEME_LOGO_SKETCHES.map((sketch) => (
          <SketchCard key={sketch.id} {...sketch} backdrops={THEME_BACKDROPS} />
        ))}
      </div>

      <h2 className="mt-0 mb-4 text-xl font-extrabold">Con la A argentina</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {LOGO_SKETCHES.map((sketch) => (
          <SketchCard key={sketch.id} {...sketch} backdrops={BACKDROPS} />
        ))}
      </div>
    </Page>
  )
}
