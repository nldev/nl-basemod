import Global from './basemod/global'
import { App } from './basemod/app'

const $ = Global()

$.app = new App()

// const container = new Container($ => {
//   console.log($.playerInfo.name)
//   console.log($.playerInfo.chrClass)
//   console.log($.playerInfo.chrRace)
//   console.log($.playerInfo.level)
// })

