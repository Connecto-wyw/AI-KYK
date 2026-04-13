export const BIZPPURIO_TEMPLATE_CODES = {
  SIGNUP_WELCOME: "signup_welcome_v1",
} as const;

export const BIZPPURIO_TEMPLATE_META = {
  SIGNUP_WELCOME: ["name"],
} as const;

export function buildTemplateMessage(templateCode: string, data?: Record<string, string>): string {
  let content = "";
  
  switch (templateCode) {
    case BIZPPURIO_TEMPLATE_CODES.SIGNUP_WELCOME:
      content = `${data?.name || '고객'}님, AI-KYK 회원가입이 완료되었습니다.\n이제 맞춤형 진단과 육아 코칭 서비스를 이용하실 수 있습니다.`;
      break;
    default:
      content = "메시지 내용이 없습니다.";
  }
  
  return content;
}
