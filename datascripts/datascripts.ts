import { std } from 'wow/wotlk'
import { Builder } from './basemod'
import { SpellOptions } from './basemod/spell'

const $ = new Builder()

$.ProcessMany<SpellOptions>({
  taskId: 'create-spell',
  list: [
    {
      id: 'thing',
      needs: ['spells.pp'],
      data: {
        baseId: 233,
      },
    },
    {
      id: 'pp',
      data: {
        baseId: 233,
      },
    },
    {
      id: 'qq',
      needs: ['spells.pp'],
      data: {
        baseId: 233,
      },
    },
    {
      id: 'foo',
      needs: ['spells.thing', 'spells.qq'],
      data: {
        baseId: 233,
      },
    },
  ]
})

console.log($.Get('spells'))

throw new Error('complete')

