import { Builder } from './basemod'
import { SQLTable } from './basemod/types'
import { TalentOptions } from './basemod/talents'
import { Autolearn } from './basemod/autolearn'
import { Map, MapOptions } from './basemod/maps'
import { TABLES } from './config/tables'
import { TALENTS } from './config/talents'
import { AUTOLEARN } from './config/autolearn'
import { MAPS } from './config/maps'
import { std } from 'wow/wotlk'

new Builder($ => {
  $.ProcessMany<SQLTable>(TABLES)
  $.ProcessMany<TalentOptions>(TALENTS)
  $.ProcessMany<Autolearn>(AUTOLEARN)
  $.ProcessMany<MapOptions>(MAPS)

  console.log($.Get<Map[]>('maps'))
  console.log(std.DBC.SpellItemEnchantment.query({ ID: 22 }).objectify())
})


function RemoveFlagDropDebuff () {
  std.Spells.load(42792).delete()
}

function Settings () {
  RemoveFlagDropDebuff()
}

