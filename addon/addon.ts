import { render } from './basemod/app'
import { NElement } from './basemod/component'
// import { Frame } from './basemod/component'
// import { Scroll } from './basemod/components/scroll'
// import { Grid } from './basemod/components/grid'
// import { Mapping } from './basemod/types'

render($ => {
  const a = new NElement('root')
    .Style({
      bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
      edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
      tile: true,
      tileSize: 16,
      edgeSize: 16,
      insets: {
        left: 4,
        right: 4,
        top: 4,
        bottom: 4,
      },
    })
    .Box({
      type: 'BOX_CENTER',
      width: 500,
      height: 500,
    })
    .Padding(50)

  const b = () => new NElement('b')
    .Style({
      bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
      edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
      tile: true,
      tileSize: 16,
      edgeSize: 16,
      insets: {
        left: 4,
        right: 4,
        top: 4,
        bottom: 4,
      },
      blue: 1,
    })
    .Box({
      type: 'BOX_FULL',
      // isPercent: true,
      // width: 0.5,
      // height: 0.5,
    })
    .Style({
      red: 1,
    })

console.log(a.ref.GetParent().GetName())
console.log(a.inner.ref.GetParent().GetName())

  // const a = Frame({
  //   id: 'a',
  //   size: { width: 600, height: 600 },
  //   padding: 50,
  //   point: 'CENTER',
  //   bg: {},
  //   z: 2,
  //   strata: 'LOW',
  // })

  // a.OnClick('LeftButton', e => {
  //   console.log(e.children.length)
  //   e.children.forEach(child => console.log(child.ref.GetName()))
  // })

  // a.OnDrag('RightButton')

  // const s = Scroll({
  //   id: 'testscroll',
  //   size: { width: a.ref.GetWidth(), height: a.ref.GetHeight() },
  //   parent: a,
  //   allPoints: a.inner,
  //   strata: 'MEDIUM',
  //   z: 5,
  // })

  // const g = Grid({
  //   id: 'testgrid',
  //   parent: s,
  //   itemsPerRow: 4,
  //   rowHeight: 60,
  //   strata: 'MEDIUM',
  //   z: 6,
  // })

  // s.Attach(g)

  // const aa = Frame({
  //   id: 'aa',
  //   size: { width: 60, height: 60 },
  //   bg: {},
  //   color: { red: 1, blue: 1 },
  //   strata: 'LOW',
  // })

  // const ab = Frame({
  //   id: 'ab',
  //   size: { width: 60, height: 60 },
  //   bg: {},
  //   color: { green: 1, red: 1, },
  //   strata: 'LOW',
  // })

  // const ac = Frame({
  //   id: 'ac',
  //   size: { width: 60, height: 60 },
  //   bg: {},
  //   color: { red: 1 },
  //   strata: 'LOW',
  // })

  // const ad = Frame({
  //   id: 'ad',
  //   size: { width: 60, height: 60 },
  //   bg: {},
  //   color: { green: 1 },
  //   strata: 'LOW',
  // })

  // const test = Frame({
  //   id: 'anothertestframe',
  //   size: { width: 60, height: 60 },
  //   bg: {},
  //   color: { blue: 1 },
  //   strata: 'LOW',
  // })

  // g.Add(test)
  // g.Add(aa)
  // g.Add(ab)
  // g.Add(ac)
  // g.Add(ad)

  // a.ref.RegisterEvent('CHAT_MSG_SAY')

  // a.ref.SetScript('OnEvent', (frame, event, text: string, id: string) => {
  //   if (event === 'CHAT_MSG_SAY') {
  //     const isShow = text === 'show'
  //     const isHide = text === 'hide'
  //     const isToggle = text === 'toggle'

  //     if (id.toLowerCase() === $.playerInfo.name) {
  //       if (isShow)
  //         a.Show()

  //       if (isHide)
  //         a.Hide()

  //       if (isToggle)
  //         a.Toggle()
  //     }
  //   }
  // })
})


