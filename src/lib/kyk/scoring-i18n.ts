import { KidType, KidProfile, KID_PROFILES as KID_PROFILES_KO } from './scoring'

export const KID_PROFILES_EN: Record<KidType, KidProfile> = {
  INTJ: {
    title: 'Cool-headed Owl',
    summary: 'A strategist who looks far ahead and plans systematically.',
    strengths: ['Works independently toward goals with strong logic and analysis.', 'Finds efficient methods and has excellent problem-solving skills.'],
    carePoints: ['May put intense pressure on themselves due to perfectionist tendencies.'],
    approaches: ['Help them develop flexibility while achieving goals.', 'Encourage collaboration to broaden their perspective.']
  },
  INTP: {
    title: 'Honest Fish',
    summary: 'A thinker who enjoys deep exploration and analysis.',
    strengths: ['Immerses deeply in understanding new concepts and principles.', 'Loves exploring knowledge, is logical, and full of curiosity.'],
    carePoints: ['Often stays in thought rather than taking actual action or execution.'],
    approaches: ['Help them realize their thoughts through small experiments and projects.', 'Let them experience the great sense of accomplishment when taking action.']
  },
  INFJ: {
    title: 'Imaginative Beetle',
    summary: 'A counselor who understands people and the world with deep thought and empathy.',
    strengths: ['Warmly insights into the minds of people and the meaning of situations.', 'Is authentic and gains great inspiration from helping others.'],
    carePoints: ['Can easily get exhausted if they lack quiet time alone.'],
    approaches: ['Give them enough time to rest at their own pace.', 'Consistently support activities that can inspire them.']
  },
  INFP: {
    title: 'Idealistic Butterfly',
    summary: 'An idealist who lives protecting their values and ideals.',
    strengths: ['Rich in imagination and creativity, sincerely dedicated to what they believe in.', 'Has their own deep sensitivity and expresses it in versatile ways.'],
    carePoints: ['Can be highly stressed when faced with harsh practical problems or rules.'],
    approaches: ['Calmly teach them how to balance ideals and reality.', 'Show them that they can achieve their dreams even within rules.']
  },
  ISTJ: {
    title: 'Quiet Fish',
    summary: 'A practitioner who is responsible, cautious, and keeps promises well.',
    strengths: ['Values stability and order, with the power to proceed step by step.', 'Earns deep trust from others by seeing tasks through to the end.'],
    carePoints: ['May feel burdened by new or sudden changes.'],
    approaches: ['Praise their stable strengths and let them experience new challenges little by little.']
  },
  ISTP: {
    title: 'Generous Owl',
    summary: 'A practical and analytical problem solver.',
    strengths: ['Adapts quickly to situations and remains calm even in crises.', 'Excellent dexterity and observation skills, loves learning through experience.'],
    carePoints: ['May have less interest in long-term plans or lengthy tasks.'],
    approaches: ['Help them develop the habit of consistently tackling long-term tasks.', 'Appropriately use short-term goals so they can feel a sense of accomplishment.']
  },
  ISFJ: {
    title: 'Gentle Butterfly',
    summary: 'A thoughtful and responsible protector.',
    strengths: ['Enjoys helping people around them and takes good care of details.', 'Quietly takes the lead and faithfully completes their assigned tasks.'],
    carePoints: ['May exhaust themselves by taking care of others before their own feelings.'],
    approaches: ['Guide them to definitely have time and hobbies for themselves.', 'Teach them how to refuse and express their own feelings.']
  },
  ISFP: {
    title: 'Emotional Beetle',
    summary: 'A calm and emotional artist.',
    strengths: ['Values beauty and harmony, immersing deeply in sensory activities.', 'Has a peaceful, gentle, and affectionate disposition.'],
    carePoints: ['Feels burdened by strongly asserting their opinions or arguments.'],
    approaches: ['Help them learn various ways of self-expression.', 'Support them so they can freely share their feelings and thoughts.']
  },
  ENTJ: {
    title: 'Ambitious Tiger',
    summary: 'A leader who powerfully advances toward goals.',
    strengths: ['Excellent at efficiently planning and driving tasks forward.', 'Maintains balance and makes unhesitating decisions in any situation.', 'Highly competitive and enthusiastic even in difficult challenges.'],
    carePoints: ['Can become impatient if others do not match their speed.'],
    approaches: ['Teach them to listen to others\' opinions and adjust their pace.', 'Help them develop the strength to flexibly cope with failures.']
  },
  ENTP: {
    title: 'Meddlesome Wolf',
    summary: 'An inventor who enjoys new attempts and finds creative solutions.',
    strengths: ['Highly curious and looks at problems from various perspectives.', 'Excellent eloquence and quick wit, strong in conversations and debates.', 'Proficient at developing ideas through conversation.'],
    carePoints: ['May lack finishing skills as they prefer spontaneity over planning.'],
    approaches: ['Help them develop the habit of seeing things through to completion.', 'Guide them to balance spontaneity and planning.']
  },
  ENFJ: {
    title: 'Harmonious Dolphin',
    summary: 'A leader who deeply understands and guides others\' feelings.',
    strengths: ['Finds meaning in relationships and excels at discovering others\' strengths.', 'Has a warm heart that reaches out to help friends in need.'],
    carePoints: ['May burden themselves too much with other people\'s problems.'],
    approaches: ['Let them learn how to take care of their own feelings.', 'Help them maintain healthy relationships while protecting their own boundaries.']
  },
  ENFP: {
    title: 'Passionate Horse',
    summary: 'A free spirit who loves new experiences and people.',
    strengths: ['Rich in imagination, seeks out quirky fun and adventures.', 'Not afraid of change and challenges, making the surroundings vibrant.'],
    carePoints: ['May find it difficult to concentrate on one thing for a long time.'],
    approaches: ['Help them build the habit of completing goals to the end.', 'Practice connecting their ideas with action plans together.']
  },
  ESTJ: {
    title: 'Honest Wolf',
    summary: 'An honest leader with a strong sense of responsibility.',
    strengths: ['Strong ability to follow rules and complete assigned tasks.', 'Shines more in a team than alone.', 'Handles assigned tasks accurately and quickly.'],
    carePoints: ['Sometimes may push their own thoughts too strongly.'],
    approaches: ['Have them practice listening to diverse opinions.', 'Encourage the courage to admit when they are wrong.', 'Teach them how to enjoy free play without rules too.']
  },
  ESTP: {
    title: 'Active Tiger',
    summary: 'An active and energetic adventurer.',
    strengths: ['Curious about new things and loves learning physically.', 'Quick at assessing situations and has excellent immediate action.', 'Acts as a mood maker among friends.'],
    carePoints: ['Not afraid of risks, but actions might precede thoughts.'],
    approaches: ['Teach them safety rules and risk prediction methods for new experiences.', 'Help them build the habit of planning briefly before acting.']
  },
  ESFJ: {
    title: 'Energetic Horse',
    summary: 'A sociable type who is warm, kind, and loves taking care of people.',
    strengths: ['Well detects others\' mood changes and creates a good atmosphere.', 'Proactive in organizing gatherings or play and taking care of friends.', 'Finds great joy in helping people around them.'],
    carePoints: ['May exhaust themselves by being too conscious of others\' expectations.'],
    approaches: ['Help them build the habit of securing time and space for themselves.', 'Let them know that it is difficult to satisfy everyone.']
  },
  ESFP: {
    title: 'Positive Dolphin',
    summary: 'An optimistic type who is bright, cheerful, and spontaneously creates joy.',
    strengths: ['Creates moments of joy and laughter, making the surroundings feel good.', 'Quickly adapts to new play or activities and participates actively.', 'Not afraid of new people or experiences.'],
    carePoints: ['Prefers spontaneous choices over planning, which can lead to lack of preparation sometimes.'],
    approaches: ['Help them build preparation and finishing habits for important tasks.', 'Assist them in practicing a balance between spontaneity and planning.']
  }
}

export const getLocalizedProfiles = (lang: string) => {
  if (lang === 'ko') return KID_PROFILES_KO
  return KID_PROFILES_EN
}
