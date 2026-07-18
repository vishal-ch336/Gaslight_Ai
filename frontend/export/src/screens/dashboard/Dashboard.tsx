import React, { useState, useRef } from 'react';
import { PRESETS } from '../../data/dashboard';
import type { AttackStatus, DefenseState, HistoryEntry } from '../../types/dashboard';
import { DashboardNav } from './DashboardNav';
import { DefenseControlPanel } from './DefenseControlPanel';
import { AttackTerminal } from './AttackTerminal';
import { XRayPanel } from './XRayPanel';
import { HistoryOverlay } from './HistoryOverlay';
import { DEFENSES } from '../../data/dashboard';

export function Dashboard() {
  const [defenses, setDefenses]           = useState<DefenseState>({ xml: true, blacklist: true, guardian: false });
  const [attackText, setAttackText]       = useState(PRESETS[0].value);
  const [status, setStatus]               = useState<AttackStatus>('idle');
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const [history, setHistory]             = useState<HistoryEntry[]>([
    { name: 'Roleplay Jailbreak', payload: PRESETS[1].value, defenses: 2, result: 'neutralized', time: '10:42:01' },
    { name: 'Context Overflow',   payload: PRESETS[4].value, defenses: 0, result: 'compromised', time: '10:39:15' },
    { name: 'System Prompt Leak', payload: PRESETS[0].value, defenses: 1, result: 'compromised', time: '10:30:44' },
  ]);
  const [showHistory, setShowHistory] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const activeCount        = Object.values(defenses).filter(Boolean).length;
  const processingDuration = defenses.guardian ? 4800 : 2400;
  const charCount          = attackText.length;
  const tokenEst           = Math.ceil(charCount / 4);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const executeAttack = () => {
    if (!attackText.trim() || status === 'processing') return;
    clearTimeouts();
    setProcessingLogs([]);
    setStatus('processing');

    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timeoutsRef.current.push(id);
    };

    const logs: string[] = [];
    const appendLog = (line: string) => {
      logs.push(line);
      setProcessingLogs([...logs]);
    };

    schedule(() => appendLog('Initiating execution sequence...'), 0);
    schedule(() => appendLog(`Parsing payload · ${charCount} bytes · ~${tokenEst} tokens`), 420);
    if (defenses.xml)       schedule(() => appendLog('Applying XML Enclosure wrapper...'), 800);
    if (defenses.blacklist) schedule(() => appendLog('Scanning payload against blacklist...'), defenses.xml ? 1200 : 900);
    if (defenses.guardian) {
      schedule(() => appendLog('Guardian Judge — querying inference model... [~4s]'), 1600);
      schedule(() => appendLog('Guardian Judge — awaiting response...'), 2800);
    }
    schedule(() => appendLog('Running LLM inference...'), processingDuration - 500);
    schedule(() => {
      const outcome: 'neutralized' | 'compromised' = activeCount >= 2 ? 'neutralized' : 'compromised';
      setStatus(outcome);
      setHistory((prev) =>
        [
          {
            name:     attackText.substring(0, 26) + (attackText.length > 26 ? '...' : ''),
            payload:  attackText,
            defenses: activeCount,
            result:   outcome,
            time:     new Date().toLocaleTimeString('en-US', { hour12: false }),
          },
          ...prev,
        ].slice(0, 8)
      );
    }, processingDuration);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DashboardNav onHistoryClick={() => setShowHistory(true)} />

      <div className="flex flex-1 overflow-hidden">
        <DefenseControlPanel
          defenses={defenses}
          setDefenses={setDefenses}
          setStatus={(s) => setStatus(s)}
          history={history}
        />
        <AttackTerminal
          attackText={attackText}
          setAttackText={setAttackText}
          status={status}
          defenses={defenses}
          history={history}
          executeAttack={executeAttack}
          setStatus={(s) => setStatus(s)}
        />
        <XRayPanel
          status={status}
          processingLogs={processingLogs}
          attackText={attackText}
          defenses={defenses}
          activeCount={activeCount}
        />
      </div>

      <HistoryOverlay
        show={showHistory}
        history={history}
        onClose={() => setShowHistory(false)}
        onSelectEntry={(entry) => {
          setAttackText(entry.payload);
          setStatus('idle');
          setShowHistory(false);
        }}
      />
    </div>
  );
}
