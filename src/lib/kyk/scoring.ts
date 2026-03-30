export type KidType = 
  | 'INTJ' | 'INTP' | 'INFJ' | 'INFP' 
  | 'ISTJ' | 'ISTP' | 'ISFJ' | 'ISFP' 
  | 'ENTJ' | 'ENTP' | 'ENFJ' | 'ENFP' 
  | 'ESTJ' | 'ESTP' | 'ESFJ' | 'ESFP'

export interface KYKResultData {
  mbtiType: KidType;
  animalType: string;
  title: string;
  summary: string;
  strengths: string[];
  carePoints: string[];
  approaches: string[];
  axisScores: {
    E: number; I: number;
    S: number; N: number;
    T: number; F: number;
    J: number; P: number;
  }
}

export type KidProfile = Omit<KYKResultData, 'axisScores' | 'animalType' | 'mbtiType'>

export const KID_PROFILES: Record<KidType, KidProfile> = {
  INTJ: {
    title: '냉철한 부엉이',
    summary: '멀리 내다보고 체계적으로 계획하는 전략가형.',
    strengths: ['독립적으로 목표를 향해 나아가며 논리와 분석에 강해요', '효율적인 방법을 찾고 뛰어난 문제해결 능력을 가졌어요'],
    carePoints: ['완벽주의 성향으로 스스로를 강하게 압박할 수 있어요'],
    approaches: ['목표 달성 과정에서 유연성을 키우도록 도와주세요', '다른 사람과의 협업 경험을 늘려 시야를 넓혀주세요']
  },
  INTP: {
    title: '솔직한 물고기',
    summary: '깊이 있는 탐구와 분석을 즐기는 사색가형.',
    strengths: ['새로운 개념과 원리를 이해하는 데 깊이 몰입해요', '지식 탐구를 좋아하고 논리적이고 호기심이 넘쳐요'],
    carePoints: ['실제 행동이나 실행보다는 생각에 머무를 때가 많아요'],
    approaches: ['생각한 것을 작은 실험과 프로젝트로 실현하게 해주세요', '실행으로 옮길 때 성취감이 크다는 걸 느끼게 도와주세요']
  },
  INFJ: {
    title: '상상력 넘치는 풍뎅이',
    summary: '깊은 생각과 공감으로 사람과 세상을 이해하는 상담가형.',
    strengths: ['사람의 마음과 상황의 의미를 따뜻하게 통찰해요', '진정성이 있고 남을 돕는 곳에서 큰 영감을 얻어요'],
    carePoints: ['혼자만의 조용한 시간이 부족하면 쉽게 기가 지칠 수 있어요'],
    approaches: ['자신의 속도를 지키며 충분히 쉴 수 있는 시간을 주세요', '영감을 줄 수 있는 활동을 꾸준히 지원해주세요']
  },
  INFP: {
    title: '이상적인 나비',
    summary: '자신의 가치와 이상을 지키며 살아가는 이상주의형.',
    strengths: ['상상력과 창의력이 풍부하며 믿는 것에 진심을 다해요', '자신만의 깊은 감성을 가지고 다재다능하게 표현해요'],
    carePoints: ['현실적인 문제나 룰에 부딪히면 큰 스트레스를 받을 수 있어요'],
    approaches: ['이상과 현실의 균형을 맞추는 법을 차분히 알려주세요', '규칙 속에서도 자신의 꿈을 이룰 수 있다는 걸 보여주세요']
  },
  ISTJ: {
    title: '조용한 물고기',
    summary: '책임감 있고 신중하며 약속을 잘 지키는 실천형.',
    strengths: ['안정과 질서를 중시하며 차근차근 진행하는 힘이 있어요', '맡은 일을 끝까지 해내어 주변의 두터운 신뢰를 받아요'],
    carePoints: ['새롭거나 갑작스러운 변화를 부담스러워할 수 있어요'],
    approaches: ['안정적인 장점을 칭찬해 주며 새로운 도전을 조금씩 경험하게 해주세요']
  },
  ISTP: {
    title: '관대한 부엉이',
    summary: '실용적이고 분석적인 문제 해결자형.',
    strengths: ['상황에 맞게 빠르게 적응하며 위기 상황에서도 침착해요', '손재주와 관찰력이 뛰어나며 체험하며 배우는 걸 좋아해요'],
    carePoints: ['장기적인 계획이나 긴 호흡의 과제에는 흥미가 적을 수 있어요'],
    approaches: ['긴 호흡의 과제에도 꾸준히 도전하는 습관을 길러주세요', '성취감을 느낄 수 있도록 단기 목표를 적절히 활용해주세요']
  },
  ISFJ: {
    title: '온화한 나비',
    summary: '배려심 깊고 책임감 있는 보호자형.',
    strengths: ['주변 사람을 돕는 것을 좋아하며 세심하게 잘 챙겨요', '조용히 앞장서서 맡은 일을 끝까지 성실하게 해내요'],
    carePoints: ['자기 감정보다 남을 먼저 챙기느라 스스로 지칠 수 있어요'],
    approaches: ['자신을 위한 시간과 취미를 꼭 갖도록 지도해주세요', '거절하는 방법과 마음을 표현하는 방법을 알려주세요']
  },
  ISFP: {
    title: '감성적인 풍뎅이',
    summary: '차분하고 감성적인 예술가형.',
    strengths: ['아름다움과 조화를 중시하며 감각적인 활동에 깊이 몰입해요', '평화롭고 온화하며 다정다감한 성향을 가졌어요'],
    carePoints: ['자신의 의견이나 주장을 강하게 내세우는 걸 부담스러워해요'],
    approaches: ['자기 표현의 방법을 다양하게 익히도록 도와주세요', '자신의 감정과 생각을 자유롭게 나눌 수 있게 지지해주세요']
  },
  ENTJ: {
    title: '야망있는 호랑이',
    summary: '목표를 향해 힘 있게 나아가는 리더형.',
    strengths: ['효율적으로 계획을 세우고 추진하는 능력이 뛰어나요', '어떤 상황에서도 중심을 잡고 아낌없이 결정을 내려요', '경쟁심이 강하고 어려운 도전에도 의욕적으로 임해요'],
    carePoints: ['주변의 속도를 기다리지 못해 조급해질 수 있어요'],
    approaches: ['다른 사람의 의견 듣기와 속도 조절을 가르쳐주세요', '실패도 유연하게 대처하는 힘을 길러주세요']
  },
  ENTP: {
    title: '참견쟁이 늑대',
    summary: '새로운 시도를 즐기고 창의적인 해결책을 잘 찾는 발명가형.',
    strengths: ['호기심이 많고 다양한 관점에서 문제를 바라봐요', '말재주와 순발력이 뛰어나 대화와 토론에 강해요', '대화를 통해 아이디어를 발전시키는 데 능숙해요'],
    carePoints: ['계획보다 즉흥을 선호해 마무리가 약할 수 있어요'],
    approaches: ['풍부한 아이디어를 실현하도록 끝까지 완성하는 습관을 길러주세요', '즉흥성과 계획성을 균형 있게 지도해주세요']
  },
  ENFJ: {
    title: '조화로운 돌고래',
    summary: '타인의 감정을 깊이 이해하고 이끄는 지도자형.',
    strengths: ['관계 속에서 의미를 찾고 다른 사람의 장점을 잘 발견해요', '친구들이 힘들 때 먼저 다가가 도와주는 따뜻한 마음이 있어요'],
    carePoints: ['다른 사람의 문제를 너무 스스로 짊어질 수 있어요'],
    approaches: ['자기 감정을 스스로 돌보는 방법도 배우게 해주세요', '내 몫의 경계를 지키며 건강하게 관계를 유지하도록 도와주세요']
  },
  ENFP: {
    title: '열정적인 말',
    summary: '새로운 경험과 사람을 사랑하는 자유로운 영혼형.',
    strengths: ['상상력이 풍부하고 기발한 재미와 모험을 찾아다녀요', '변화와 도전을 두려워하지 않으며 주변을 활기차게 만들어요'],
    carePoints: ['한 가지에 오래 집중하기 어려울 수 있어요'],
    approaches: ['목표를 끝까지 완수하는 습관을 길러주세요', '아이디어를 실행 계획과 연결하는 연습을 함께 해주세요']
  },
  ESTJ: {
    title: '솔직한 늑대',
    summary: '솔직하고 책임감이 강한 리더형.',
    strengths: ['규칙을 잘 지키고 맡은 일을 끝까지 해내려는 힘이 있어요', '혼자보다는 팀에서 더 빛을 발해요', '주어진 일을 정확하고 빠르게 처리해요'],
    carePoints: ['때로는 자기 생각을 강하게 밀어붙일 수 있어요'],
    approaches: ['다양한 의견을 듣는 연습을 시켜주세요', '틀렸을 때 인정하는 용기를 기르게 해주세요', '규칙이 없는 자유 놀이에서도 즐기는 방법을 알려주세요']
  },
  ESTP: {
    title: '활동적인 호랑이',
    summary: '활발하고 에너지가 넘치는 모험가형.',
    strengths: ['새로운 것에 호기심이 많고 몸으로 부딪히며 배우는 걸 좋아해요', '상황 판단이 빠르고 즉각적인 행동력이 뛰어나요', '친구들 사이에서 분위기 메이커 역할을 해요'],
    carePoints: ['위험을 두려워하지 않지만, 생각보다 행동이 앞설 수 있어요'],
    approaches: ['새로운 경험 시 안전 규칙과 위험 예측 방법을 함께 알려주세요', '활동 전 간단히 계획을 세우는 습관을 길러주세요']
  },
  ESFJ: {
    title: '에너지 넘치는 말',
    summary: '따뜻하고 친절하며 사람을 챙기는 것을 좋아하는 사교형.',
    strengths: ['다른 사람의 기분 변화를 잘 감지하고 분위기를 좋게 만들어요', '모임이나 놀이를 조직하고 친구들을 챙기는 데 적극적이에요', '주변 사람을 돕는 데서 큰 기쁨을 느껴요'],
    carePoints: ['다른 사람의 기대를 너무 의식해 스스로를 힘들게 할 수 있어요'],
    approaches: ['스스로를 위한 시간과 공간을 확보하는 습관을 길러주세요', '모두를 만족시키는 건 어렵다는 사실을 알게 해주세요']
  },
  ESFP: {
    title: '긍정적인 돌고래',
    summary: '밝고 유쾌하며 즉흥적으로 즐거움을 만들어내는 낙천형.',
    strengths: ['순간의 즐거움과 웃음을 만들며 주변을 기분 좋게 해요', '새로운 놀이나 활동에 금방 적응하고 활발하게 참여해요', '새로운 사람이나 경험을 두려워하지 않아요'],
    carePoints: ['계획보다는 즉흥적인 선택을 선호해 가끔 준비가 부족할 수 있어요'],
    approaches: ['중요한 일에서는 준비와 마무리 습관을 길러주세요', '즉흥성과 계획성을 균형 있게 다루는 연습을 도와주세요']
  }
}

