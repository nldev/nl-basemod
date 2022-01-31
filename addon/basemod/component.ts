import { Get } from './app'

export const Frame = () => {
  const $ = Get()

  const component = CreateFrame('Frame', null, $.root)

  console.log($.playerInfo.chrClass.toLowerCase() + ' sucks!')

  return component
}
