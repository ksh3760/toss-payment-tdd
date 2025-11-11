// Mock implementation of Toss Payments Widget SDK

export const ANONYMOUS = 'ANONYMOUS' as const;

// Mock functions for payment widget
export const mockRequestPayment = jest.fn().mockResolvedValue({
  success: true,
});

export const mockRenderPaymentMethods = jest.fn().mockReturnValue({
  updateAmount: jest.fn(),
});

export const mockRenderAgreement = jest.fn();

export const mockPaymentWidget = {
  renderPaymentMethods: mockRenderPaymentMethods,
  renderAgreement: mockRenderAgreement,
  requestPayment: mockRequestPayment,
};

export const loadPaymentWidget = jest.fn().mockResolvedValue(mockPaymentWidget);

// Reset helper for tests
export const resetMocks = () => {
  mockRequestPayment.mockClear();
  mockRenderPaymentMethods.mockClear();
  mockRenderAgreement.mockClear();
  loadPaymentWidget.mockClear();
};
