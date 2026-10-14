/** The digits to dial from a phone as the models write it ("4958-4783 int. 12", "(011) 2821-3638 / 4958-4783" → the first number) */
export const telOf = (phone: string) => phone.replace(/\(.*?\)/g, "").split(/[;,]| int\.| interno/)[0].replace(/[^\d]/g, "")
