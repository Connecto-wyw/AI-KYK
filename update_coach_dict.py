import re
import os

with open(r'c:\projects\AI-KYK\src\lib\i18n\dictionaries.ts', 'r', encoding='utf-8') as f:
    content = f.read()

translations = {
    'ko': {
        'coachTitle': "전담 AI 코치",
        'coachStatus': "온라인 · 1:1 맞춤 상담 중",
        'coachInputPlaceholder': "궁금한 양육 고민을 질문해주세요...",
        'coachAlertUntested': "KYK 진단을 먼저 진행해야 아이 성향에 맞춘 정확한 답변이 가능합니다.\\n진단을 시작하시겠어요?",
        'coachQuickRep1': "고집 부릴 때 어떻게 해요?",
        'coachQuickRep2': "어떤 칭찬이 효과적인가요?",
        'coachQuickRep3': "또래 관계가 걱정돼요",
        'coachQuickRep4': "훈육은 어떻게 하나요?",
        'concernDefault': "특별한 고민은 없어요",
        'concernFallback': "전반적인 아이 양육과 발달",
        'greetingUntested': "안녕하세요! 부모님의 든든한 육아 파트너 AI 코치입니다. 요즘 아이를 키우시면서 가장 어렵거나 궁금한 점이 있으신가요?",
        'greetingp1': "안녕하세요! '{title}' 성향을 가진 우리 아이 맞춤형 AI 코치입니다.\\n\\n검사 결과를 보니 부모님께서 요즘 {concern} 문제로 고민이 있으신 것 같아요. 우리 아이는 기본적으로 [{strength}] 특징이 있지만, 종종 [{carePoint}] 취약점 때문에 부모님이 다루기 까다로울 때가 있을 거예요.\\n\\n이러한 성향의 아이들은 훈육과 칭찬 방식이 완전히 달라야 합니다. 최근에 구체적으로 어떤 행동이나 상황 때문에 가장 힘드셨나요? 편하게 말씀해주세요."
    },
    'en': {
        'coachTitle': "Dedicated AI Coach",
        'coachStatus': "Online · 1:1 Coaching",
        'coachInputPlaceholder': "Ask any parenting questions here...",
        'coachAlertUntested': "You need to complete the KYK test first to get accurate answers tailored to your child's personality.\\nStart the test now?",
        'coachQuickRep1': "What to do when they are stubborn?",
        'coachQuickRep2': "What kind of praise is effective?",
        'coachQuickRep3': "Worried about peer relationships",
        'coachQuickRep4': "How do I discipline?",
        'concernDefault': "No special concerns",
        'concernFallback': "General parenting and development",
        'greetingUntested': "Hello! I am your reliable parenting partner AI Coach. What is the most difficult or curious thing you have while raising your child these days?",
        'greetingp1': "Hello! I am your customized AI coach for your child with the '{title}' personality.\\n\\nLooking at the results, it seems that you are worried about {concern} issues these days. Your child basically has the characteristic of [{strength}], but sometimes parents can find it difficult to handle them due to the vulnerability of [{carePoint}].\\n\\nChildren with this tendency respond to entirely different methods of discipline and praise. What specific behaviors or situations have you found most difficult recently? Please feel free to tell me."
    }
}

lines = content.split('\n')
new_lines = []
in_lang = None

for line in lines:
    new_lines.append(line)
    
    match = re.match(r'^\s*([a-z]{2}):\s*\{', line)
    if match:
        in_lang = match.group(1)
        # Inject right after language object starts
        if in_lang in ['ko', 'en', 'ms', 'id', 'vi', 'th']:
            # fallback to en if not ko
            use_lang = in_lang if in_lang in translations else 'en'
            for k, v in translations[use_lang].items():
                safe_v = v.replace('"', '\\"')
                new_lines.append(f'    {k}: "{safe_v}",')

with open(r'c:\projects\AI-KYK\src\lib\i18n\dictionaries.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))
