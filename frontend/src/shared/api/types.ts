export type ApiResponse<Data = Record<string, unknown>> = {
  data?: Data
  error?: string
}
