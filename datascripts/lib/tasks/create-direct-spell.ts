import { AssetOptions } from '../asset'
import { CREATE_MOUNT_TASK, DEFAULT_MOUNT_NPC_BASE, QUERY_MOUNT_NPC } from '../constants'
import { NpcOptions } from '../npc'
import { Spell } from '../spell'
import { NWTask, TaskOptions, Template } from '../task'
import { Duration, Queryable } from '../types'
import { resolveDuration, resolveSpeed } from '../utils'

export interface MountTemplate extends Template {
  id: typeof CREATE_MOUNT_TASK
  options: MountOptions
}

export interface Mount extends Spell {
}

export type MountOptions = AssetOptions<Mount>

export class CreateMount extends NWTask {
  static readonly id = CREATE_MOUNT_TASK

  async process (template: MountTemplate) {
  }
}

export interface CreateMountOptions extends TaskOptions {
  id: typeof CREATE_MOUNT_TASK
}