export function calculateKYKResult(step2Answers: Record<string, number>): KYKResultData {
  const parseVal = (id: string) => {
    const val = step2Answers[id]
    if (val === undefined || isNaN(val)) return 2.5 // fallback for empty likert
    return val
  }
  
  // E vs I (Q2, Q3, Q4)
  const E_score = parseVal('q2') + (5 - parseVal('q3')) + parseVal('q4')
  const I_score = (5 - parseVal('q2')) + parseVal('q3') + (5 - parseVal('q4'))
  
  // N vs S (Q5, Q6, Q7)
  const N_score = parseVal('q5') + (5 - parseVal('q6')) + parseVal('q7')
  const S_score = (5 - parseVal('q5')) + parseVal('q6') + (5 - parseVal('q7'))

  // T vs F (Q8, Q9, Q10)
  const T_score = (5 - parseVal('q8')) + parseVal('q9') + parseVal('q10')
  const F_score = parseVal('q8') + (5 - parseVal('q9')) + (5 - parseVal('q10'))

  // J vs P (Q11, Q12, Q13)
  const J_score = parseVal('q11') + parseVal('q12') + (5 - parseVal('q13'))
  const P_score = (5 - parseVal('q11')) + (5 - parseVal('q12')) + parseVal('q13')

  const resE = E_score >= I_score ? 'E' : 'I'
  const resN = N_score >= S_score ? 'N' : 'S'
  const resT = T_score >= F_score ? 'T' : 'F'
  const resJ = J_score >= P_score ? 'J' : 'P'

  const mbti = `${resE}${resN}${resT}${resJ}` as KidType

  const MBTI_TO_KOR_ANIMAL: Record<string, string> = {
    INTJ: '부엉이', INTP: '물고기', INFJ: '풍뎅이', INFP: '나비',
    ISTJ: '물고기', ISTP: '부엉이', ISFJ: '나비', ISFP: '풍뎅이',
    ENTJ: '호랑이', ENTP: '늑대', ENFJ: '돌고래', ENFP: '말',
    ESTJ: '늑대', ESTP: '호랑이', ESFJ: '말', ESFP: '돌고래',
  }

  const profile = KID_PROFILES[mbti]

  return {
    mbtiType: mbti,
    animalType: MBTI_TO_KOR_ANIMAL[mbti] || '부엉이',
    ...profile,
    axisScores: {
      E: E_score, I: I_score,
      S: S_score, N: N_score,
      T: T_score, F: F_score,
      J: J_score, P: P_score
    }
  }
}

