import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  const frame = Frame()
    .Size(500, 500)
    .Backdrop()
    .Point('CENTER')
    .Padding(20)
    .Children([
      Frame({ allPoints: 'CENTER', size: { width: 500, height: 500 }, z: 1 }, [
        Frame()
          .Size(300, 300)
          .Backdrop()
          .Z(5)
          .Point({
            point: 'TOPLEFT',
            relativeTo: 'parent',
            relativePoint: 'TOPLEFT'
          })
          .Run(() => console.log('ran'))
      ]),
    ])
  // Scroll({ name: 'bar' })
  //   .Backdrop()
  //   .Click('LeftButton', () => console.log($.playerInfo.name))
})


