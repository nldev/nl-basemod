import { std } from 'tswow-stdlib'
import { Achievement as TSAchievement } from 'tswow-stdlib/Achievement/Achievement'
import { ItemTemplate as TSItem } from 'tswow-stdlib/Item/ItemTemplate'
import { Spell as TSSpell } from 'tswow-stdlib/Spell/Spell'
import { loc_constructor } from 'wotlkdata/wotlkdata/primitives'

import { AssetType, TSAsset } from './asset'
import { ASSET_TYPE, DEFAULT_ICON_SPELL_BASE, ITEM_SPELL_TRIGGERS, UNNAMED } from './constants'
import { Duration, ItemSpellTrigger, TSText } from './types'

export const noop = () => {}

export const identity = <T>(x: T) => x

export function isNil<T> (input?: T) {
  if (typeof input === 'undefined')
    return true

  if (input === null)
    return true

  return false
}

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

export function dashCaseToTitleCase (string: string) {
  return capitalize(string.replace('-', ' '))
}

export function localeify (text: TSText): loc_constructor {
  if (typeof text === 'string')
    return { enGB: text }

  // FIXME: build out a mapper from LocSystem to loc_constructor
  // if (text instanceof LocSystem)
  if (text.enGB)
    return { enGB: text.enGB.get() }

  return text
}

export function englishify (text: TSText): string {
  if (typeof text === 'string')
    return text

  // FIXME
  // if (text instanceof LocSystem)
  if (text.enGB)
    return text.enGB.get()

  return text.enGB ? text.enGB : ''
}

export const times = function * (amount: number = 1) {
  for (let i = 1; i < amount; i++)
    yield i
}

let spell_id = 0
let item_id = 0
let npc_id = 0
let other_id = 0

export function NextId (type: AssetType) {
  switch (type) {
    case ASSET_TYPE.SPELL:
      spell_id += 1

      return `${UNNAMED}-${spell_id}`
    case ASSET_TYPE.ITEM:
      item_id += 1

      return `${UNNAMED}-${item_id}`
    case ASSET_TYPE.NPC:
      npc_id += 1

      return `${UNNAMED}-${npc_id}`
    default:
      other_id += 1

      return `${UNNAMED}-${other_id}`
  }
}

export function RandomId (length: number = 8) {
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  const charactersLength = characters.length

  let result = ''

  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength))

  return result
}

export function resolveIcon (asset: TSAsset) {
  if (asset instanceof TSAchievement)
    return asset.Icon.get()

  if (asset instanceof TSItem)
    return asset.DisplayInfo.getRef().Icon.get()

  if (asset instanceof TSSpell)
    return asset.Icon.get() || 200

  return std.Spells.load(DEFAULT_ICON_SPELL_BASE).Icon.get()
}

export function resolveDuration (input: Duration = 0) {
  // seconds
  if (typeof input === 'number')
    return input * 1000

  let sum = 0

  if (input[0])
    sum += input[0] * 1000

  // minutes
  if (input[1])
    sum += input[1] * 1000 * 60

  // hours
  if (input[2])
    sum += input[2] * 1000 * 60 * 60

  // days
  if (input[3])
    sum += input[3] * 1000 * 60 * 60 * 24

  // weeks
  if (input[3])
    sum += input[3] * 1000 * 60 * 60 * 24 * 7

  return sum
}

// FIXME: convert for type / interface
export function resolveGold (copper: number = 0, silver: number = 0, gold: number = 0) {
  return copper + (silver * 100) + (gold * 100 * 100)
}

// FIXME: convert for type / interface
export function resolveSpeed (base: number, speed: number) {
  const multiplier = ((1 - base) / base) + 1

  return Math.abs(speed * multiplier)
}

export function ItemSpellTrigger (trigger?: ItemSpellTrigger) {
  switch (trigger) {
    case ITEM_SPELL_TRIGGERS.ON_USE:
      return 0
    case ITEM_SPELL_TRIGGERS.ON_USE_NO_DELAY:
      return 5
    case ITEM_SPELL_TRIGGERS.CHANCE_ON_HIT:
      return 2
    case ITEM_SPELL_TRIGGERS.SOULSTONE:
      return 4
    case ITEM_SPELL_TRIGGERS.LEARN_SPELL:
      return 6
    case ITEM_SPELL_TRIGGERS.ON_EQUIP:
    default:
      return 1
  }
}

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

