export const invoiceMock = [
  {
    id: '2b87bee1-c379-40b6-9748-2ca23b290550',
    card: { id: '451e8d12-9877-45ed-8b71-50a12683e7ce' },
  },
  {
    id: 'b054abc1-6935-45b3-aee3-825177f06177',
    paid: '2023-06-12 07:59:58-02',
    billTo: { id: '838410f2-abff-488d-8934-caae78c3b166' },
    card: { id: '7817e96d-c10d-409d-912f-2cb04eec4016' },
    created: '2023-06-10 17:00:00-02',
  },
  {
    id: '7565f1c5-c026-403a-9884-c19683f58a50',
    created: new Date(),
  },
]

// TODO: add invoice to credit card mock, add paymentMock to invoice service so it gets created, (before! order creations, after credit card creations)
