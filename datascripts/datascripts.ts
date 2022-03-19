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

  const info = std.SQL.playercreateinfo.queryAll({})
  info.forEach(i => {
    i.map.set(726)
    i.position_x.set(16138)
    i.position_y.set(15957)
    i.position_z.set(2.031755)
    i.orientation.set(1)
  })
  console.log(std.DBC.SpellItemEnchantment.query({ ID: 22 }).objectify())
})


function RemoveFlagDropDebuff () {
  // flag drop debuff
  std.Spells.load(42792).delete()

  // honorless target
  std.Spells.load(2479).delete()
}

function Settings () {
  RemoveFlagDropDebuff()
}

