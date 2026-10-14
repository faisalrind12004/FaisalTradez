import { User, UserFlockTier, DepositRecord, WithdrawalRecord, InvestmentTier } from '../types';
import { INVESTMENT_TIERS } from '../data/mockData';

const TOKEN_KEY = 'rozgar_auth_token';
const USER_KEY = 'rozgar_user_profile';
const FLOCKS_KEY = 'rozgar_user_flocks';
const DEPOSITS_KEY = 'rozgar_deposits';
const WITHDRAWALS_KEY = 'rozgar_withdrawals';

// Mock initial user for rapid testing and out-of-the-box demo
const DEFAULT_DEMO_USER: User = {
  id: 'usr_tariq_01',
  name: 'Tariq Mehmood',
  email: 'tariq.farm@gmail.com',
  phone: '03028472911',
  balancePKR: 4250,
  totalWithdrawnPKR: 12800,
  activeTiersCount: 2,
  dailyEarnPKR: 500, // 140 + 360
  eggsHarvestedToday: 0,
  totalEggsHarvested: 840,
  lastEggClaimDate: '',
  joinedAt: '2026-08-15',
  token: 'mock_jwt_header.eyJ1c2VySWQiOiJ1c3JfdGFyaXFfMDEiLCJyb2xlIjoiZmFybWVyIn0.sig_verified_rozgar',
};

const DEFAULT_FLOCKS: UserFlockTier[] = [
  {
    id: 'flock-01',
    tierId: 'tier-starter',
    tierName: 'Starter Pullet Coop',
    henCount: 12,
    investedPKR: 3500,
    dailyReturnPKR: 140,
    startedAt: '2026-09-20',
    daysActive: 24,
    totalDays: 45,
    harvestedPKR: 3360,
    status: 'active',
  },
  {
    id: 'flock-02',
    tierId: 'tier-layer',
    tierName: 'Golden Layer Flock',
    henCount: 30,
    investedPKR: 8500,
    dailyReturnPKR: 360,
    startedAt: '2026-10-01',
    daysActive: 13,
    totalDays: 45,
    harvestedPKR: 4680,
    status: 'active',
  },
];

const DEFAULT_DEPOSITS: DepositRecord[] = [
  {
    id: 'dep-98214',
    adminName: 'M Faisal',
    method: 'EasyPaisa',
    amountPKR: 8500,
    trxId: 'EP8472019482',
    senderAccount: '03028472911',
    status: 'approved',
    submittedAt: '2026-10-01 11:24 AM',
    approvedAt: '2026-10-01 11:32 AM',
  },
  {
    id: 'dep-98215',
    adminName: 'Nek Muhammad',
    method: 'JazzCash',
    amountPKR: 3500,
    trxId: 'JC9934182903',
    senderAccount: '03028472911',
    status: 'approved',
    submittedAt: '2026-09-20 04:15 PM',
    approvedAt: '2026-09-20 04:21 PM',
  },
];

const DEFAULT_WITHDRAWALS: WithdrawalRecord[] = [
  {
    id: 'wdr-10492',
    method: 'EasyPaisa',
    accountTitle: 'Tariq Mehmood',
    accountNumber: '03028472911',
    amountPKR: 5000,
    status: 'completed',
    submittedAt: '2026-10-08 02:40 PM',
  },
  {
    id: 'wdr-10493',
    method: 'JazzCash',
    accountTitle: 'Tariq Mehmood',
    accountNumber: '03028472911',
    amountPKR: 7800,
    status: 'completed',
    submittedAt: '2026-09-28 06:12 PM',
  },
];

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): User | null {
  const token = getStoredToken();
  if (!token) return null;

  const rawUser = localStorage.getItem(USER_KEY);
  if (rawUser) {
    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  }

  // If token exists but user object is missing, initialize default demo
  localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_DEMO_USER));
  return DEFAULT_DEMO_USER;
}

export function initializeDemoDataIfEmpty(): void {
  if (!localStorage.getItem(TOKEN_KEY)) {
    localStorage.setItem(TOKEN_KEY, DEFAULT_DEMO_USER.token);
    localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_DEMO_USER));
  }
  if (!localStorage.getItem(FLOCKS_KEY)) {
    localStorage.setItem(FLOCKS_KEY, JSON.stringify(DEFAULT_FLOCKS));
  }
  if (!localStorage.getItem(DEPOSITS_KEY)) {
    localStorage.setItem(DEPOSITS_KEY, JSON.stringify(DEFAULT_DEPOSITS));
  }
  if (!localStorage.getItem(WITHDRAWALS_KEY)) {
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(DEFAULT_WITHDRAWALS));
  }
}

