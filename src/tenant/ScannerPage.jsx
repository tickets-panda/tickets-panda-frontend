import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';
import {
  Camera,
  CameraOff,
  Keyboard,
  Link2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Volume2,
  VolumeX,
  History,
  ShieldCheck,
  RotateCcw,
  Zap,
} from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Card from '../shared/components/Card.jsx';
import Button from '../shared/components/Button.jsx';
import Input, { Select } from '../shared/components/Input.jsx';
import { formatDateTime } from '../shared/utils/format.js';

// Sound synthesis using Web Audio API for fast zero-latency gate feedback
function playGateSound(type) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.15); // E6 note
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } else {
      // Error buzz
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.setValueAtTime(180, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }
  } catch (e) {
    // Audio may be blocked before first user interaction
  }
}

const RESULT_STYLES = {
  CHECKED_IN: {
    tone: 'border-emerald-400 bg-emerald-50 text-emerald-950',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    label: 'ENTRY GRANTED — CHECKED IN',
    sound: 'success',
  },
  VALID: {
    tone: 'border-emerald-400 bg-emerald-50 text-emerald-950',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    label: 'VALID TICKET',
    sound: 'success',
  },
  ALREADY_USED: {
    tone: 'border-amber-400 bg-amber-50 text-amber-950',
    icon: AlertTriangle,
    color: 'text-amber-600',
    label: 'TICKET ALREADY USED',
    sound: 'error',
  },
  NOT_FOUND: {
    tone: 'border-red-400 bg-red-50 text-red-950',
    icon: XCircle,
    color: 'text-red-600',
    label: 'TICKET NOT RECOGNIZED',
    sound: 'error',
  },
};

