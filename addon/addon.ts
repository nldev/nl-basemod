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
      Frame({ allPoints: 'CENTER', size: { width: 500, height: 500 } }, [
        Frame()
          .Size(300, 300)
          .Backdrop()
          .Point({
            point: 'TOPLEFT',
          })
          .Run(() => console.log('ran'))
      ]),
    ])
  // Scroll({ name: 'bar' })
  //   .Backdrop()
  //   .Click('LeftButton', () => console.log($.playerInfo.name))
})


