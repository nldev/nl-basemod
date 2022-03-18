import { std } from 'wow/wotlk'
import { Builder } from './basemod'
import { SpellOptions } from './basemod/spell'

new Builder($ => {
  $.ProcessMany<SpellOptions>({
    taskId: 'create-spell',
    list: [
      {
        id: 'a',
        needs: ['e'],
        data: {
          baseId: 233,
        },
      },
      {
        id: 'b',
        data: {
          baseId: 233,
        },
      },
      {
        id: 'c',
        needs: ['d'],
        data: {
          baseId: 233,
        },
      },
      {
        id: 'd',
        needs: ['a', 'b'],
        data: {
          baseId: 233,
        },
      },
      {
        id: 'e',
        needs: ['b'],
        data: {
          baseId: 233,
        },
      },
      {
        id: 'f',
        needs: ['c'],
        data: {
          baseId: 233,
        },
      },
    ],
  })

  $.Set('foo', 'bar', 'hello')

  console.log($.Get('spells.a.baseId'))
  console.log($.Get('spells'))

  throw new Error('complete')
})


