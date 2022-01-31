import State from './basemod/state'
import { App } from './basemod/app'

const state = State()

state.app = new App()

const $ = state.app

// const container = new Container($ => {
//   console.log($.playerInfo.name)
//   console.log($.playerInfo.chrClass)
//   console.log($.playerInfo.chrRace)
//   console.log($.playerInfo.level)
// })

