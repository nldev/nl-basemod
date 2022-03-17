import { std } from 'wow/wotlk'
import { Builder } from './basemod'
import { SpellOptions } from './basemod/spell'

const $ = new Builder()

$.ProcessMany<SpellOptions>({
  id: 'create-spell',
  list: [
    {
      needs: ['spells.pp'],
      data: {
        id: 'thing',
        baseId: 233,
      },
    },
    {
      data: {
        id: 'pp',
        baseId: 233,
      },
    },
    {
      needs: ['spells.pp'],
      data: {
        id: 'qq',
        baseId: 233,
      },
    },
    {
      needs: ['spells.thing', 'spells.qq'],
      data: {
        id: 'foo',
        baseId: 233,
      },
    },
  ]
})

throw new Error('complete')

