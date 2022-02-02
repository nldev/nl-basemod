import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'
import { Grid } from './basemod/components/grid'

render($ => {
  const a = Frame({
    id: 'a',
    size: { width: 300, height: 300 },
    padding: 50,
    point: 'CENTER',
    bg: {},
    z: 2,
    strata: 'LOW',
  })

  a.OnClick('LeftButton', e => {
    console.log(e.children.length)
    e.children.forEach(child => console.log(child.ref.GetName()))
  })

  a.OnDrag('RightButton')

  const s = Scroll({
    id: 'testscroll',
    size: { width: a.ref.GetWidth(), height: a.ref.GetHeight() },
    parent: a,
    allPoints: a.inner,
    strata: 'MEDIUM',
    z: 5,
  })

  const g = Grid({
    id: 'testgrid',
    parent: s,
    bg: {},
    itemsPerRow: 4,
    rowHeight: 100,
  })

  const test = Frame({
    id: 'anothertestframe',
    parent: g,
    size: { width: 100, height: 100 },
    bg: {},
    color: { red: 1 },
  })

  g.Add(test)

  a.ref.RegisterEvent('CHAT_MSG_SAY')

  a.ref.SetScript('OnEvent', (frame, event, text: string, id: string) => {
    if (event === 'CHAT_MSG_SAY') {
      const isShow = text === 'show'
      const isHide = text === 'hide'
      const isToggle = text === 'toggle'

      if (id.toLowerCase() === $.playerInfo.name) {
        if (isShow)
          a.Show()

        if (isHide)
          a.Hide()

        if (isToggle)
          a.Toggle()
      }
    }
  })
})

