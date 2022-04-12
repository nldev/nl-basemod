import { ItemTemplate as TSItem } from 'wow/wotlk/std/Item/ItemTemplate'
import { CLASS_MASKS, RACE_MASKS } from './constants'

import { CharacterClass, CharacterRace, Mapping } from './types'

export function Capitalize (string: string) {
  const words = string.split(' ')

  for (let i = 0; i < words.length; i++)
    words[i] = words[i][0].toUpperCase() + words[i].substr(1)

  return words.join(' ')
}

export function Dashify (string: string) {
  return string
    .replace(/[-|\s]+/g, '-')
    .replace(/[^-a-zA-Z0-9]/g,'')
    .toLowerCase()
}

export function Constantify (string: string) {
  return string.toUpperCase().replace(/-/g, '_')
}

export function Englishify (string: string) {
  return Capitalize(string.replace('-', ' '))
}

export function Gold (copper: number, silver: number, gold: number) {
  return copper + (silver * 100) + (gold * 100 * 100)
}

export function Speed (base: number, speed: number) {
  const multiplier = ((1 - base) / base) + 1

  return Math.abs(speed * multiplier)
}

export function RaceMask (...chrRaces: CharacterRace[]) {
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

export function ClassMask (...chrClasses: CharacterClass[]) {
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

// export function ItemSpellCount (asset: TSItem) {
//   let count = 0
//
//   if (asset.Spells.get(0).Spell.exists())
//     count++
//
//   if (asset.Spells.get(1).Spell.exists())
//     count++
//
//   if (asset.Spells.get(2).Spell.exists())
//     count++
//
//   if (asset.Spells.get(3).Spell.exists())
//     count++
//
//   if (asset.Spells.get(4).Spell.exists())
//     count++
//
//   return count
// }

