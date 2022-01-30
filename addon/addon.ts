import { Container } from './lib/container'

new Container($ => {
  console.log($.playerInfo.name)
  console.log($.playerInfo.chrClass)
  console.log($.playerInfo.chrRace)
  console.log($.playerInfo.level)
})

