import { capitalizeFirstLetter } from '~utils'

export enum HttpsStatus {
  // 1xx: Thông tin
  Continue_100 = 100, //  Máy chủ đã nhận phần đầu của yêu cầu và khách hàng nên tiếp tục gửi phần còn lại của yêu cầu
  SwitchingProtocols_101 = 101, // Máy chủ đồng ý chuyển đổi giao thức theo yêu cầu của khách hàng.
  // 2xx: Thành công
  OK_200 = 200, // Yêu cầu đã thành công và máy chủ đã trả về tài nguyên yêu cầu.
  Created_201 = 201, // Yêu cầu đã thành công và tài nguyên mới đã được tạo.
  NoContent_204 = 204, // Yêu cầu đã thành công nhưng không có nội dung nào được trả về.
  // 3xx: Chuyển hướng
  MovedPermanently_301 = 301, // Tài nguyên yêu cầu đã được di chuyển vĩnh viễn đến một URL mới.
  Found_302 = 302, // Tài nguyên yêu cầu tạm thời nằm tại một URL khác.
  NotModified_304 = 304, // Tài nguyên không có sự thay đổi kể từ lần truy cập cuối cùng.
  // 4xx: Lỗi của khách hàng
  BadRequest_400 = 400, // Yêu cầu không hợp lệ hoặc không thể hiểu được.
  Unauthorized_401 = 401, // Yêu cầu yêu cầu xác thực người dùng.
  Forbidden_403 = 403, // Máy chủ hiểu yêu cầu nhưng từ chối thực hiện.
  NotFound_404 = 404, // Máy chủ không tìm thấy tài nguyên yêu cầu.
  MethodNotAllowed_405 = 405, // Phương thức yêu cầu không được phép cho tài nguyên này.
  RequestTimeout_408 = 408, // Máy chủ đã chờ đợi quá lâu cho yêu cầu từ khách hàng.
  TooManyRequests_429 = 429, // Khách hàng đã gửi quá nhiều yêu cầu trong một khoảng thời gian ngắn.
  // 5xx: Lỗi của máy chủ
  InternalServerError_500 = 500, // Máy chủ gặp lỗi không xác định và không thể hoàn thành yêu cầu.
  NotImplemented_501 = 501, // Máy chủ không hỗ trợ chức năng yêu cầu.
  BadGateway_502 = 502, // Máy chủ nhận phản hồi không hợp lệ từ máy chủ upstream.
  ServiceUnavailable_503 = 503, // Máy chủ hiện không khả dụng (quá tải hoặc bảo trì).
  GatewayTimeout_504 = 504, // Máy chủ không nhận được phản hồi kịp thời từ máy chủ upstream.
}

export interface ApiResponse {
  error: boolean
  message?: string
  result?: any
}

export type ErrorsMessage = {
  field: string
  message:
  | string
  | {
    field: string
    message: string
  }[]
}[]


export type ValidateArray = Omit<ValidateFieldParams, 'errorsMessage' | 'localizationSource'>[]

export interface ValidateFieldParams {
  errorsMessage: ErrorsMessage
  field: string
  localizationSource: string
  require?: boolean
  type?: 'undefined' | 'object' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'function'
  value: any
}

export function isEmptyField(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim() === ''
  }
  if (value === null || value === undefined) {
    return true
  }
  return false
}

export const validateField = ({
  errorsMessage = [],
  field,
  localizationSource,
  require,
  type = 'string',
  value,
}: ValidateFieldParams) => {
  if (require && isEmptyField(value)) {
    errorsMessage.push({
      field,
      message: `${localizationSource}Require${capitalizeFirstLetter(field)}`,
    })
  }
  if (!isEmptyField(value) && typeof value !== type) {
    errorsMessage.push({
      field,
      message: `${localizationSource}Invalid${capitalizeFirstLetter(field)}`,
    })
  }
}
