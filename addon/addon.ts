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
      Frame({ allPoints: 'CENTER' }, [
        Frame()
          .Backdrop()
          .Size(300, 300)
          .Point({
            point: 'TOPLEFT',
            relativeTo: 'parent',
          })
          .Run(() => console.log('ran'))
      ]),
    ])
  // Scroll({ name: 'bar' })
  //   .Backdrop()
  //   .Click('LeftButton', () => console.log($.playerInfo.name))
})


