import { std } from 'wow/wotlk'
import { Builder } from './basemod'
import { SpellOptions } from './basemod/spell'

const $ = new Builder()

$.Process<SpellOptions>({
  data: {
    id: 'thing',
  },
  id: 'create-spell',
})
throw Error

console.log('end')

