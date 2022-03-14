import { Spell } from 'wow/wotlk/std/Spell/Spell'
import { Builder } from './basemod'

const $ = new Builder()

const x = $.Get<Spell>('spells', 'fireball')