export function loginUser(emailOrPhone: string, _pass: string): { user: User; token: string } {
  // Generate a mock JWT token with base64 encoded payload
  const tokenPayload = {
    sub: emailOrPhone,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7,
    iss: 'rozgar-poultry-auth',
  };
  const token = `header.${btoa(JSON.stringify(tokenPayload))}.sig_${Date.now()}`;

  // Check if existing user exists
  const existingRaw = localStorage.getItem(USER_KEY);
  let user: User;

  if (existingRaw) {
    const parsed = JSON.parse(existingRaw);
    user = {
      ...parsed,
      token,
    };
  } else {
    user = {
      id: `usr_${Date.now().toString(36)}`,
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Farm Partner',
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@rozgarfarm.pk`,
      phone: emailOrPhone.startsWith('03') ? emailOrPhone : '03001234567',
      balancePKR: 1500,
      totalWithdrawnPKR: 0,
      activeTiersCount: 0,
      dailyEarnPKR: 0,
      eggsHarvestedToday: 0,
      totalEggsHarvested: 0,
      lastEggClaimDate: '',
      joinedAt: new Date().toISOString().split('T')[0],
      token,
    };
  }

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { user, token };
}

export function registerUser(name: string, email: string, phone: string, _pass: string): { user: User; token: string } {
  const tokenPayload = {
    sub: email,
    phone,
    name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7,
    iss: 'rozgar-poultry-auth',
  };
  const token = `header.${btoa(JSON.stringify(tokenPayload))}.sig_${Date.now()}`;

  const newUser: User = {
    id: `usr_${Date.now().toString(36)}`,
    name,
    email,
    phone,
    balancePKR: 500, // Welcome signup bonus for poultry feed test
    totalWithdrawnPKR: 0,
    activeTiersCount: 0,
    dailyEarnPKR: 0,
    eggsHarvestedToday: 0,
    totalEggsHarvested: 0,
    lastEggClaimDate: '',
    joinedAt: new Date().toISOString().split('T')[0],
    token,
  };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  localStorage.setItem(FLOCKS_KEY, JSON.stringify([]));
  return { user: newUser, token };
}

export function logoutUser(): void {
  localStorage.removeItem(TOKEN_KEY);
  // Keep records or user details for seamless re-login if desired, or remove token to secure
}

export function getUserFlocks(): UserFlockTier[] {
  const raw = localStorage.getItem(FLOCKS_KEY);
  if (!raw) return DEFAULT_FLOCKS;
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_FLOCKS;
  }
}

export function buyFlockTier(tier: InvestmentTier): { success: boolean; message: string; updatedUser?: User } {
  const user = getCurrentUser();
  if (!user) return { success: false, message: 'Please sign in to activate this farm flock' };

  if (user.balancePKR < tier.costPKR) {
    return {
      success: false,
      message: `Insufficient balance (₨ ${user.balancePKR.toLocaleString()}). Required: ₨ ${tier.costPKR.toLocaleString()}. Please deposit funds first.`,
    };
  }

  const newFlock: UserFlockTier = {
    id: `flock-${Date.now()}`,
    tierId: tier.id,
    tierName: tier.name,
    henCount: tier.henCount,
    investedPKR: tier.costPKR,
    dailyReturnPKR: tier.dailyReturnPKR,
    startedAt: new Date().toISOString().split('T')[0],
    daysActive: 0,
    totalDays: tier.cycleDays,
    harvestedPKR: 0,
    status: 'active',
  };

  const flocks = getUserFlocks();
  flocks.unshift(newFlock);
  localStorage.setItem(FLOCKS_KEY, JSON.stringify(flocks));

  const updatedUser: User = {
    ...user,
    balancePKR: user.balancePKR - tier.costPKR,
    activeTiersCount: flocks.filter((f) => f.status === 'active').length,
    dailyEarnPKR: flocks.reduce((acc, f) => (f.status === 'active' ? acc + f.dailyReturnPKR : acc), 0),
  };

  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  return { success: true, message: `Successfully activated ${tier.name}! ₨ ${tier.dailyReturnPKR}/day daily egg yield is now active.`, updatedUser };
}

export function claimDailyEggs(): {
  success: boolean;
  earnedPKR: number;
  eggsHarvested: number;
  message: string;
  updatedUser?: User;
} {
  const user = getCurrentUser();
  if (!user) return { success: false, earnedPKR: 0, eggsHarvested: 0, message: 'Not authenticated' };

  const today = new Date().toISOString().split('T')[0];
  if (user.lastEggClaimDate === today) {
    return {
      success: false,
      earnedPKR: 0,
      eggsHarvested: 0,
      message: "Today's egg harvest has already been collected. The next harvest cycle opens tomorrow at 06:00 AM.",
    };
  }

  const flocks = getUserFlocks();
  const activeFlocks = flocks.filter((f) => f.status === 'active');

  if (activeFlocks.length === 0) {
    return {
      success: false,
      earnedPKR: 0,
      eggsHarvested: 0,
      message: 'You have no active laying flocks. Please activate a poultry plan to start collecting daily eggs.',
    };
  }

  // Calculate earnings from active flocks
  const earnedPKR = activeFlocks.reduce((sum, f) => sum + f.dailyReturnPKR, 0);
  const totalHens = activeFlocks.reduce((sum, f) => sum + f.henCount, 0);
  // Estimate ~90% egg yield
  const eggsHarvested = Math.round(totalHens * 0.9);

  // Update flocks progress
  const updatedFlocks = flocks.map((f) => {
    if (f.status === 'active') {
      const nextDays = f.daysActive + 1;
      return {
        ...f,
        daysActive: nextDays,
        harvestedPKR: f.harvestedPKR + f.dailyReturnPKR,
        status: (nextDays >= f.totalDays ? 'completed' : 'active') as 'active' | 'completed',
      };
    }
    return f;
  });

  localStorage.setItem(FLOCKS_KEY, JSON.stringify(updatedFlocks));

  const updatedUser: User = {
    ...user,
    balancePKR: user.balancePKR + earnedPKR,
    eggsHarvestedToday: eggsHarvested,
    totalEggsHarvested: user.totalEggsHarvested + eggsHarvested,
    lastEggClaimDate: today,
    activeTiersCount: updatedFlocks.filter((f) => f.status === 'active').length,
    dailyEarnPKR: updatedFlocks.reduce((acc, f) => (f.status === 'active' ? acc + f.dailyReturnPKR : acc), 0),
  };

  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  return {
    success: true,
    earnedPKR,
    eggsHarvested,
    message: `Harvest collected! +₨ ${earnedPKR.toLocaleString()} credited to your balance (${eggsHarvested} fresh eggs recorded).`,
    updatedUser,
  };
}

export function getDepositRecords(): DepositRecord[] {
  const raw = localStorage.getItem(DEPOSITS_KEY);
  if (!raw) return DEFAULT_DEPOSITS;
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DEPOSITS;
  }
}

export function submitDepositRecord(record: {
  adminName: string;
  method: 'EasyPaisa' | 'JazzCash' | 'Bank Transfer';
  amountPKR: number;
  trxId: string;
  senderAccount: string;
}): DepositRecord {
  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newDeposit: DepositRecord = {
    id: `dep-${Math.floor(10000 + Math.random() * 90000)}`,
    adminName: record.adminName,
    method: record.method,
    amountPKR: record.amountPKR,
    trxId: record.trxId,
    senderAccount: record.senderAccount,
    status: 'pending',
    submittedAt: formattedTime,
  };

  const records = getDepositRecords();
  records.unshift(newDeposit);
  localStorage.setItem(DEPOSITS_KEY, JSON.stringify(records));
  return newDeposit;
}

export function approveDeposit(depositId: string): { success: boolean; updatedUser?: User } {
  const records = getDepositRecords();
  const recordIndex = records.findIndex((r) => r.id === depositId);
  if (recordIndex === -1) return { success: false };

  const target = records[recordIndex];
  if (target.status === 'approved') return { success: true };

  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  records[recordIndex] = {
    ...target,
    status: 'approved',
    approvedAt: formattedTime,
  };
  localStorage.setItem(DEPOSITS_KEY, JSON.stringify(records));

  const user = getCurrentUser();
  if (user) {
    const updatedUser: User = {
      ...user,
      balancePKR: user.balancePKR + target.amountPKR,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return { success: true, updatedUser };
  }

  return { success: true };
}

export function getWithdrawalRecords(): WithdrawalRecord[] {
  const raw = localStorage.getItem(WITHDRAWALS_KEY);
  if (!raw) return DEFAULT_WITHDRAWALS;
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_WITHDRAWALS;
  }
}

export function requestWithdrawal(req: {
  method: 'EasyPaisa' | 'JazzCash' | 'Bank Transfer';
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
  amountPKR: number;
}): { success: boolean; message: string; updatedUser?: User } {
  const user = getCurrentUser();
  if (!user) return { success: false, message: 'Please sign in first' };

  if (req.amountPKR < 500) {
    return { success: false, message: 'Minimum withdrawal amount is ₨ 500' };
  }

  if (user.balancePKR < req.amountPKR) {
    return { success: false, message: `Insufficient balance. Available: ₨ ${user.balancePKR.toLocaleString()}` };
  }

  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const record: WithdrawalRecord = {
    id: `wdr-${Math.floor(10000 + Math.random() * 90000)}`,
    method: req.method,
    accountTitle: req.accountTitle,
    accountNumber: req.accountNumber,
    bankName: req.bankName,
    amountPKR: req.amountPKR,
    status: 'completed', // Instant simulation
    submittedAt: formattedTime,
  };

  const records = getWithdrawalRecords();
  records.unshift(record);
  localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(records));

  const updatedUser: User = {
    ...user,
    balancePKR: user.balancePKR - req.amountPKR,
    totalWithdrawnPKR: user.totalWithdrawnPKR + req.amountPKR,
  };

  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  return { success: true, message: `₨ ${req.amountPKR.toLocaleString()} withdrawn to ${req.accountTitle} (${req.method}).`, updatedUser };
}
