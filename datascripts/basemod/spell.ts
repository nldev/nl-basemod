import { Spell } from 'wow/wotlk/std/Spell/Spell'
import { Task } from '.'
import { Asset, AssetOptions } from './types'

export interface SpellOptions extends AssetOptions {
  asset?: Spell
}

export interface CreateSpellOptions extends SpellOptions {
  foo: 'bar'
  bar: 'baz'
  baz: 'hello'
}

export const CreateSpell: Task<SpellOptions, CreateSpellOptions> = {
  id: 'create-spell',
  setup: ($, options) => {
  },
  process: ($, template, options) => {
    console.log(template)
    // isModify ? load : create
    $.Set('spells', template.data.id, template.data)
    console.log($.Get('spells'))
  },
}

