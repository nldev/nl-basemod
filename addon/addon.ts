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
    .Z(99)
    .Drag('RightButton')
    .Click('LeftButton', () => console.log($.playerInfo.name))


  Scroll({ name: 'bar', size: { width: 500, height: 500 }, parent: a.ref, allPoints: a.ref, z: 5 })
})

