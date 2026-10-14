export type AmountRow = { id?: string, value: string, unit?: string, who: string, text: string }

export type AmountRowsProps = {
  rows: AmountRow[]
}
