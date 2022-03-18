import { std } from 'wow/wotlk'
import { Builder, Template } from './basemod'
import { Spell, SpellOptions } from './basemod/spell'

new Builder($ => {
  $.ProcessMany<SpellOptions>({
    taskId: 'create-spell',
    list: [
      {
        data: {
          baseId: 133,
        },
      },
    ],
  })

  $.Set('foo', 'bar', 'hello')

  const s = $.Get<Spell>('spells.fireball').asset.objectify()
  console.log(s)

  throw new Error('complete')
})

