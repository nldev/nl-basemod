import { std } from 'wow/wotlk'
import { Builder, Template } from './basemod'
import { Talent, TalentOptions } from './basemod/talents'
import { TALENTS } from './config/talents'
import { AUTOLEARN } from './config/autolearn'
import { Autolearn } from './basemod/autolearn'

new Builder($ => {
  $.ProcessMany<TalentOptions>(TALENTS)
  $.ProcessMany<Autolearn>(AUTOLEARN)

  console.log($.Get<Autolearn[]>('autolearn'))
})

