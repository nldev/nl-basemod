import { Component, Frame, Get } from '../app'
import { Scroll } from '../components/scroll'
import { Section } from '../components/section'
import { Button } from '../components/button'
import { Counter } from '../components/counter'
import { Grid } from '../components/grid'
import { Checkbox } from '../components/checkbox'
import { Input } from '../components/input'
import { Textarea } from '../components/textarea'
import { BASE_BACKDROP } from '../constants'

declare interface ILMD {
  ToHTML: (markdown: string) => string
}
declare const LibMarkdown: ILMD
declare const DEFAULT_CHAT_FRAME: any
declare const ChatEdit_ActivateChat: any

export function Markdown (frame: WoWAPI.Frame) {
  const html: WoWAPI.Frame = CreateFrame('SimpleHTML', frame.GetName() + '-md', frame) as any
  html.SetParent(frame)
  html.SetHeight(frame.GetHeight())
  html.SetWidth(frame.GetWidth())
  html.SetPoint('TOPLEFT')
  ;(html as any).SetFontObject('h1', 'SubzoneTextFont')
  ;(html as any).SetTextColor('h1', 0, 0.6, 1, 1)
  ;(html as any).SetFontObject('h2', 'NumberFontNormalLarge')
  ;(html as any).SetTextColor('h2', 0, 1, 0, 1)
  ;(html as any).SetFontObject('h3', 'NumberFontNormalLarge')
  ;(html as any).SetTextColor('h3', 0, 0.8, 0.4, 1)
  ;(html as any).SetFontObject('p', 'GameFontNormal')
  ;(html as any).SetTextColor('p', 1, 1, 1, 1)
  ;(html as any).SetHyperlinkFormat('[|cff3399ff|H%s|h%s|h|r]')
  return (text: string) => {
    html.SetPoint('TOPLEFT')
    ;(html as any).SetText(LibMarkdown.ToHTML(text))
  }
}

export const Profile: Component = options => {
  const frame = Frame({ name: 'profile', ...options })
  frame.ref.SetSize(290, 360)
  frame.ref.SetPoint('CENTER')

  const scroll = Scroll({ name: 'profile-scroll', parent: frame, height: 300 })

  // const a = Section({
  //   name: 'editor',
  //   title: 'Editor',
  //   parent: scroll,
  //   height: 150,
  // })
  // const b = Section({
  //   name: 'view',
  //   title: 'View',
  //   parent: scroll,
  //   previous: a,
  //   height: 50,
  // })

  // view
  // const view = Frame({
  //   name: 'view-frame',
  //   parent: b,
  //   width: b.inner.GetWidth(),
  //   height: b.inner.GetHeight(),
  // })
  // view.ref.SetPoint('TOPLEFT', 0, -20)
  // const md = Markdown(view.ref)

  // // editor
  // const editor = Textarea({
  //   name: 'editor-input',
  //   height: 150,
  //   parent: a,
  //   onChange: text => md(text)
  // })
  // editor.ref.SetPoint('TOPLEFT')

  const $ = Get()
  // name
  const a = Section({
    name: 'name',
    title: 'Name',
    parent: scroll,
    height: 50,
  })
  const name = Input({
    name: 'name-input',
    parent: a,
    initial: $.store.Get('CHARACTER', 'rp-name', $.playerInfo.name),
    onAccept: text => $.store.Set('CHARACTER', 'rp-name', text),
  })
  name.ref.SetPoint('TOPLEFT')

  // class
  const b = Section({
    name: 'class',
    title: 'Class',
    parent: scroll,
    previous: a,
    height: 50,
  })
  const cls = Input({
    name: 'class-input',
    parent: b,
    initial: $.store.Get('CHARACTER', 'rp-class', $.playerInfo.chrClass.toLowerCase()),
    onAccept: text => $.store.Set('CHARACTER', 'rp-class', text),
  })
  cls.ref.SetPoint('TOPLEFT')

  // status
  const c = Section({
    name: 'status',
    title: 'Character Status',
    parent: scroll,
    previous: b,
    height: 50,
  })
  const status = Input({
    name: 'status-input',
    parent: c,
    initial: $.store.Get('CHARACTER', 'rp-status', ''),
    onAccept: text => $.store.Set('CHARACTER', 'rp-status', text),
  })
  status.ref.SetPoint('TOPLEFT')

  // about
  const d = Section({
    name: 'about',
    title: 'About',
    parent: scroll,
    previous: c,
    height: 250,
  })

  // editor
  const editor = Textarea({
    name: 'editor-input',
    height: 250,
    parent: d,
    initial: $.store.Get('CHARACTER', 'rp-about', ''),
    onAccept: text => $.store.Set('CHARACTER', 'rp-about', text),
    onChange: text => md(text),
  })
  editor.ref.SetPoint('TOPLEFT')

  // preview
  const e = Section({
    name: 'preview',
    title: 'Preview',
    parent: scroll,
    previous: d,
    height: 250,
  })
  const view = Frame({
    name: 'md-frame',
    parent: e,
    width: e.inner.GetWidth(),
    height: e.inner.GetHeight(),
  })
  view.ref.SetPoint('TOPLEFT', 0, -10)
  const md = Markdown(view.ref)

  return frame
}

