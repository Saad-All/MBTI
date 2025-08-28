import { MBTIDimension } from '@/lib/types'

export interface CoreQuestion {
  id: string
  dimension: MBTIDimension
  questionKey: string
  optionAKey: string
  optionBKey: string
  optionATendency: string
  optionBTendency: string
}

export const coreQuestions: CoreQuestion[] = [
  {
    id: 'core_1',
    dimension: 'E/I',
    questionKey: 'assessment.core.q1.question',
    optionAKey: 'assessment.core.q1.optionA',
    optionBKey: 'assessment.core.q1.optionB',
    optionATendency: 'E',
    optionBTendency: 'I',
  },
  {
    id: 'core_2',
    dimension: 'S/N',
    questionKey: 'assessment.core.q2.question',
    optionAKey: 'assessment.core.q2.optionA',
    optionBKey: 'assessment.core.q2.optionB',
    optionATendency: 'S',
    optionBTendency: 'N',
  },
  {
    id: 'core_3',
    dimension: 'T/F',
    questionKey: 'assessment.core.q3.question',
    optionAKey: 'assessment.core.q3.optionA',
    optionBKey: 'assessment.core.q3.optionB',
    optionATendency: 'T',
    optionBTendency: 'F',
  },
  {
    id: 'core_4',
    dimension: 'J/P',
    questionKey: 'assessment.core.q4.question',
    optionAKey: 'assessment.core.q4.optionA',
    optionBKey: 'assessment.core.q4.optionB',
    optionATendency: 'J',
    optionBTendency: 'P',
  },
]