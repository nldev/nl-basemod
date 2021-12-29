import { CREATE_SPELL_TASK } from '../constants'
import { SpellOptions } from '../spell'
import { NWTask, TaskOptions, Template } from '../task'

export interface SpellTemplate extends Template {
  id: typeof CREATE_SPELL_TASK
  options: SpellOptions
}

export class CreateSpell extends NWTask {
  static readonly id = CREATE_SPELL_TASK

  async process (template: Template<SpellOptions, typeof CREATE_SPELL_TASK>) {
    await this.builder.Spell.add(template.options)
  }
}

export interface CreateSpellOptions extends TaskOptions {}
