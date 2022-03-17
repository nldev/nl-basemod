import { Spell } from 'wow/wotlk/std/Spell/Spell'
import { Task } from '.'
import { Asset, AssetOptions } from './types'

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
  setup: ($, config) => {},
  process: ($, template, config) => {
    let asset
    // isModify ? load : create
    $.Set('spells', template.id, template.data)
  },
}

