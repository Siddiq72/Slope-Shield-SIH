/**
 * Slope Shield Notification & Emergency Broadcast Service (Phase 1: Local / Mock Data Architecture)
 * 
 * Provides mock & simulated Common Alerting Protocol (CAP) and SMS emergency broadcasts.
 * Ready for future backend Twilio / CDAC CAP gateway connection without requiring API credentials at this stage.
 */

export interface AlertDispatchPayload {
  recipient: string;
  message: string;
  alertLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  zoneCode: string;
  channels: ('SMS' | 'CAP_XML' | 'SIREN' | 'WHATSAPP')[];
}

export interface DispatchReceipt {
  success: boolean;
  status: 'DISPATCHED' | 'QUEUED' | 'FAILED';
  dispatchId: string;
  zoneCode: string;
  recipientCount: number;
  channelsDispatched: string[];
  timestamp: string;
  gateway: 'simulated-cap-relay' | 'live-sms-gateway';
}

export interface NotificationProvider {
  dispatchAlert(payload: AlertDispatchPayload): Promise<DispatchReceipt>;
  getBroadcastLog(): Promise<Array<{ id: string; timestamp: string; title: string; status: string }>>;
}

class MockNotificationService implements NotificationProvider {
  async dispatchAlert(payload: AlertDispatchPayload): Promise<DispatchReceipt> {
    // Generate realistic simulated broadcast dispatch receipt
    return {
      success: true,
      status: 'DISPATCHED',
      dispatchId: `CAP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      zoneCode: payload.zoneCode,
      recipientCount: 48,
      channelsDispatched: payload.channels,
      timestamp: new Date().toISOString(),
      gateway: 'simulated-cap-relay',
    };
  }

  async getBroadcastLog(): Promise<Array<{ id: string; timestamp: string; title: string; status: string }>> {
    return [
      { id: 'CAP-9821', timestamp: '12 mins ago', title: 'Red Alert SMS Evacuation Dispatch (Lunglei South)', status: 'Delivered (1,420 citizens)' },
      { id: 'CAP-9818', timestamp: '1 hour ago', title: 'PWD Road Closure Directive (NH-54 Section)', status: 'Acknowledged by Control Room' },
      { id: 'CAP-9810', timestamp: '4 hours ago', title: 'Orange Alert Pre-Warning (Champhai Escarpment)', status: 'Delivered (890 citizens)' },
    ];
  }
}

export const notificationService = new MockNotificationService();
