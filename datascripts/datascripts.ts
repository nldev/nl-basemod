import { Builder } from './basemod'
import { TalentOptions } from './basemod/talents'
import { Autolearn } from './basemod/autolearn'
import { Map, MapOptions } from './basemod/maps'
import { TALENTS } from './config/talents'
import { AUTOLEARN } from './config/autolearn'
import { MAPS } from './config/maps'
import { std } from 'wow/wotlk'

new Builder($ => {
  $.ProcessMany<TalentOptions>(TALENTS)
  $.ProcessMany<Autolearn>(AUTOLEARN)
  $.ProcessMany<MapOptions>(MAPS)

  console.log($.Get<Map[]>('maps'))
})

