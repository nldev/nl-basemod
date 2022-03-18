import { std } from 'wow/wotlk'
import { Builder, Template } from './basemod'
import { Talent, TalentOptions } from './basemod/talents'
import { Mapping } from './basemod/types'
import { TALENTS } from './config/talents'

new Builder($ => {
  $.ProcessMany<TalentOptions>(TALENTS)
  console.log(std.Spells.load(2836).objectify())

  console.log(std.Spells.load($.Get<Talent>('talents.improved-gouge').spellId).objectify())
})

