import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

interface Step4Answers {
  parentValues: string[];
  childLevels: Record<string, number>;
  parentStyle: string;
}

interface KYKState {
  deviceId: string;
  step1Answers: string[];
  step2Answers: Record<string, number>;
  step3Answers: Record<string, string>;
  step4Answers: Step4Answers;
  
  setStep1: (answers: string[]) => void;
  setStep2: (answers: Record<string, number>) => void;
  setStep3: (answers: Record<string, string>) => void;
  setStep4: (answers: Step4Answers) => void;
  resetAll: () => void;
}

export const useKYKStore = create<KYKState>()(
  persist(
    (set) => ({
      deviceId: uuidv4(),
      step1Answers: [],
      step2Answers: {},
      step3Answers: {},
      step4Answers: { parentValues: [], childLevels: {}, parentStyle: '' },
      
      setStep1: (answers) => set({ step1Answers: answers }),
      setStep2: (answers) => set({ step2Answers: answers }),
      setStep3: (answers) => set({ step3Answers: answers }),
      setStep4: (answers) => set({ step4Answers: answers }),
      resetAll: () => set({
        deviceId: uuidv4(),
        step1Answers: [],
        step2Answers: {},
        step3Answers: {},
        step4Answers: { parentValues: [], childLevels: {}, parentStyle: '' },
      })
    }),
    {
      name: 'kyk-survey-storage',
    }
  )
)
