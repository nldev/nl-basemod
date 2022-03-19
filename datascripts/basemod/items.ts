import { std } from 'wow/wotlk'
import { ItemTemplate as TSItem } from 'wow/wotlk/std/Item/ItemTemplate'
import { Task } from '.'
import { AssetOptions, Asset } from './types'
import { TitleCaseToDashCase } from './utils'

const DEFAULT_ITEM = 2092 // worn dagger

export interface Item extends Asset {
  asset: TSItem
}

export interface ItemOptions extends AssetOptions {
  asset?: TSItem
}

export interface CreateItemConfig {}

export const CreateItem: Task<ItemOptions, CreateItemConfig> = {
  id: 'create-item',
  identify: ($, config, options) => {
    if (!config.data.baseId)
      throw new Error('create-item templates require a baseId to automatically assign ID')

    return TitleCaseToDashCase(std.Items.load(config.data.baseId).Name.enGB.get())
  },
  setup: ($, config) => {},
  process: ($, template, config) => {
    const baseId = template.data.baseId || DEFAULT_ITEM
    const item: Item = {
      baseId,
      id: template.id,
      isModify: (typeof template.data.isModify === 'boolean')
        ? template.data.isModify
        : false,
      asset: template.data.isModify
        ? std.Items.load(baseId)
        : std.Items.create($.Mod, template.id, baseId),
    }

    $.Set('items', template.id, item)
  },
}
