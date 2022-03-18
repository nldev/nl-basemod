import { Builder } from './basemod'
import { TalentOptions } from './basemod/talents'
import { Autolearn } from './basemod/autolearn'
import { TALENTS } from './config/talents'
import { AUTOLEARN } from './config/autolearn'
import { std } from 'wow/wotlk'

new Builder($ => {
  $.ProcessMany<TalentOptions>(TALENTS)
  $.ProcessMany<Autolearn>(AUTOLEARN)

  console.log($.Get<Autolearn[]>('autolearn'))
})

