import { isEmpty } from 'lodash'

export function capitalizeFirstLetter(input: string) {
  return input ? input.charAt(0).toUpperCase() + input.slice(1) : ''
}

export const parseSafe = (data: any, defaultValue?: any) => {
  if (!data || isEmpty(data)) return defaultValue
  if (typeof data !== 'string') return data
  try {
    return JSON.parse(data)
  } catch (error) {
    return defaultValue
  }
}

export function parseDate(dateString: string) {
  const parts = dateString?.split('/') || []
  if (parts.length !== 3) {
    return new Date(2024, 0, 1).valueOf()
  }
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const year = parseInt(parts[2], 10)
  const isValidDate = day > 0 && day <= 31 && month >= 0 && month <= 11 && year > 0
  if (!isValidDate) {
    return new Date(2024, 0, 1)
  }
  return new Date(year, month, day).valueOf()
}
