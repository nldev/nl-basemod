import { AssetOptions } from '../asset'
import { CREATE_ENCHANT_TASK } from '../constants'
import { Spell, SpellOptions } from '../spell'
import { NWTask, TaskOptions, Template } from '../task'

export interface Enchant extends Spell {}

export type EnchantOptions = AssetOptions<Enchant>

export interface MountTemplate extends Template {
  id: typeof CREATE_ENCHANT_TASK
  options: EnchantOptions
}

export class CreateEnchant extends NWTask {
  static readonly id = CREATE_ENCHANT_TASK

  async process (template: MountTemplate) {
  }
}

export interface CreatePetOptions extends TaskOptions {
  id: typeof CREATE_ENCHANT_TASK
}
