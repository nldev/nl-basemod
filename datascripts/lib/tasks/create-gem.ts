import { AssetOptions } from '../asset'
import { CREATE_GEM_TASK } from '../constants'
import { Item, ItemOptions } from '../item'
import { NWTask, TaskOptions, Template } from '../task'

export interface Gem extends Item {}

export type GemOptions = AssetOptions<Gem>

export interface MountTemplate extends Template {
  id: typeof CREATE_GEM_TASK
  options: GemOptions
}

export class CreateGem extends NWTask {
  static readonly id = CREATE_GEM_TASK

  process (template: MountTemplate) {
  }
}

export interface CreateGemOptions extends TaskOptions {
  id: typeof CREATE_GEM_TASK
}
