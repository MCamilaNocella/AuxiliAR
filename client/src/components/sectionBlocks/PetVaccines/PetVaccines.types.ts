export type PetVaccineRow = [string, string, string] | { group: string }

export type PetVaccinesProps = {
  species: { label: string, icon?: string, rows: PetVaccineRow[], notes?: string[] }[]
}
