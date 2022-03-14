import { ItemTemplate as TSItem } from 'wow/wotlk/std/Item/ItemTemplate'
import { CLASS_MASKS, RACE_MASKS } from './constants'

import { CharacterClass, CharacterRace, Mapping } from './types'

export const noop = () => {}

export function capitalize (string: string) {
  const words = string.split(' ')

  for (let i = 0; i < words.length; i++)
    words[i] = words[i][0].toUpperCase() + words[i].substr(1)

  return words.join(' ')
}

export function titleCaseToDashCase (string: string) {
  return string
    .replace(/[-|\s]+/g, '-')
    .replace(/[^-a-zA-Z0-9]/g,'')
    .toLowerCase()
}


export function dashCaseToConstantCase (string: string) {
  return string.toUpperCase().replace(/-/g, '_')
}

export function dashCaseToTitleCase (string: string) {
  return capitalize(string.replace('-', ' '))
}

// export function localeify (text: TSText): Localization {
//   if (typeof text === 'string')
//     return { enGB: text }
//
//   // FIXME: build out a mapper from LocSystem to Localization
//   // if (text instanceof LocSystem)
//   if (text.enGB)
//     return { enGB: text.enGB.get() }
//
//   return text
// }
//
// export function englishify (text: TSText): string {
//   if (typeof text === 'string')
//     return text
//
//   // FIXME
//   // if (text instanceof LocSystem)
//   if (text.enGB)
//     return text.enGB.get()
//
//   return text.enGB ? text.enGB : ''
// }

export function Gold (values: [number, number, number]) {
  const [copper, silver, gold] = values
  return copper + (silver * 100) + (gold * 100 * 100)
}

export function Speed (base: number, speed: number) {
  const multiplier = ((1 - base) / base) + 1

  return Math.abs(speed * multiplier)
}

// export function ItemSpellTrigger (trigger?: IST) {
//   switch (trigger) {
//     case ITEM_SPELL_TRIGGERS.ON_USE:
//       return 0
//     case ITEM_SPELL_TRIGGERS.ON_USE_NO_DELAY:
//       return 5
//     case ITEM_SPELL_TRIGGERS.CHANCE_ON_HIT:
//       return 2
//     case ITEM_SPELL_TRIGGERS.SOULSTONE:
//       return 4
//     case ITEM_SPELL_TRIGGERS.LEARN_SPELL:
//       return 6
//     case ITEM_SPELL_TRIGGERS.ON_EQUIP:
//     default:
//       return 1
//   }
// }

export function ItemSpellCount (asset: TSItem) {
  let count = 0

  if (asset.Spells.get(0).Spell.exists())
    count++

  if (asset.Spells.get(1).Spell.exists())
    count++

  if (asset.Spells.get(2).Spell.exists())
    count++

  if (asset.Spells.get(3).Spell.exists())
    count++

  if (asset.Spells.get(4).Spell.exists())
    count++

  return count
}

export function createRaceMask (...chrRaces: CharacterRace[]) {
  const used: Mapping<boolean> = {}

  let mask = 0

  for (let chrRace of chrRaces) {
    if (!used[chrRace]) {
      mask += RACE_MASKS[chrRace]
      used[chrRace] = true
    }
  }

  return mask
}

export function createClassMask (...chrClasses: CharacterClass[]) {
  const used: Mapping<boolean> = {}

  let mask = 0

  for (let chrClass of chrClasses) {
    if (!used[chrClass]) {
      mask += CLASS_MASKS[chrClass]
      used[chrClass] = true
    }
  }

  return mask
}

