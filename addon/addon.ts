import { GetContainer } from './basemod/state'
// import { Container } from './basemod/container'

// state.container = new Container()
//
//
const $ = GetContainer()
console.log($.root.GetName())

// const container = new Container($ => {
//   console.log($.playerInfo.name)
//   console.log($.playerInfo.chrClass)
//   console.log($.playerInfo.chrRace)
//   console.log($.playerInfo.level)
// })

