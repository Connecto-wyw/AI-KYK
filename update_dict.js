const fs = require('fs');

const path = './src/lib/i18n/dictionaries.ts';
let content = fs.readFileSync(path, 'utf8');

const koAdditions = `
    step3Next: "다음 (4/5)",
    step4Title: "부모님의 교육가치관과\\n현재 아이의 단계는 어떤가요?",
    step4Subtitle: "AI가 부모님의 기대치와 현재 상태를 비교해 맞춤 코칭합니다.",
    
    step4Q1Title: "부모님이 가장 지향하는 양육 가치관은 무엇인가요?",
    step4Q1Max: "최대 2개",
    step4Q1Options: [
      { id: "self", p1: "🧭 자기주도형", p2: "줏대있게 스스로 생각하고 결정하는 아이" },
      { id: "achieve", p1: "🏆 성취지향형", p2: "뚜렷한 목표를 세우고 끝까지 달성하는 끈기있는 아이" },
      { id: "emotion", p1: "💖 관계/정서형", p2: "감정 표현이 솔직하며 다른 사람과 공감대를 잘 형성하는 아이" },
      { id: "balance", p1: "⚖️ 균형 성장형", p2: "공부, 놀이, 정서 발달이 한쪽으로 치우치지 않고 균형 잡힌 아이" },
      { id: "advance", p1: "🚀 선행 대비형", p2: "또래보다 학습적으로 앞서나가며 경쟁력을 갖추는 게 중요한 아이" },
      { id: "happy", p1: "😊 스트레스 최소형", p2: "큰 성공보다는 매일 스트레스 없이 즐겁고 행복하게 자라는 아이" },
      { id: "explore", p1: "🎨 창의/탐색형", p2: "기존의 정답보다 남들과 다르고 엉뚱한 새로운 시도를 즐기는 아이" },
      { id: "health", p1: "💪 건강/활동형", p2: "무엇보다 신체적으로 튼튼하고 아프지 않으며 에너지가 넘치는 아이" }
    ],

    step4Q2Title: "아이의 주요 학습 분야별 현재 발달 수준은 어느 정도인가요?",
    step4Q2Subjects: [
      { id: "lang", name: "📝 언어/한글", levels: ["관심 없음 / 시작 전", "가벼운 단어/모음 인지 수준", "문장을 읽거나 표현 가능한 수준"] },
      { id: "math", name: "🔢 수학/수리", levels: ["관심 없음 / 숫자 인지 전", "1~20 이상의 숫자를 세는 수준", "단순 연산 또는 크기 개념을 이해하는 수준"] },
      { id: "eng", name: "🔤 영어/외국어", levels: ["전혀 노출 없음", "기본 알파벳이나 영어 동요에 익숙", "간단한 단어나 문장 의미를 아는 수준"] },
      { id: "art", name: "🎨 예체능/운동", levels: ["딱히 즐기지 않음", "관심을 가지고 즐겁게 참여하는 수준", "꾸준하게 레슨을 받으며 집중적으로 배우는 중"] }
    ],

    step4Q3Title: "부모님이 지향하는 양육 속도와 스타일은 어떠신가요?",
    step4Q3Options: [
      { id: "lead", p1: "🏃 밀착 리드형 (빠르게/빡세게)", p2: "시기별로 필요한 과업을 놓치지 않게 계획적으로 끌어당겨 챙기는 편이에요." },
      { id: "nature", p1: "🐢 자연주의형 (천천히/여유롭게)", p2: "또래보다 늦더라도 아이만의 고유한 속도에 맞춰 스트레스 주지 않고 기다려요." },
      { id: "respect", p1: "🕊️ 자율 존중형 (가이드만 제공)", p2: "무엇이든 억지로 시키지 않고, 아이가 스스로 원하고 흥미를 보일 때 시작하게 해요." },
      { id: "coach", p1: "🤝 환경 제공형 (코칭 마스터)", p2: "직접 개입하기보다, 좋은 교구나 학원 등 탐색할 수 있는 다채로운 환경을 열어주어요." }
    ],
    
    step4Submit: "결과 확인하기",
    savingTeaser: "지금 부모님의 양육 방향은\\n아이에게 다소 {speed} 수 있어요",
`;

