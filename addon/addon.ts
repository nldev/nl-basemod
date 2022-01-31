import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  const a = Frame({ padding: 10, size: { width: 500, height: 500 }, z: 99 })
    .Backdrop()
    .Point('CENTER')
    .Execute(() => console.log('ran'))
    .Z(5)
    .Drag('RightButton')
    .Click('LeftButton', () => console.log($.playerInfo.name))


  Scroll({ name: 'bar', size: { width: 500, height: 500 }, parent: a.inner, allPoints: a.ref, z: 99 })
})

