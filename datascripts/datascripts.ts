import { std } from 'wow/wotlk'
import { Builder } from './basemod'
import { SpellOptions } from './basemod/spell'

const $ = new Builder()

$.ProcessMany<SpellOptions>({
  taskId: 'create-spell',
  list: [
    {
      id: 'a',
      needs: ['spells.e'],
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
      needs: ['spells.d'],
      data: {
        baseId: 233,
      },
    },
    {
      id: 'd',
      needs: ['spells.a', 'spells.b'],
      data: {
        baseId: 233,
      },
    },
    {
      id: 'e',
      needs: ['spells.b'],
      data: {
        baseId: 233,
      },
    },
  ],
})

console.log($.Get('spells'))

throw new Error('complete')

