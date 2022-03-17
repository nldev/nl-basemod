import { std } from 'wow/wotlk'
import { Builder } from './basemod'
import { SpellOptions } from './basemod/spell'

const $ = new Builder()

$.ProcessMany<SpellOptions>({
  id: 'create-spell',
  list: [
    {
      id: 'create-spell',
      needs: ['spells.pp'],
      data: {
        id: 'thing',
        baseId: 233,
      },
    },
    {
      id: 'create-spell',
      data: {
        id: 'pp',
        baseId: 233,
      },
    },
  ]
})

console.log($.Get('spells'))

throw new Error('complete')

