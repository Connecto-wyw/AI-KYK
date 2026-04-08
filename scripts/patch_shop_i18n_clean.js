const fs = require('fs');
const path = require('path');

const dictPath = path.join('src', 'lib', 'i18n', 'dictionaries.ts');
let content = fs.readFileSync(dictPath, 'utf8');

const t = {
  ko: `    shopItem2Sub: "한국 엄마들이 선택한 산후조리 필수템. 집에서 경험하는 K-산후조리 프리미엄 키트.",
    shopItem2TrendTitle: "K-산후조리 스타터 키트",
    shopItem2TrendDesc: "최고급 자연 유래 성분으로 완성한 집 안에서의 완벽한 회복.",
    shopItem2F1Title: "한국 엄마들의 신뢰 👶",
    shopItem2F1Desc: "산후조리 전통을 살려 체온을 보호하고 관절 회복과 스트레스 완화에 도움을 줍니다.",
    shopItem2F2Title: "데일리 마일드 리커버리 🌿",
    shopItem2F2Desc: "진정 작용을 하는 부드러운 성분이 출산 후 회복 과정을 편안하게 만들어 줍니다.",
    shopItem2F3Title: "따뜻함과 안락함 ♨️",
    shopItem2F3Desc: "산후 몸을 따뜻하게 보호하는 K-조리 문화를 그대로 담아 신체를 안전하게 보호합니다.",
    shopItem2F4Title: "바로 사용하는 간편함 🛍️",
    shopItem2F4Desc: "번거로운 준비 없이 바쁜 초보 엄마들도 바로 사용할 수 있도록 완벽하게 구성되었습니다.",
    shopItem2F5Title: "집에서 누리는 셀프 케어 🌸",
    shopItem2F5Desc: "정서적, 신체적 회복을 돕는 안락한 케어를 집안 가장 편안한 공간에서 만나보세요.",
    shopItem2WhyTitle: "한국 엄마들의 선택",
    shopItem2WhyL1: "안전하고 검증된 전통 산후조리 영감",
    shopItem2WhyL2: "최강의 회복을 위한 프리미엄 식물성 성분",
    shopItem2WhyL3: "정서적 안정을 위한 세심한 디자인",
    shopItem2WhyL4: "실패 없는 확실한 회복 포커스",
    shopItem2WhyFooter: "휴식, 따뜻함, 회복. 가장 완벽한 조리.",
    shopItem3Sub: "아이들의 독립적인 식사용으로 설계된 안전하고 감각적인 실리콘 식기 세트.",
    shopItem3TrendTitle: "K-키즈 실리콘 식기 세트",
    shopItem3TrendDesc: "안전. 스마트. 모던 패밀리를 위해 아름답게 디자인되었습니다.",
    shopItem3F1Title: "작은 손을 위한 디자인 👐 👶",
    shopItem3F1Desc: "혼자 먹기 시작하는 작은 손에 맞춰 세심하게 형태를 잡았습니다. 인체공학적 곡선이 아이의 성취감을 높여줍니다.",
    shopItem3F2Title: "안전한 푸드그레이드 실리콘 🍼 💧",
    shopItem3F2Desc: "한국 부모님들이 신뢰하는 BPA 프리 실리콘으로 제작되었습니다. 부드럽고 튼튼하여 입에 닿아도 안심입니다.",
    shopItem3F3Title: "강력한 흡착, 깔끔한 식사 💫 🍽️",
    shopItem3F3Desc: "강력한 흡착 바닥이 그릇을 단단하게 고정합니다. 식탁이 덜 어질러지고 엄마와 아기 모두 평화로운 식사가 가능합니다.",
    shopItem3F4Title: "간편한 세척과 실용성 🧼 ✨",
    shopItem3F4Desc: "식기세척기 사용이 가능하며 손세척도 간편합니다. 바쁜 육아 일상에 딱 맞는 최고의 피로 해소 육아템.",
    shopItem3F5Title: "모던 코리안 디자인 🎀 🌸",
    shopItem3F5Desc: "부드러운 뉴트럴 톤과 깔끔한 미학. 식탁 위에 그냥 두어도 예쁠 만큼 현대적인 감각을 자랑합니다.",
    shopItem3WhyTitle: "초보 부모님 필수템",
    shopItem3WhyL1: "믿을 수 있는 100% 안전 소재",
    shopItem3WhyL2: "자기주도 식사 완벽 지원",
    shopItem3WhyL3: "식사 시간의 스트레스 대폭 감소",
    shopItem3WhyL4: "세련된 모던 홈 인테리어와 조화",
    shopItem3WhyFooter: "스마트한 식사시간, 가장 안전한 K-육아."`,

  en: `    shopItem2Sub: "A curated set of essential postpartum care items used by Korean mothers. Offers a simple way to experience Korean-style postpartum self-care at home.",
    shopItem2TrendTitle: "Korean Postpartum Care Starter Kit",
    shopItem2TrendDesc: "Using the best of natural botanicals. Focus fully on gentle recovery in your own home.",
    shopItem2F1Title: "Trusted by Korean Mothers 👶",
    shopItem2F1Desc: "Following postpartum tradition (sanhujori), this setup preserves your body's warmth while recovering. This helps with managing joint recovery, stress, and setting the tone.",
    shopItem2F2Title: "Gentle Daily Recovery 🌿",
    shopItem2F2Desc: "Relaxing and gentle, soothing elements let you feel calm and tight throughout the postpartum process. Experience a true recovery state with every shower.",
    shopItem2F3Title: "Warmth & Comfort First ♨️",
    shopItem2F3Desc: "Korean postpartum care emphasizes warmth and protection to heal the body. Take your routine seriously gathering priority and protection.",
    shopItem2F4Title: "Simple, Ready to Use Set 🛍️",
    shopItem2F4Desc: "No setup needed. Perfect for busy new moms who want recovery without guesswork.",
    shopItem2F5Title: "Self-Care at Home 🌸",
    shopItem2F5Desc: "Recovery is emotional as much as physical. Bring postpartum care right into your comfortable home.",
    shopItem2WhyTitle: "Why Moms in Korea Love It",
    shopItem2WhyL1: "Inspired by Korea's trusted postpartum tradition",
    shopItem2WhyL2: "Premium botanicals for ultimate postpartum relief",
    shopItem2WhyL3: "Designed for emotional recovery, comfort and ease",
    shopItem2WhyL4: "No guesswork, just pure recovery focus",
    shopItem2WhyFooter: "Rest, Warmth, Recovery, The Korean way.",
    shopItem3Sub: "A safe and stylish tableware set designed for young children. Inspired by Korean parenting standards for daily meals and independent eating.",
    shopItem3TrendTitle: "K-Kids Silicone Tableware Set",
    shopItem3TrendDesc: "Safe. Smart. Beautifully designed for modern families.",
    shopItem3F1Title: "Designed for Little Hands 👐 👶",
    shopItem3F1Desc: "Thoughtfully shaped for small hands learning to eat independently. The ergonomic curves and balanced weight help children grip comfortably.",
    shopItem3F2Title: "Safe, Food-Grade Silicone 🍼 💧",
    shopItem3F2Desc: "Made with BPA-free, food-grade silicone trusted by Korean parents. Soft, durable, and gentle on little mouths, giving parents peace of mind.",
    shopItem3F3Title: "Strong Suction, Less Mess 💫 🍽️",
    shopItem3F3Desc: "The powerful suction base keeps bowls and plates firmly in place. Less slipping, fewer spills, and calmer mealtimes.",
    shopItem3F4Title: "Everyday Practical & Easy to Clean 🧼 ✨",
    shopItem3F4Desc: "Dishwasher-safe and effortless to wash by hand. Designed for busy family routines, Because parenting is demanding enough.",
    shopItem3F5Title: "Minimal Korean Design 🎀 🌸",
    shopItem3F5Desc: "Soft neutral tones and a clean, modern aesthetic. Beautiful enough to leave on your table.",
    shopItem3WhyTitle: "Why Parents Love It in Southeast Asia",
    shopItem3WhyL1: "Safe materials you can trust",
    shopItem3WhyL2: "Designed to support self-feeding milestones",
    shopItem3WhyL3: "Reduces mealtime stress and mess",
    shopItem3WhyL4: "Stylish enough for modern homes",
    shopItem3WhyFooter: "Smarter mealtimes, Safer materials, The Korean way."`
};

const langs = ['ko', 'en', 'ms', 'id', 'vi', 'th'];

langs.forEach(lang => {
  const appendText = lang === 'ko' ? t.ko : t.en;
  
  const blockStart = content.indexOf('  ' + lang + ': {');
  if (blockStart === -1) return;
  const blockEnd = content.indexOf('  },', blockStart);
  if (blockEnd === -1) return;
  
  const block = content.substring(blockStart, blockEnd);
  
  // Find shopBackToTeam key dynamically
  const match = block.match(/shopBackToTeam:\s*"[^"]+"/);
  if (match) {
    const newBlock = block.replace(match[0], match[0] + ',\n' + appendText);
    content = content.replace(block, newBlock);
    console.log('Patched ' + lang);
  }
});

fs.writeFileSync(dictPath, content);
