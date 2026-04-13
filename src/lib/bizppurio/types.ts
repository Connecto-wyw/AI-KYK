export interface BizppurioTokenResponse {
  accesstoken: string;
  type: string;
  expired: string;
}

export interface SendAlimtalkParams {
  to: string;
  templateCode: string;
  templateData?: Record<string, string>;
  eventType: string;
  dedupeKey?: string;
  userId?: string; 
}

export interface BizppurioMessagePayload {
  account: string;
  type: string;
  from: string; // The registered sender phone number (optional but required by schema sometimes)
  to: string;
  content: {
    at: {
      senderkey: string;
      templatecode: string;
      message: string;
      button?: any[];
    }
  };
  refkey?: string;
}

export interface SendAlimtalkResult {
  success: boolean;
  code?: string;
  message?: string;
  messageId?: string;
}
