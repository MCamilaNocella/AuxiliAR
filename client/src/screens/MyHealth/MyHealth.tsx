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
import { isCardField, missingItems } from "@/utils/healthProfile"
import { useActiveProfile } from "./useActiveProfile"

/**
 * Mi Salud: greeting band on the home gradient with the profiles and Auxi inviting to complete the profile,
 * then the emergency record card and, beside it, how complete the profile is and what's recommended for the age.
 * Each missing piece of the card opens the card on that field; the rest (the location), Auxi's chat asking for it.
 * "Completar mi perfil" opens the chat asking for everything missing, one at a time. "Agregar familiar" opens a
 * small dialog for the name and age; the new profile shows right away. A relative's profile can be deleted (after
 * confirming); your own can't.
 */
export const MyHealth = () => {
  const { profiles, profile, activeId, setActiveId, updateProfile, addRelative, deleteProfile } = useActiveProfile()
  const [addingRelative, setAddingRelative] = useState(false)
  // The profile being deleted: kept, so the question doesn't change name while it fades out
  const [deleting, setDeleting] = useState<HealthProfile | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const missing = missingItems(profile)
  const pass = useRef<EmergencyPassHandle>(null)

  const completeWithAuxi = (fields: ProfileFieldKey[]) => helpChatStore.completeProfile({ profileId: profile.id, fields })

  const addField = (key: ProfileFieldKey) => (isCardField(key) ? pass.current?.edit(key) : completeWithAuxi([key]))

  return (
    <div className="page-container flex flex-col gap-8 pt-6 pb-10">
      <GreetingHero profiles={profiles} profile={profile} activeId={activeId} onSelect={setActiveId} onAddRelative={() => setAddingRelative(true)} bubble={missing.length > 0 && <NextStepBubble onStart={() => completeWithAuxi(missing.map(({ key }) => key))} />} />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-8">
        <div className="lg:self-start">
          {/* Keyed by profile: switching profiles drops a half-done edit */}
          <EmergencyPass ref={pass} key={profile.id} profile={profile} onSave={updateProfile} />
        </div>
        <ProfileRows profile={profile} onAddField={addField} />
      </div>
      {/* Your own profile can't be deleted from here, only relatives' */}
      <ProfileLinks
        onDelete={
          profile.own
            ? undefined
            : () => {
                setDeleting(profile)
                setConfirmOpen(true)
              }
        }
      />
      <ConfirmDialog
        open={confirmOpen}
        title={`¿Borrar el perfil de ${deleting?.name ?? ""}?`}
        message="Se van a borrar todos sus datos, también los de la ficha para emergencias. No se puede deshacer."
        confirmLabel="Sí, borrar"
        danger
        onConfirm={() => {
          setConfirmOpen(false)
          if (deleting) deleteProfile(deleting.id)
        }}
        onCancel={() => setConfirmOpen(false)}
      />
      <AddRelativeDialog
        open={addingRelative}
        onClose={() => setAddingRelative(false)}
        onAdd={(relative) => {
          addRelative(relative)
          setAddingRelative(false)
        }}
      />
    </div>
  )
}
