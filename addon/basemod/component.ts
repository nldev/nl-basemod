import { Get } from './app'

export const Frame = () => {
  const $ = Get()

  const component = CreateFrame('Frame', null, $.root)

  return component
}
