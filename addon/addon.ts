import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  const a = Frame()
    .Size(500, 500)
    .Backdrop()
    .Point('CENTER')
    .Padding(10)
    .Execute(() => console.log('ran'))
    .Z(5)
    .Drag('RightButton')


  Scroll({ name: 'bar' })
    .Parent(a.ref)
    .AllPoints(a.ref)
    .Size(600, 600)
    .Z(6)
    .Click('LeftButton', () => console.log($.playerInfo.name))
})

