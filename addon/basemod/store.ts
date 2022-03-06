import { Get } from './app'

const STORE_TYPE_ACCOUNT = 'STORE_TYPE_ACCOUNT'
const STORE_TYPE_CHARACTER = 'STORE_TYPE_CHARACTER'

export type StoreType = typeof STORE_TYPE_ACCOUNT | typeof STORE_TYPE_CHARACTER
export type StoreValue = string | number | null

const app = Get()

export class Store {
  isLoaded = false
  state: any = {
    [STORE_TYPE_ACCOUNT]: {},
    [STORE_TYPE_CHARACTER]: {},
  }

  public Init (onInit: () => void) {
    Events.ChatInfo.OnChatMsgAddon(app.root.ref, (prefix, text) => {
      if (prefix !== 'store-get')
        return
      if (!text)
        return

      const [t, type, key, value] = text.split(' ')

      this.state[type][key] = t === 'number'
        ? Number(value)
        : t === 'null'
        ? null
        : value
    })

    Events.ChatInfo.OnChatMsgAddon(app.root.ref, prefix => {
      if (prefix !== 'store-init-success')
        return

      this.isLoaded = true

      onInit()
    })

    SendAddonMessage('store-init', ' ', 'WHISPER', app.playerInfo.name)
  }

  public Set (type: StoreType, key: string, value: StoreValue) {
    const t = typeof value === 'number'
      ? 'number'
      : typeof value === 'string'
      ? 'string'
      : null

    this.state[type][key] = value

    SendAddonMessage('store-set', `${t} ${type} ${key} ${value}`, 'WHISPER', app.playerInfo.name)
  }

  public Get (type: StoreType, key: string) {
    return this.state[type][key]
  }
}

