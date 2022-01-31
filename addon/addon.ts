import { init, Get } from './basemod/state'
import { Frame } from './basemod/component'

init(() => {
  const $ = Get()
  console.log('second')
  console.log($.root.GetName())
  console.log('third')
  console.log('update')
  const frame = Frame()
  console.log(frame.GetName())
})

console.log('first')



// const container = new Container($ => {
//   console.log($.playerInfo.name)
//   console.log($.playerInfo.chrClass)
//   console.log($.playerInfo.chrRace)
//   console.log($.playerInfo.level)
// })

