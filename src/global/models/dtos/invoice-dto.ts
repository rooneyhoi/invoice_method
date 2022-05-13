export interface InvoiceDTO {
  amount: number,
  discount: number,
  invoiceContent: string,
  invoiceName: string,
  isChangeRequest: string,
  sendOn: Date,
  tax: string,
}
