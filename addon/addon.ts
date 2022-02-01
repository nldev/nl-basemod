import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  const a = Frame({
    padding: 30,
    size: { width: 500, height: 500 },
    z: 50,
    bg: {},
    color: {},
    point: 'CENTER',
    onClick: { button: 'LeftButton', handler: () => console.log($.playerInfo.name) },
    onDrag: { button: 'RightButton' },
  })

  const s = Scroll({
    name: 'bar',
    size: { width: a.ref.GetWidth(), height: a.ref.GetHeight() },
    parent: a.inner,
    allPoints: a.ref,
    z: 99,
  })
})

