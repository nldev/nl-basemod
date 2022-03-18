import { std } from 'wow/wotlk'
import { Builder, Template } from './basemod'
import { Spell, SpellOptions } from './basemod/spell'

new Builder($ => {
  $.ProcessMany<SpellOptions>({
    taskId: 'create-spell',
    list: [
      {
        id: 'a',
        needs: ['e'],
        data: {
          baseId: 133,
        },
      },
      {
        id: 'b',
        data: {
          baseId: 133,
        },
      },
      {
        id: 'c',
        needs: ['d'],
        data: {
          baseId: 133,
        },
      },
      {
        id: 'd',
        needs: ['a', 'b'],
        data: {
          baseId: 133,
        },
      },
      {
        id: 'e',
        needs: ['b'],
        data: {
          baseId: 133,
        },
      },
      {
        id: 'f',
        needs: ['c'],
        data: {
          baseId: 133,
        },
      },
    ],
  })

  $.Set('foo', 'bar', 'hello')

  console.log($.Get<Template<Spell>>('spells.a').data.asset.objectify())
  console.log($.Get('spells'))

  throw new Error('complete')
})

