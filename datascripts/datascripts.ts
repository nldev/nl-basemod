import { std } from 'wow/wotlk'
import { Builder, Template } from './basemod'
import { Talent, TalentOptions } from './basemod/talents'
import { Mapping } from './basemod/types'
import { TALENTS } from './config/talents'

new Builder($ => {
  $.ProcessMany<TalentOptions>(TALENTS)

  console.log(
    $.Get<Mapping<Talent>>('talents')
  )

  throw new Error('complete')
})

