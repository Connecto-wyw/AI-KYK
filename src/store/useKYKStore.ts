import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

interface KYKState {
  deviceId: string;
  step1Answers: string[];
  step2Answers: Record<string, number>;
  step3Answers: Record<string, string>;
  
  setStep1: (answers: string[]) => void;
  setStep2: (answers: Record<string, number>) => void;
  setStep3: (answers: Record<string, string>) => void;
  resetAll: () => void;
}

export const useKYKStore = create<KYKState>()(
  persist(
    (set) => ({
      deviceId: uuidv4(),
      step1Answers: [],
      step2Answers: {},
      step3Answers: {},
      
      setStep1: (answers) => set({ step1Answers: answers }),
      setStep2: (answers) => set({ step2Answers: answers }),
      setStep3: (answers) => set({ step3Answers: answers }),
      resetAll: () => set({
        deviceId: uuidv4(),
        step1Answers: [],
        step2Answers: {},
        step3Answers: {},
      })
    }),
    {
      name: 'kyk-survey-storage',
    }
  )
)
