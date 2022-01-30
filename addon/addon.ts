import { ROGUE } from './constants'
import { App } from './basemod/app'
import { foo } from './basemod/foo'

App()
console.log(foo[0])

console.log(ROGUE)

// const container = new Container($ => {
//   console.log($.playerInfo.name)
//   console.log($.playerInfo.chrClass)
//   console.log($.playerInfo.chrRace)
//   console.log($.playerInfo.level)
// })

