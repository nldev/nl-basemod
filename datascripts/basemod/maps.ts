import { std } from 'wow/wotlk'
import { Map as TSMap } from 'wow/wotlk/std/Map/Map'
import { Task } from '.'
import { AssetOptions, Asset } from './types'
import { TitleCaseToDashCase } from './utils'

const DEFAULT_MAP = 0

export interface Map extends Asset {
  asset: TSMap
}

export interface MapOptions extends AssetOptions {
  asset?: TSMap
}

export interface CreateMapConfig {
  // isPrefix?: boolean
}

export const CreateMap: Task<MapOptions, CreateMapConfig> = {
  id: 'create-map',
  identify: ($, config, options) => {
    if (!config.data.baseId)
      throw new Error('create-map templates require a baseId to automatically assign ID')

    return TitleCaseToDashCase(std.Maps.load(config.data.baseId).Name.enGB.get())
  },
  setup: ($, config) => {},
  process: ($, template, config) => {
    const baseId = template.data.baseId || DEFAULT_MAP
    const item: Map = {
      baseId,
      id: template.id,
      isModify: (typeof template.data.isModify === 'boolean')
        ? template.data.isModify
        : false,
      asset: template.data.isModify
        ? std.Maps.load(baseId)
        : std.Maps.create($.Mod, template.id),
    }

    $.Set('maps', template.id, item)
  },
}

