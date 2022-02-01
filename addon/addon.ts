import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  const a = Frame({
    padding: 10,
    size: { width: 500, height: 500 },
    z: 99,
    bg: {},
    color: {},
    point: 'CENTER',
    onDrag: { button: 'RightButton' },
    onClick: { button: 'LeftButton', handler: () => console.log($.playerInfo.name) }
  })


  const s = Scroll({
    name: 'bar',
    size: { width: 500, height: 500 },
    parent: a.inner,
    allPoints: a.ref,
    z: 99
  })
})

