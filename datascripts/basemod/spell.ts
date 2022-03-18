import { std } from 'wow/wotlk'
import { Spell } from 'wow/wotlk/std/Spell/Spell'
import { Task } from '.'
import { AssetOptions } from './types'
import { TitleCaseToDashCase } from './utils'

export interface SpellOptions extends AssetOptions {
  asset?: Spell
}

export interface CreateSpellConfig {
  foo: 'bar'
  bar: 'baz'
  baz: 'hello'
}

export const CreateSpell: Task<SpellOptions, CreateSpellConfig> = {
  id: 'create-spell',
  identify: ($, config, options) => {
    if (!config.data.baseId)
      throw new Error('create-spell templates require a baseId to automatically assign ID')
    return TitleCaseToDashCase(std.Spells.load(config.data.baseId).Name.enGB.get())
  },
  setup: ($, config) => {},
  process: ($, template, config) => {
    let asset
    // isModify ? load : create
    $.Set('spells', template.id, template.data)
  },
}

