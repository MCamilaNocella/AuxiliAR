export type Trainer = { logo: string, name: string, where: string, url: string }

export type TrainersProps = {
  items: Trainer[]
  /** Small title over the cards */
  listTitle?: string
  /** A paragraph after the cards */
  after?: string
}
