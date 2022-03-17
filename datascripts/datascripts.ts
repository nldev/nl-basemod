import { std } from 'wow/wotlk'
import { Builder } from './basemod'
import { SpellOptions } from './basemod/spell'

const $ = new Builder()

$.ProcessMany<SpellOptions>({
  taskId: 'create-spell',
  list: [
    {
      id: 'a',
      needs: ['spells.a'],
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
      needs: ['spells.b'],
      data: {
        baseId: 233,
      },
    },
    {
      id: 'd',
      needs: ['spells.a', 'spells.c'],
      data: {
        baseId: 233,
      },
    },
  ],
})

console.log($.Get('spells'))

throw new Error('complete')

