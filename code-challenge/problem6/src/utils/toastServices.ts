import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'

interface ToastOptions {
  content: string
  htmlContent?: string
  onCancel?: (value: any) => void
  onConfirm?: (value: any) => void
  showPrompt?: boolean
  title?: string
}

export const toastServices = {
  alert: ({ content, title }: ToastOptions): void => {
    Swal.fire({
      animation: false,
      text: content,
      title: title ? title : 'Tin nhắn từ hệ thống',
    } as SweetAlertOptions)
  },
  close: (): void => {
    Swal.close()
  },
  confirm: ({ content, htmlContent, onCancel, onConfirm, title }: ToastOptions): void => {
    Swal.fire({
      animation: false,
      cancelButtonColor: '#85D3FF',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#072A5E',
      confirmButtonText: 'Xác nhận',
      html: htmlContent,
      showCancelButton: true,
      text: content,
      title: title ? title : 'Tin nhắn từ hệ thống',
    } as SweetAlertOptions).then((result: SweetAlertResult) => {
      setTimeout(() => {
        if (result.value) {
          if (onConfirm) onConfirm(result.value)
        } else {
          onCancel && onCancel(result.value)
        }
      }, 300)
    })
  },
  error: ({ content, title }: ToastOptions): void => {
    Swal.fire({
      animation: false,
      icon: 'error',
      text: content,
      title: title ? title : 'Error',
    } as SweetAlertOptions)
  },
  info: ({ content, title }: ToastOptions): void => {
    Swal.fire({
      animation: false,
      icon: 'info',
      text: content,
      title: title ? title : 'Tin nhắn từ hệ thống',
    } as SweetAlertOptions)
  },
  loading: (): void => {
    const isVisible = Swal.isVisible()
    if (!isVisible) {
      Swal.fire({
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
        showConfirmButton: false,
        title: '',
        width: '250px',
      } as SweetAlertOptions)
    }
  },
  prompt: ({ content, onConfirm, showPrompt, title }: ToastOptions): void => {
    Swal.fire({
      animation: false,
      cancelButtonColor: '#85D3FF',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#072A5E',
      confirmButtonText: 'Xác nhận',
      input: showPrompt ? 'text' : 'password',
      showCancelButton: true,
      text: content,
      title: title ? title : 'Tin nhắn từ hệ thống',
    } as SweetAlertOptions).then((result: SweetAlertResult) => {
      if (result.value) {
        if (onConfirm) onConfirm(result.value)
      }
    })
  },
  success: ({ content }: ToastOptions): void => {
    Swal.fire({
      animation: false,
      icon: 'success',
      text: content,
      title: 'Success',
    } as SweetAlertOptions)
  },
  unloading: (): void => {
    Swal.hideLoading()
    Swal.close()
  },
  warning: ({ content, title }: ToastOptions): void => {
    Swal.fire({
      animation: false,
      icon: 'warning',
      text: content,
      title: title ? title : 'Tin nhắn từ hệ thống',
    } as SweetAlertOptions)
  },
}
