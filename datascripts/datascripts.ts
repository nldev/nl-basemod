import { std } from 'wow/wotlk'
import { Builder } from './basemod'

const $ = new Builder()

console.log(std.DBC.SpellItemEnchantment.findById(22).objectify())

throw Error

console.log('end')

