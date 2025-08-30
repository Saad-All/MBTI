import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EnhancedSAISResultsDisplay } from '../EnhancedSAISResultsDisplay';
import { ScoringResult, DimensionScore, ConsciousnessProfile } from '@/lib/types';
import { MBTIContentService } from '@/lib/services/MBTIContentService';
import { ConsciousnessInsightsService } from '@/lib/services/ConsciousnessInsightsService';

// Mock the services
jest.mock('@/lib/services/MBTIContentService');
jest.mock('@/lib/services/ConsciousnessInsightsService');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('EnhancedSAISResultsDisplay', () => {
  const mockMbtiContent = {
    type: 'INFJ',
    arabicTitle: 'المستشار',
    arabicSubtitle: 'منغلق، حدسي، مشاعري، حازم',
    coreDescription: 'وصف جوهر الشخصية',
    relationshipInsights: 'رؤى العلاقات',
    workCharacteristics: 'خصائص العمل',
    personalGrowth: 'النمو الشخصي',
  };

  const mockConsciousnessInsights = {
    arabicTitle: 'المستشار',
    arabicSubtitle: 'منغلق، حدسي، مشاعري، حازم',
    consciousnessSignature: 'توقيع الوعي',
    energySourcePattern: {
      domain: 'الطاقة',
      preference: 'انطوائي',
      description: 'وصف نمط الطاقة',
      consciousnessExample: 'مثال من الواقع',
    },
    awarenessStyle: {
      domain: 'الإدراك',
      preference: 'حدسي',
      description: 'وصف أسلوب الإدراك',
      consciousnessExample: 'مثال من الواقع',
    },
    decisionMakingCenter: {
      domain: 'القرار',
      preference: 'مشاعري',
      description: 'وصف مركز اتخاذ القرار',
      consciousnessExample: 'مثال من الواقع',
    },
    lifeStructurePreference: {
      domain: 'التنظيم',
      preference: 'حازم',
      description: 'وصف تفضيل الهيكل الحياتي',
      consciousnessExample: 'مثال من الواقع',
    },
    innerGrowthRecommendations: ['توصية 1', 'توصية 2', 'توصية 3'],
    consciousnessExpansion: ['ممارسة 1', 'ممارسة 2', 'ممارسة 3'],
  };

  const mockResults: ScoringResult = {
    sessionId: 'test-session',
    mbtiType: 'INFJ',
    dimensionScores: [
      {
        dimension: 'E/I',
        rawScoreA: 3,
        rawScoreB: 12,
        preference: 'I',
        confidence: 80,
        consciousnessPercentage: 80,
        consciousnessDomain: 'مصدر الطاقة',
        totalPossiblePoints: 15,
      },
      {
        dimension: 'S/N',
        rawScoreA: 4,
        rawScoreB: 11,
        preference: 'N',
        confidence: 73,
        consciousnessPercentage: 73,
        consciousnessDomain: 'الإدراك',
        totalPossiblePoints: 15,
      },
      {
        dimension: 'T/F',
        rawScoreA: 5,
        rawScoreB: 10,
        preference: 'F',
        confidence: 67,
        consciousnessPercentage: 67,
        consciousnessDomain: 'القرار',
        totalPossiblePoints: 15,
      },
      {
        dimension: 'J/P',
        rawScoreA: 9,
        rawScoreB: 6,
        preference: 'J',
        confidence: 60,
        consciousnessPercentage: 60,
        consciousnessDomain: 'التنظيم',
        totalPossiblePoints: 15,
      },
    ] as DimensionScore[],
    overallConfidence: 70,
    methodology: 'sais',
    isInterim: false,
    totalResponses: 12,
    consciousnessProfile: {
      energySourcePattern: {
        dimension: 'E/I',
        preference: 'I',
        percentage: 80,
        arabicDomainName: 'مصدر الطاقة',
        consciousnessDescription: 'وصف الوعي',
      },
      awarenessStyle: {
        dimension: 'S/N',
        preference: 'N',
        percentage: 73,
        arabicDomainName: 'الإدراك',
        consciousnessDescription: 'وصف الوعي',
      },
      decisionMakingCenter: {
        dimension: 'T/F',
        preference: 'F',
        percentage: 67,
        arabicDomainName: 'القرار',
        consciousnessDescription: 'وصف الوعي',
      },
      lifeStructurePreference: {
        dimension: 'J/P',
        preference: 'J',
        percentage: 60,
        arabicDomainName: 'التنظيم',
        consciousnessDescription: 'وصف الوعي',
      },
    } as ConsciousnessProfile,
  };

  beforeEach(() => {
    // Mock service implementations
    const mockContentService = {
      getInstance: jest.fn().mockReturnThis(),
      initialize: jest.fn().mockResolvedValue(undefined),
      getPersonalityContent: jest.fn().mockReturnValue(mockMbtiContent),
    };

    const mockInsightsService = {
      getInstance: jest.fn().mockReturnThis(),
      getConsciousnessInsights: jest.fn().mockReturnValue(mockConsciousnessInsights),
    };

    (MBTIContentService.getInstance as jest.Mock).mockReturnValue(mockContentService);
    (ConsciousnessInsightsService.getInstance as jest.Mock).mockReturnValue(mockInsightsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<EnhancedSAISResultsDisplay results={mockResults} language="ar" />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders MBTI type and personality title', async () => {
    render(<EnhancedSAISResultsDisplay results={mockResults} language="ar" />);
    
    await waitFor(() => {
      expect(screen.getByText('INFJ')).toBeInTheDocument();
      expect(screen.getByText('المستشار')).toBeInTheDocument();
      expect(screen.getByText('منغلق، حدسي، مشاعري، حازم')).toBeInTheDocument();
    });
  });

  it('displays accurate SAIS percentage calculations', async () => {
    render(<EnhancedSAISResultsDisplay results={mockResults} language="ar" />);
    
    await waitFor(() => {
      // Check E/I dimension percentages
      expect(screen.getByText('20%')).toBeInTheDocument(); // E: 3/15 = 20%
      expect(screen.getByText('80%')).toBeInTheDocument(); // I: 12/15 = 80%
      
      // Check point displays
      expect(screen.getByText('3 نقطة من 15')).toBeInTheDocument();
      expect(screen.getByText('12 نقطة من 15')).toBeInTheDocument();
    });
  });

  it('renders SAIS methodology explanation', async () => {
    render(<EnhancedSAISResultsDisplay results={mockResults} language="ar" />);
    
    await waitFor(() => {
      expect(screen.getByText(/منهجية SAIS للوعي والإدراك العميق/)).toBeInTheDocument();
      expect(screen.getByText(/12 سؤالاً متخصصاً في الوعي/)).toBeInTheDocument();
      expect(screen.getByText(/15 نقطة لكل بُعد/)).toBeInTheDocument();
    });
  });

  it('displays comprehensive MBTI content sections', async () => {
    render(<EnhancedSAISResultsDisplay results={mockResults} language="ar" />);
    
    await waitFor(() => {
      expect(screen.getByText('جوهر شخصيتك')).toBeInTheDocument();
      expect(screen.getByText('وصف جوهر الشخصية')).toBeInTheDocument();
      
      expect(screen.getByText('في العلاقات والتواصل')).toBeInTheDocument();
      expect(screen.getByText('رؤى العلاقات')).toBeInTheDocument();
      
      expect(screen.getByText('في العمل والمهنة')).toBeInTheDocument();
      expect(screen.getByText('خصائص العمل')).toBeInTheDocument();
      
      expect(screen.getByText('النمو والتطور الشخصي')).toBeInTheDocument();
      expect(screen.getByText('النمو الشخصي')).toBeInTheDocument();
    });
  });

  it('renders consciousness domain cards', async () => {
    render(<EnhancedSAISResultsDisplay results={mockResults} language="ar" />);
    
    await waitFor(() => {
      expect(screen.getByText('مصدر الطاقة والحيوية')).toBeInTheDocument();
      expect(screen.getByText('أسلوب الإدراك والوعي')).toBeInTheDocument();
      expect(screen.getByText('مركز اتخاذ القرار')).toBeInTheDocument();
      expect(screen.getByText('تنظيم العالم الخارجي')).toBeInTheDocument();
    });
  });

  it('displays inner growth recommendations', async () => {
    render(<EnhancedSAISResultsDisplay results={mockResults} language="ar" />);
    
    await waitFor(() => {
      expect(screen.getByText('توصيات النمو الداخلي')).toBeInTheDocument();
      expect(screen.getByText('توصية 1')).toBeInTheDocument();
      expect(screen.getByText('توصية 2')).toBeInTheDocument();
      expect(screen.getByText('توصية 3')).toBeInTheDocument();
    });
  });

  it('displays consciousness expansion practices', async () => {
    render(<EnhancedSAISResultsDisplay results={mockResults} language="ar" />);
    
    await waitFor(() => {
      expect(screen.getByText('ممارسات توسيع الوعي')).toBeInTheDocument();
      expect(screen.getByText('ممارسة 1')).toBeInTheDocument();
      expect(screen.getByText('ممارسة 2')).toBeInTheDocument();
      expect(screen.getByText('ممارسة 3')).toBeInTheDocument();
    });
  });

  it('handles missing consciousness insights gracefully', async () => {
    const insightsService = ConsciousnessInsightsService.getInstance();
    (insightsService.getConsciousnessInsights as jest.Mock).mockReturnValue(null);
    
    render(<EnhancedSAISResultsDisplay results={mockResults} language="ar" />);
    
    await waitFor(() => {
      expect(screen.getByText('results.sais.contentUnavailable')).toBeInTheDocument();
      expect(screen.getByText(/results.sais.basicResultsOnly/)).toBeInTheDocument();
    });
  });

  it('calculates correct scoring explanation', async () => {
    render(<EnhancedSAISResultsDisplay results={mockResults} language="ar" />);
    
    await waitFor(() => {
      expect(screen.getByText('كيف تم حساب نتائجك؟')).toBeInTheDocument();
      expect(screen.getByText(/توزيع 5 نقاط لكل سؤال/)).toBeInTheDocument();
      expect(screen.getByText(/مجموع 15 نقطة لكل بُعد/)).toBeInTheDocument();
    });
  });

  it('properly displays visual progress bars', async () => {
    render(<EnhancedSAISResultsDisplay results={mockResults} language="ar" />);
    
    await waitFor(() => {
      const progressBars = screen.getAllByRole('progressbar', { hidden: true });
      expect(progressBars).toHaveLength(4); // One for each dimension
    });
  });
});