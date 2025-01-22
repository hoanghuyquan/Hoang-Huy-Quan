import { ErrorsMessage } from '~models'
import { __ } from '~localization'

export function getErrorsMessage(errorsMessage: ErrorsMessage): string {
  return errorsMessage
    ?.map?.((e) => {
      if (typeof e?.message === 'string') return __(e?.message)
      else return e?.message?.map?.((i) => __(i?.message))?.join(', ') || ''
    })
    ?.join('\n')
}
