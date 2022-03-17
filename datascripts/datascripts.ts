import { std } from 'wow/wotlk'
import { Builder } from './basemod'
import { SpellOptions } from './basemod/spell'

const $ = new Builder()

$.Process<SpellOptions>({
  id: 'create-spell',
  data: {
    id: 'thing',
  },
})
throw Error

console.log('end')

