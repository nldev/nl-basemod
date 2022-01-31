import { init, Get } from './basemod/app'
import { Frame } from './basemod/component'

init($ => {
  const frame = Frame()

  console.log(frame)
})

// const container = new Container($ => {
//   console.log($.playerInfo.name)
//   console.log($.playerInfo.chrClass)
//   console.log($.playerInfo.chrRace)
//   console.log($.playerInfo.level)
// })

