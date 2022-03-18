import { std } from 'wow/wotlk'
import { CreatureTemplate as TSNpc } from 'wow/wotlk/std/Creature/CreatureTemplate'
import { Task } from '.'
import { AssetOptions, Asset } from './types'
import { TitleCaseToDashCase } from './utils'

const DEFAULT_NPC = 705 // ragged young wolf

export interface Npc extends Asset {
  asset: TSNpc
}

export interface NpcOptions extends AssetOptions {
  asset?: TSNpc
}

export interface CreateNpcConfig {}

export const CreateNpc: Task<NpcOptions, CreateNpcConfig> = {
  id: 'create-npc',
  identify: ($, config, options) => {
    if (!config.data.baseId)
      throw new Error('create-cnpc templates require a baseId to automatically assign ID')

    return TitleCaseToDashCase(std.CreatureTemplates.load(config.data.baseId).Name.enGB.get())
  },
  setup: ($, config) => {},
  process: ($, template, config) => {
    const item: Npc = {
      id: template.id,
      baseId: template.data.baseId || DEFAULT_NPC,
      isModify: (typeof template.data.isModify === 'boolean')
        ? template.data.isModify
        : false,
      asset: template.data.isModify
        ? std.CreatureTemplates.load(template.data.baseId || DEFAULT_NPC)
        : std.CreatureTemplates.create($.Mod, template.id, template.data.baseId || DEFAULT_NPC),
    }

    $.Set('npcs', template.id, item)
  },
}

