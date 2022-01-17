import { AssetOptions } from '../asset'
import { CREATE_DIRECT_SPELL_TASK, DEFAULT_DIRECT_SPELL_BASE, DEFAULT_SPELL_BASE, QUERY_DIRECT_SPELL } from '../constants'
import { SpellOptions } from '../spell'
import { Spell } from '../spell'
import { NWTask, TaskOptions, Template } from '../task'
// import { Duration, Queryable } from '../types'
// import { resolveDuration, resolveSpeed } from '../utils'

export interface DirectSpellTemplate extends Template {
  id: typeof CREATE_DIRECT_SPELL_TASK
  options: DirectSpellOptions
}

export interface DirectSpell extends Spell {
}

export type DirectSpellOptions = SpellOptions & {
}

export class CreateDirectSpell extends NWTask {
  static readonly id = CREATE_DIRECT_SPELL_TASK

  async process ({ options }: DirectSpellTemplate) {
    const $ = this.builder

    const spell = await $.Spell.add({
      ...options,
      base: options.base || DEFAULT_SPELL_BASE,
    })
  }
}

export interface CreateDirectSpellOptions extends TaskOptions {
  id: typeof CREATE_DIRECT_SPELL_TASK
}

