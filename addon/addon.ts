import { render } from './basemod/app'
import { Frame, FrameOptions } from './basemod/component'
import { Scroll, ScrollOptions } from './basemod/components/scroll'
import { Grid, GridOptions } from './basemod/components/grid'
// import { Mapping } from './basemod/types'

render($ =>
  Frame('root', ROOT_OPTIONS, [
    Frame('pad', PAD_OPTIONS, [
      Scroll('scroll', SCROLL_OPTIONS, [
        Grid('grid', GRID_OPTIONS, [
          Frame('a', { box: { type: 'BOX_CENTER', width: 30, height: 30 }, style: { preset: 'border-background', red: 1 } }),
          // Frame('b', { box: { type: 'BOX_CENTER', width: 30, height: 30 }, style: { preset: 'border-background', green: 1 } }),
          // Frame('c', { box: { type: 'BOX_CENTER', width: 30, height: 30 }, style: { preset: 'border-background', blue: 1 } }),
          // Frame('d', { box: { type: 'BOX_CENTER', width: 30, height: 30 }, style: { preset: 'border-background', red: 1 } }),
          // Frame('e', { box: { type: 'BOX_CENTER', width: 30, height: 30 }, style: { preset: 'border-background', green: 1 } }),
          // Frame('f', { box: { type: 'BOX_CENTER', width: 30, height: 30 }, style: { preset: 'border-background', blue: 1 } }),
          // Frame('g', { box: { type: 'BOX_CENTER', width: 30, height: 30 }, style: { preset: 'border-background', red: 1 } }),
          // Frame('h', { box: { type: 'BOX_CENTER', width: 30, height: 30 }, style: { preset: 'border-background', green: 1 } }),
          // Frame('i', { box: { type: 'BOX_CENTER', width: 30, height: 30 }, style: { preset: 'border-background', blue: 1 } }),
        ]),
      ]),
    ])
  ])
)

const ROOT_OPTIONS: FrameOptions = {
  style: 'border-background',
  box: {
    type: 'BOX_CENTER',
    width: 500,
    height: 500,
  },
  scripts: [
    {
      type: 'EVENT_DRAG',
      button: 'RightButton',
    },
  ],
}

const PAD_OPTIONS: ScrollOptions = {
  box: {
    type: 'BOX_CENTER',
    width: 400,
    height: 400,
  },
  style: 'border',
}

const SCROLL_OPTIONS: ScrollOptions = {
  box: {
    type: 'BOX_CENTER',
    width: 380,
    height: 380,
  },
  style: {
    preset: 'border-background',
    red: 1,
  }
}

const GRID_OPTIONS: GridOptions = {
  itemsPerRow: 3,
  rowHeight: 100,
}

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