export const MBTI_TO_TCI: Record<KidType, { NS: number; HA: number; RD: number; PS: number; SD: number; CO: number; ST: number }> = {
  INTJ: { NS: 3, HA: 3, RD: 1, PS: 4, SD: 4, CO: 2, ST: 3 },
  INTP: { NS: 4, HA: 2, RD: 1, PS: 2, SD: 2, CO: 1, ST: 4 },
  INFJ: { NS: 2, HA: 4, RD: 2, PS: 4, SD: 4, CO: 4, ST: 4 },
  INFP: { NS: 4, HA: 2, RD: 4, PS: 2, SD: 2, CO: 3, ST: 4 },
  ISTJ: { NS: 1, HA: 4, RD: 1, PS: 4, SD: 4, CO: 2, ST: 2 },
  ISTP: { NS: 2, HA: 2, RD: 1, PS: 2, SD: 2, CO: 1, ST: 2 },
  ISFJ: { NS: 1, HA: 4, RD: 3, PS: 4, SD: 4, CO: 4, ST: 2 },
  ISFP: { NS: 2, HA: 2, RD: 3, PS: 2, SD: 2, CO: 4, ST: 4 },
  ENTJ: { NS: 3, HA: 2, RD: 1, PS: 4, SD: 4, CO: 2, ST: 2 },
  ENTP: { NS: 4, HA: 1, RD: 2, PS: 2, SD: 2, CO: 1, ST: 4 },
  ENFJ: { NS: 2, HA: 3, RD: 3, PS: 4, SD: 4, CO: 4, ST: 4 },
  ENFP: { NS: 4, HA: 1, RD: 4, PS: 2, SD: 2, CO: 3, ST: 4 },
  ESTJ: { NS: 1, HA: 3, RD: 2, PS: 4, SD: 4, CO: 2, ST: 2 },
  ESTP: { NS: 3, HA: 1, RD: 1, PS: 2, SD: 2, CO: 1, ST: 1 },
  ESFJ: { NS: 2, HA: 3, RD: 4, PS: 4, SD: 4, CO: 4, ST: 2 },
  ESFP: { NS: 4, HA: 1, RD: 4, PS: 2, SD: 2, CO: 4, ST: 2 }
}
