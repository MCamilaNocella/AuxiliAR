import { useRef, useState } from "react"
import { AddRelativeDialog } from "@/components/myHealth/AddRelativeDialog"
import { ConfirmDialog } from "@/components/myHealth/ConfirmDialog"
import { EmergencyPass, type EmergencyPassHandle } from "@/components/myHealth/EmergencyPass"
import { GreetingHero } from "@/components/myHealth/GreetingHero"
import { NextStepBubble } from "@/components/myHealth/NextStepBubble"
import { ProfileLinks } from "@/components/myHealth/ProfileLinks"
import { ProfileRows } from "@/components/myHealth/ProfileRows"
import { helpChatStore } from "@/stores/helpChatStore"
import type { HealthProfile, ProfileFieldKey } from "@/types/myHealth"
import { missingItems } from "@/utils/healthProfile"
import { PROFILE_FIELD_KEYS } from "@/data/myHealth"
import { useActiveProfile } from "./useActiveProfile"

/**
 * Mi Salud: greeting band on the home gradient with the profiles and Auxi inviting to complete the profile,
 * then the emergency record card and, beside it, how complete the profile is and what's recommended for the age.
 * Each missing piece opens the card in edit mode on that field.
 * "Completar mi perfil" opens the chat asking for everything missing, one at a time; once nothing is missing, the
 * bubble reminds to keep the profile up to date and "Actualizar mi perfil" asks for everything again. "Agregar familiar" opens a
 * small dialog for the name and age; the new profile shows right away. Any profile can be deleted (after confirming):
 * the next one shows, and with none left the screen stays empty at 0% and works the same (only the labels say
 * "Agregar perfil"): the profile is created with the first piece of data saved, on the card or with Auxi.
 */
export const MyHealth = () => {
  const { profiles, profile, empty, activeId, setActiveId, updateProfile, addProfile, deleteProfile } = useActiveProfile()
  const [addingRelative, setAddingRelative] = useState(false)
  // The profile being deleted: kept, so the question doesn't change name while it fades out
  const [deleting, setDeleting] = useState<HealthProfile | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const missing = missingItems(profile)
  const pass = useRef<EmergencyPassHandle>(null)

  const completeWithAuxi = (fields: ProfileFieldKey[]) => helpChatStore.completeProfile({ profileId: profile.id, fields })
  // Nothing missing: Auxi goes over everything again (except the name) to update it
  const updateWithAuxi = () =>
    helpChatStore.completeProfile({ profileId: profile.id, fields: PROFILE_FIELD_KEYS.filter((key) => key !== "name"), update: true })

  const addField = (key: ProfileFieldKey) => pass.current?.edit(key)

  return (
    <div className="page-container flex flex-col gap-8 pt-6 pb-10">
      <GreetingHero profiles={profiles} profile={profile} activeId={activeId} onSelect={setActiveId} onAddRelative={() => setAddingRelative(true)} bubble={
          <NextStepBubble
            step={empty ? "add" : missing.length > 0 ? "complete" : "update"}
            onStart={() => (missing.length > 0 ? completeWithAuxi(missing.map(({ key }) => key)) : updateWithAuxi())}
          />
        } />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-8">
        <div className="lg:self-start">
          {/* Keyed by profile: switching profiles drops a half-done edit */}
          <EmergencyPass ref={pass} key={profile.id} profile={profile} onSave={updateProfile} noProfile={empty} />
        </div>
        <ProfileRows profile={profile} empty={empty} onAddField={addField} />
      </div>
      <ProfileLinks
        onDelete={
          empty
            ? undefined
            : () => {
                setDeleting(profile)
                setConfirmOpen(true)
              }
        }
      />
      <ConfirmDialog
        open={confirmOpen}
        title={`¿Querés borrar el perfil de ${deleting?.name ?? ""}?`}
        message="Se van a borrar todos sus datos, también los de la ficha para emergencias. No se puede deshacer."
        confirmLabel="Borrar perfil"
        onConfirm={() => {
          setConfirmOpen(false)
          if (deleting) deleteProfile(deleting.id)
        }}
        onCancel={() => setConfirmOpen(false)}
      />
      <AddRelativeDialog
        open={addingRelative}
        title={empty ? "Agregar perfil" : "Agregar familiar"}
        onClose={() => setAddingRelative(false)}
        onAdd={(relative) => {
          addProfile(relative)
          setAddingRelative(false)
        }}
      />
    </div>
  )
}
