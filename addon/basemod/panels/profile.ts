// ## poc
// - name (input)
// - player status (input)
// - character status (input)
// - about (markdown)
// - class (input)
import { Component, Frame, Get } from '../app'
import { Scroll } from '../components/scroll'
import { Section } from '../components/section'
import { Button } from '../components/button'
import { Counter } from '../components/counter'
import { Grid } from '../components/grid'
import { Checkbox } from '../components/checkbox'
import { Input } from '../components/input'
import { Textarea } from '../components/textarea'

export const Profile: Component = options => {
  const frame = Frame({ name: 'profile', ...options })
  frame.ref.SetSize(290, 360)
  frame.ref.SetPoint('CENTER')

  const scroll = Scroll({ name: 'profile-scroll', parent: frame, height: 300 })

  // editor
  const a = Section({
    name: 'editor',
    title: 'Editor',
    parent: scroll,
    height: 50,
  })
  const editor = Textarea({
    name: 'editor-input',
    parent: a,
  })
  editor.ref.SetPoint('TOPLEFT')

  // view
  const b = Section({
    name: 'view',
    title: 'View',
    parent: scroll,
    height: 50,
  })
  const view = Frame({
    name: 'view-frame',
    width: b.inner.GetWidth(),
    height: b.inner.GetHeight(),
  })
  view.ref.SetPoint('TOPLEFT')

  // name
  // const a = Section({
  //   name: 'name',
  //   title: 'Name',
  //   parent: scroll,
  //   height: 50,
  // })
  // const name = Input({
  //   name: 'name-input',
  //   parent: a,
  // })
  // name.ref.SetPoint('TOPLEFT')

  // // class
  // const b = Section({
  //   name: 'class',
  //   title: 'Class',
  //   parent: scroll,
  //   previous: a,
  //   height: 50,
  // })

  // // player-status
  // const c = Section({
  //   name: 'player-status',
  //   title: 'Player Status',
  //   parent: scroll,
  //   previous: b,
  //   height: 50,
  // })

  // // character-status
  // const d = Section({
  //   name: 'character-status',
  //   title: 'Character Status',
  //   parent: scroll,
  //   previous: c,
  //   height: 50,
  // })

  // // about
  // const e = Section({
  //   name: 'about',
  //   title: 'About',
  //   parent: scroll,
  //   previous: d,
  //   height: 50,
  // })

  return frame
}

