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
    const item: any = {
      id: template.id,
      taskId: template.taskId,
      needs: template.needs,
      data: {},
    }

    if (!template.data.baseId)
      item.data.baseId = DEFAULT_SPELL

    if (!template.data.isModify)
      item.data.isModify = false

    if (template.data.isModify) {
      item.data.asset = std.Spells.load(template.data.baseId || DEFAULT_SPELL)
    } else {
      item.data.asset = std.Spells.create($.Mod, template.id, template.data.baseId || DEFAULT_SPELL)
    }

    $.Set('spells', template.id, item)
  },
}

