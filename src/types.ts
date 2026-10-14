export type ViewState = 'landing' | 'dashboard' | 'deposit' | 'login' | 'register';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  balancePKR: number;
  totalWithdrawnPKR: number;
  activeTiersCount: number;
  dailyEarnPKR: number;
  eggsHarvestedToday: number;
  totalEggsHarvested: number;
  lastEggClaimDate: string; // YYYY-MM-DD
  joinedAt: string;
  token: string;
}

export interface InvestmentTier {
  id: string;
  name: string;
  tagline: string;
  henCount: number;
  costPKR: number;
  dailyReturnPKR: number;
  cycleDays: number;
  totalReturnPKR: number;
  profitPercentage: number;
  eggYieldPerDay: number;
  feedIncluded: boolean;
  insuranceCovered: boolean;
  featured?: boolean;
}

export interface UserFlockTier {
  id: string;
  tierId: string;
  tierName: string;
  henCount: number;
  investedPKR: number;
  dailyReturnPKR: number;
  startedAt: string;
  daysActive: number;
  totalDays: number;
  harvestedPKR: number;
  status: 'active' | 'completed';
}

export interface AdminContact {
  id: string;
  name: string;
  phone: string;
  title: string;
  methods: string[];
  bankDetails?: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
  };
  whatsappUrl: string;
  telUrl: string;
  avatarSeed: string;
}

export interface DepositRecord {
  id: string;
  adminName: string;
  method: 'EasyPaisa' | 'JazzCash' | 'Bank Transfer';
  amountPKR: number;
  trxId: string;
  senderAccount: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
}

export interface WithdrawalRecord {
  id: string;
  method: 'EasyPaisa' | 'JazzCash' | 'Bank Transfer';
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
  amountPKR: number;
  status: 'pending' | 'completed';
  submittedAt: string;
}
