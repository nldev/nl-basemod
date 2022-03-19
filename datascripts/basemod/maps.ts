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
  setup: ($, config) => {},
  process: ($, template, config) => {
    if (!template.data.baseId && template.data.isModify)
      throw new Error('create-map template cannot be isModify=true and baseId=null')
    const item: Map = {
      baseId: template.data.baseId || 0,
      id: template.id,
      isModify: (typeof template.data.isModify === 'boolean')
        ? template.data.isModify
        : false,
      asset: template.data.isModify
        ? std.Maps.load(template.data.baseId || 0)
        : std.Maps.create($.Mod, template.id),
    }

    const map = std.Maps.create($.Mod, 'dev').Directory.set('dev')

    map.Expansion.set(0)
    map.Name.enGB.set('Dev')
    map.TimeofDayOverride.set(0)

  // $.std.Maps.forEach(m => {
  //   if (m.Name.enGB.get() !== 'Outland')
  //     return
  // })
  //
  // $.std.Areas.forEach(a => {
  //   // console.log(a.Name.enGB.get(), ': ', a.Light.get())
  //   if (a.Name.enGB.get() !== 'Nagrand')
  //     return
  //
  //   a.Map.set(map.ID)
  //   a.Name.enGB.set('World')
  // })
  //
  // $.std.Lights.filter({}).forEach(l => {
  //   if (l.row.MapID.get() === 530) {
  //     l.row.MapID.set(map.ID)
  //     l.row.LightParamsID.get().forEach(ID => {
  //       // console.log(ID)
  //       if (ID) {
  //         const p = $.dbc.LightParams.query({ ID })
  //
  //         p.LightSkyboxID.set(553)
  //       }
  //     })
  //   }
  // })
  //}

    $.Set('maps', template.id, item)
  }
}

