export type AttackStatus = 'idle' | 'processing' | 'compromised' | 'neutralized';

export type HistoryEntry = {
  name: string;
  payload: string;
  defenses: number;
  result: 'compromised' | 'neutralized';
  time: string;
};

export type DefenseState = {
  xml: boolean;
  blacklist: boolean;
  guardian: boolean;
};

export type DefenseKey = keyof DefenseState;