const enAdditions = `
    step3Next: "Next (4/5)",
    step4Title: "Tell us your parenting values\\nand current learning level",
    step4Subtitle: "AI compares expectations with reality for accurate coaching.",
    
    step4Q1Title: "What are your core parenting values?",
    step4Q1Max: "Max 2",
    step4Q1Options: [
      { id: "self", p1: "🧭 Self-Directed", p2: "Independent and decision-making" },
      { id: "achieve", p1: "🏆 Goal-Oriented", p2: "Persistent in achieving goals" },
      { id: "emotion", p1: "💖 Emotion-Focused", p2: "Empathy, expression, and stability" },
      { id: "balance", p1: "⚖️ Balanced Growth", p2: "Study, play, and emotion in harmony" },
      { id: "advance", p1: "🚀 Advanced Prep", p2: "Staying ahead of peers is important" },
      { id: "happy", p1: "😊 Minimized Stress", p2: "Smiling everyday over huge success" },
      { id: "explore", p1: "🎨 Creative Explorer", p2: "Trying new, even quirky things" },
      { id: "health", p1: "💪 Health/Active", p2: "Physically strong and energetic" }
    ],

    step4Q2Title: "What is your child's learning level?",
    step4Q2Subjects: [
      { id: "lang", name: "📝 Language (Native)", levels: ["No interest / Not started", "Simple words / basics", "Reading sentences / fluent"] },
      { id: "math", name: "🔢 Mathematics", levels: ["Cannot recognize numbers", "Understands numbers 1-20", "Simple calculations or concepts"] },
      { id: "eng", name: "🔤 Foreign Language", levels: ["No exposure", "Familiar with words/songs", "Understands simple sentences"] },
      { id: "art", name: "🎨 Arts & Sports", levels: ["No interest", "Enjoys casually", "Learning consistently"] }
    ],

    step4Q3Title: "What is your parenting teaching style?",
    step4Q3Options: [
      { id: "lead", p1: "🏃 Close Lead (Fast)", p2: "Planned guidance not missing milestones." },
      { id: "nature", p1: "🐢 Natural Pace (Slow)", p2: "Waiting patiently without pressure." },
      { id: "respect", p1: "🕊️ Respect Autonomy", p2: "Waiting until the child naturally wants to." },
      { id: "coach", p1: "🤝 Environment Provider", p2: "Providing good environment rather than direct teaching." }
    ],
    
    step4Submit: "See Results",
    savingTeaser: "Your current parenting pace\\nmight be slightly {speed} for your child.",
`;

// Helper function to insert additions before the closing bracket of a specific language object
function insertForLanguage(langKey, additions) {
  const target = `    step3Submit: `;
  
  // Find the step3Submit line for the specific language chunk
  // A regex will find the block: ${langKey}: { ... step3Submit: ... }
  
  let langStart = content.indexOf(`  ${langKey}: {`);
  if (langStart === -1) return;
  
  let step3SubmitIndex = content.indexOf(`step3Submit:`, langStart);
  if (step3SubmitIndex === -1) return;
  
  // Find the end of that line
  let endOfLine = content.indexOf(`\n`, step3SubmitIndex);
  
  content = content.substring(0, endOfLine + 1) + additions + content.substring(endOfLine + 1);
}

insertForLanguage('ko', koAdditions);
insertForLanguage('en', enAdditions);
insertForLanguage('ms', enAdditions); // fallback
insertForLanguage('id', enAdditions); // fallback
insertForLanguage('vi', enAdditions); // fallback
insertForLanguage('th', enAdditions); // fallback

fs.writeFileSync(path, content, 'utf8');
console.log('Update Complete');
