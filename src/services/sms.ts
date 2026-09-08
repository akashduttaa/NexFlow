// SMS Adapter Interface — SIMULATED
// Production provider integration is a future connector.

export interface SmsMessage {
  to: string;
  body: string;
}

export interface SmsResult {
  success: boolean;
  messageId: string | null;
  provider: string;
  simulated: boolean;
  timestamp: string;
}

export interface ISmsProvider {
  send(message: SmsMessage): Promise<SmsResult>;
  getName(): string;
  isSimulated(): boolean;
}

export class MockSmsProvider implements ISmsProvider {
  getName() { return 'MockSmsProvider'; }
  isSimulated() { return true; }

  async send(message: SmsMessage): Promise<SmsResult> {
    // Simulated — no real SMS is sent
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
      provider: 'MockSmsProvider',
      simulated: true,
      timestamp: new Date().toISOString(),
    };
  }
}

export const smsProvider: ISmsProvider = new MockSmsProvider();

export function formatBayAlert(bayId: string, windowStart: string, windowEnd: string, routeId: string): string {
  return `NEXFLOW ALERT\nBay ${bayId} reserved ${windowStart}–${windowEnd}.\nRoute ${routeId} updated.\nReply ACK or HELP.`;
}
