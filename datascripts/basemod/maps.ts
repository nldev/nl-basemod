import { std } from 'wow/wotlk'
import { Map as TSMap } from 'wow/wotlk/std/Map/Map'
import { Task } from '.'
import { AssetOptions, Asset } from './types'
import { TitleCaseToDashCase } from './utils'

const DEFAULT_MAP = 0

export interface Map extends Asset {
  name: string
  asset: TSMap
  timeofDay: number | null
}

export interface MapOptions extends AssetOptions {
  name: string
  asset?: TSMap
  timeOfDay?: number
}

export interface CreateMapConfig {
  // isPrefix?: boolean
}

export const CreateMap: Task<MapOptions, CreateMapConfig> = {
  id: 'create-map',
  setup: ($, config) => {},
  process: ($, template, config) => {
    if (!template.data.baseId && template.data.isModify)
      throw new Error('create-map template cannot be isModify=true and baseId=null')

    const asset = template.data.isModify
        ? std.Maps.load(template.data.baseId || 0)
        : std.Maps.create($.Mod, template.id)

    const item: Map = {
      asset,
      name: template.data.name || '',
      timeofDay: (typeof template.data.timeOfDay === 'number') ? template.data.timeOfDay : null,
      baseId: template.data.baseId || asset.ID,
      id: template.id,
      isModify: (typeof template.data.isModify === 'boolean')
        ? template.data.isModify
        : false,
    }

    item.asset.Name.enGB.set(template.data.name)
    item.asset.Expansion.set(0)
    item.asset.delete

    if (typeof template.data.timeOfDay === 'number')
      item.asset.TimeofDayOverride.set(template.data.timeOfDay)

    $.Set('maps', template.id, item)
  }
}

