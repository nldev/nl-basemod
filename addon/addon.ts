import { init } from './basemod/state'

init($ => {
  console.log('second')
})

console.log('first')



// const container = new Container($ => {
//   console.log($.playerInfo.name)
//   console.log($.playerInfo.chrClass)
//   console.log($.playerInfo.chrRace)
//   console.log($.playerInfo.level)
// })

