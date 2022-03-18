import { std } from 'wow/wotlk'
import { Spell as TSSpell } from 'wow/wotlk/std/Spell/Spell'
import { Task } from '.'
import { AssetOptions, Asset } from './types'
import { TitleCaseToDashCase } from './utils'

const DEFAULT_SPELL = 133 // fireball

export interface Spell extends Asset {
  asset: TSSpell
}

export interface SpellOptions extends AssetOptions {
  asset?: TSSpell
}

export interface CreateSpellConfig {}

export const CreateSpell: Task<SpellOptions, CreateSpellConfig> = {
  id: 'create-spell',
  identify: ($, config, options) => {
    if (!config.data.baseId)
      throw new Error('create-spell templates require a baseId to automatically assign ID')

    return TitleCaseToDashCase(std.Spells.load(config.data.baseId).Name.enGB.get())
  },
  setup: ($, config) => {},
  process: ($, template, config) => {
    const baseId = template.data.baseId || DEFAULT_SPELL
    const item: Spell = {
      baseId,
      id: template.id,
      isModify: (typeof template.data.isModify === 'boolean')
        ? template.data.isModify
        : false,
      asset: template.data.isModify
        ? std.Spells.load(baseId)
        : std.Spells.create($.Mod, template.id, baseId),
    }

    $.Set('spells', template.id, item)
  },
}

