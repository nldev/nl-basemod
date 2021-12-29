import { CREATE_MODIFIER_TASK } from '../constants'
import { sql } from '../sql'
import { NWTask, TaskOptions, Template } from '../task'
import { AssetId } from '../types'

export type ModifierEffect = 0 | 1 | 2 | 3
export interface Modifier {
  modifier: AssetId
  modified: AssetId
  effect: ModifierEffect
  flags: number
}

export type ModifierOptions = Omit<Modifier, 'flags' | 'effect'> & {
  flags?: number
  effect?: ModifierEffect
}

export interface ModifierTemplate extends Template {
  id: typeof CREATE_MODIFIER_TASK
  options: ModifierOptions
}

export class CreateModifier extends NWTask {
  static readonly id = CREATE_MODIFIER_TASK

  async setup () {
    this.clean()
    this.init()
  }

  async process (template: ModifierTemplate) {
    this.builder.sql.Databases.world_dest.write(
      sql.modifiers.command.insert({
        ...template.options,
        modifier: typeof template.options.modifier === 'string'
          ? this.builder.Spell.get(template.options.modifier).asset.ID
          : template.options.modifier,
        modified: typeof template.options.modified === 'string'
          ? this.builder.Spell.get(template.options.modified).asset.ID
          : template.options.modified,
      })
    )
  }

  init () {
    this.builder.sql.Databases.world_dest.write(sql.modifiers.command.init())
  }

  clean () {
    this.builder.sql.Databases.world_dest.write(sql.modifiers.command.clean())
  }
}

export interface CreateModifierOptions extends TaskOptions {
  id: typeof CREATE_MODIFIER_TASK
}
