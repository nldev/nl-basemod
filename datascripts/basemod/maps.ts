import { std } from 'wow/wotlk'
import { Map as TSMap } from 'wow/wotlk/std/Map/Map'
import { Builder } from '.'

interface Template {
  id: string
  baseId: number
  isModify: boolean
  name: string
  asset?: TSMap
  timeOfDay?: number
}

const TEMPLATES: Template[] = [
]

function run ($: Builder) {
  for (let template of TEMPLATES) {
    const map = template.isModify
      ? std.Maps.load(template.baseId || 0)
      : std.Maps.create($.Mod, template.id)

    map.Name.enGB.set(template.name)
    map.Expansion.set(0)
    map.Directory.set(template.id)

    if (typeof template.timeOfDay === 'number')
      map.TimeofDayOverride.set(template.timeOfDay)
  }
}

export function Maps ($: Builder) {
  run($)
}