export default function ScannerPage() {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [manualKey, setManualKey] = useState('');
  const [gateName, setGateName] = useState('Gate 01');
  const [eventId, setEventId] = useState('');
  const [busy, setBusy] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scanHistory, setScanHistory] = useState([]);

  const { data: events } = useQuery({
    queryKey: ['tenant-events', 'scanner'],
    queryFn: async () => (await api.get('/tenant/events', { params: { limit: 50 } })).data.data.rows,
  });

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (scanner) {
      try {
        await scanner.stop();
        await scanner.clear();
      } catch {
        // Scanner might already be stopped
      }
    }
    setScanning(false);
  };

  useEffect(() => () => { stopScanner(); }, []);

  const recordScanHistory = (res, rawKey) => {
    setScanHistory((prev) => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        key: res.ticketKey || rawKey || 'QR Code',
        holder: res.holder?.name || res.holder || 'Attendee',
        status: res.result,
      },
      ...prev.slice(0, 9),
    ]);
  };

  const checkIn = async (payload) => {
    setBusy(true);
    try {
      const { data } = await api.post('/staff/checkin', {
        ...payload,
        gateName,
        eventId: eventId || undefined,
      });
      setResult(data.data);
      if (soundEnabled) playGateSound('success');
      toast.success('Entry Granted!');
      recordScanHistory(data.data, payload.ticketKey || payload.token);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 409) {
        let details = { result: 'ALREADY_USED', message: apiErrorMessage(error) };
        try {
          const { data } = await api.post('/staff/verify', { ...payload, eventId: eventId || undefined });
          details = data.data;
        } catch {
          // ignore
        }
        setResult(details);
        if (soundEnabled) playGateSound('error');
        toast.error('Ticket already scanned!');
        recordScanHistory(details, payload.ticketKey || payload.token);
      } else if (status === 404) {
        const details = { result: 'NOT_FOUND', message: apiErrorMessage(error) };
        setResult(details);
        if (soundEnabled) playGateSound('error');
        toast.error('Ticket not found');
        recordScanHistory(details, payload.ticketKey || payload.token);
      } else {
        const details = { result: 'NOT_FOUND', message: apiErrorMessage(error) };
        setResult(details);
        if (soundEnabled) playGateSound('error');
        toast.error(apiErrorMessage(error));
        recordScanHistory(details, payload.ticketKey || payload.token);
      }
    } finally {
      setBusy(false);
    }
  };

  const startScanner = async () => {
    if (scanning) return;
    try {
      const scanner = new Html5Qrcode('tp-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 12, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await stopScanner();
          await checkIn({ token: decodedText });
        },
        () => {
          // Continuous frame error ignorers
        },
      );
      setScanning(true);
    } catch (error) {
      toast.error(`Camera error: ${error?.message || 'Permission denied'}`);
      setScanning(false);
    }
  };

  const style = result ? RESULT_STYLES[result.result] || RESULT_STYLES.NOT_FOUND : null;
  const ResultIcon = style?.icon;

  const validScansCount = scanHistory.filter((h) => h.status === 'CHECKED_IN' || h.status === 'VALID').length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Top Header with Sound & Settings Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800 mb-1">
            <Zap className="h-3.5 w-3.5 text-emerald-600" />
            <span>Fast Gate Verification</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Check-in Scanner</h1>
          <p className="text-xs text-slate-500">
            Scan attendee QR codes or enter ticket keys for instant gate admittance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
              soundEnabled
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-white text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-600" /> : <VolumeX className="h-4 w-4" />}
            <span>{soundEnabled ? 'Beep On' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Gate & Event Filter Bar */}
      <Card className="p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            label="Event Filter (optional)"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            <option value="">Any Active Event</option>
            {(events || []).map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </Select>
          <Input
            label="Current Gate / Entrance Name"
            value={gateName}
            onChange={(e) => setGateName(e.target.value)}
            placeholder="Main Entrance / Gate 01"
          />
        </div>
      </Card>

      {/* CAMERA SCANNER BOX */}
      <Card className="p-6 text-center shadow-card border-slate-200/90 overflow-hidden">
        <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl bg-slate-950 border-2 border-slate-800 shadow-inner">
          <div id="tp-reader" className="w-full min-h-[260px] bg-slate-950" />

          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 p-6 text-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-emerald-400 mb-3">
                <Camera className="h-7 w-7" />
              </div>
              <p className="font-bold text-sm">Camera Offline</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Activate the camera to start scanning QR code tickets continuously.
              </p>
            </div>
          )}

          {scanning && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {/* Laser scan animation line */}
              <div className="h-0.5 w-4/5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" />
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-center gap-3">
          {!scanning ? (
            <Button
              onClick={startScanner}
              loading={busy}
              size="lg"
              leftIcon={Camera}
              className="shadow-lg shadow-brand-500/25"
            >
              Start Camera Viewfinder
            </Button>
          ) : (
            <Button variant="secondary" size="lg" onClick={stopScanner} leftIcon={CameraOff}>
              Stop Camera
            </Button>
          )}
        </div>
      </Card>

      {/* LIVE SCAN RESULT CARD */}
      {result && style && (
        <div className={`rounded-3xl border-2 p-6 shadow-lg transition-all ${style.tone}`}>
          <div className="flex items-center gap-3.5">
            <ResultIcon className={`h-10 w-10 shrink-0 ${style.color}`} />
            <div>
              <p className={`text-xl font-black tracking-tight ${style.color}`}>{style.label}</p>
              {result.message && <p className="text-xs font-medium opacity-90">{result.message}</p>}
            </div>
          </div>

          {(result.ticketKey || result.holder) && (
            <dl className="mt-4 grid gap-3 rounded-2xl bg-white/80 p-4 text-xs sm:grid-cols-2 shadow-sm">
              {result.ticketKey && (
                <div>
                  <dt className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Ticket Key</dt>
                  <dd className="font-mono font-bold text-slate-900 text-sm">{result.ticketKey}</dd>
                </div>
              )}
              {result.holder?.name && (
                <div>
                  <dt className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Attendee</dt>
                  <dd className="font-bold text-slate-900 text-sm">{result.holder.name}</dd>
                </div>
              )}
              {result.ticketType && (
                <div>
                  <dt className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Admission Tier</dt>
                  <dd className="font-semibold text-brand-600">{result.ticketType}</dd>
                </div>
              )}
              {result.event?.title && (
                <div>
                  <dt className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Festival / Event</dt>
                  <dd className="font-semibold text-slate-800">{result.event.title}</dd>
                </div>
              )}
              {result.activity?.title && (
                <div className="sm:col-span-2">
                  <dt className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Registered Activity</dt>
                  <dd className="font-bold text-orange-700">{result.activity.title}</dd>
                </div>
              )}
              {result.checkedInAt && (
                <div>
                  <dt className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Checked In Timestamp</dt>
                  <dd className="font-medium text-slate-700 font-mono">{formatDateTime(result.checkedInAt)}</dd>
                </div>
              )}
              {result.gateName && (
                <div>
                  <dt className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Recorded Gate</dt>
                  <dd className="font-medium text-slate-700">{result.gateName}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setResult(null);
                if (!scanning) startScanner();
              }}
              leftIcon={RotateCcw}
            >
              Scan Next Ticket
            </Button>
          </div>
        </div>
      )}

      {/* MANUAL TICKET KEY ENTRY */}
      <Card title="Manual Ticket Entry" subtitle="Type the attendee's ticket key if QR is damaged or on paper">
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!manualKey.trim()) return toast.error('Please enter a ticket key');
            checkIn({ ticketKey: manualKey.trim() });
            setManualKey('');
          }}
        >
          <div className="flex-1 min-w-[220px]">
            <Input
              label="Ticket Key / Reference"
              value={manualKey}
              onChange={(e) => setManualKey(e.target.value.toUpperCase())}
              placeholder="e.g. TP-XXXXXXXXXXXX"
              className="font-mono uppercase tracking-wider"
            />
          </div>
          <Button type="submit" loading={busy} leftIcon={Keyboard}>
            Check In
          </Button>
        </form>
      </Card>

      {/* SESSION SCAN HISTORY LOG */}
      {scanHistory.length > 0 && (
        <Card
          title={`Session Scans (${scanHistory.length})`}
          subtitle={`${validScansCount} admitted through ${gateName}`}
          bodyClassName="p-0"
        >
          <div className="divide-y divide-slate-100">
            {scanHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3.5 text-xs hover:bg-slate-50">
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.status === 'CHECKED_IN' || item.status === 'VALID' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  )}
                  <div className="truncate">
                    <p className="font-bold text-slate-800 truncate">{item.holder}</p>
                    <p className="font-mono text-[10px] text-slate-400 truncate">{item.key}</p>
                  </div>
                </div>
                <div className="text-right whitespace-nowrap pl-2">
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      item.status === 'CHECKED_IN' || item.status === 'VALID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
