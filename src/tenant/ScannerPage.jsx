import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { Camera, CameraOff, Keyboard, Link2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Card from '../shared/components/Card.jsx';
import Button from '../shared/components/Button.jsx';
import Input, { Select } from '../shared/components/Input.jsx';
import { formatDateTime } from '../shared/utils/format.js';

const RESULT_STYLES = {
  CHECKED_IN: { tone: 'border-emerald-300 bg-emerald-50', icon: CheckCircle2, color: 'text-emerald-600', label: 'Checked in' },
  VALID: { tone: 'border-emerald-300 bg-emerald-50', icon: CheckCircle2, color: 'text-emerald-600', label: 'Valid ticket' },
  ALREADY_USED: { tone: 'border-amber-300 bg-amber-50', icon: AlertTriangle, color: 'text-amber-600', label: 'Already used' },
  NOT_FOUND: { tone: 'border-red-300 bg-red-50', icon: XCircle, color: 'text-red-600', label: 'Ticket not found' },
};

export default function ScannerPage() {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [manualKey, setManualKey] = useState('');
  const [gateName, setGateName] = useState('Gate 01');
  const [eventId, setEventId] = useState('');
  const [busy, setBusy] = useState(false);

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
        // Scanner may already be stopped.
      }
    }
    setScanning(false);
  };

  useEffect(() => () => { stopScanner(); }, []);

  const checkIn = async (payload) => {
    setBusy(true);
    try {
      const { data } = await api.post('/staff/checkin', { ...payload, gateName, eventId: eventId || undefined });
      setResult(data.data);
      toast.success('Entry granted');
    } catch (error) {
      const status = error?.response?.status;
      if (status === 409) {
        try {
          const { data } = await api.post('/staff/verify', { ...payload, eventId: eventId || undefined });
          setResult(data.data);
        } catch {
          setResult({ result: 'ALREADY_USED', message: apiErrorMessage(error) });
        }
        toast.error('This ticket was already used');
      } else if (status === 404) {
        setResult({ result: 'NOT_FOUND', message: apiErrorMessage(error) });
        toast.error('Ticket not found');
      } else {
        toast.error(apiErrorMessage(error));
        setResult({ result: 'NOT_FOUND', message: apiErrorMessage(error) });
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
        { fps: 10, qrbox: { width: 240, height: 240 } },
        async (decodedText) => {
          await stopScanner();
          await checkIn({ token: decodedText });
        },
        () => {
          // Per-frame decode errors are expected; ignore them.
        },
      );
      setScanning(true);
    } catch (error) {
      toast.error(`Camera unavailable: ${error?.message || 'permission denied'}`);
      setScanning(false);
    }
  };

  const style = result ? RESULT_STYLES[result.result] || RESULT_STYLES.NOT_FOUND : null;
  const ResultIcon = style?.icon;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Check-in scanner" description="Scan a ticket QR or type the ticket key." />

      <Card title="Gate settings" className="mb-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Event (optional)" value={eventId} onChange={(e) => setEventId(e.target.value)}>
            <option value="">Any event</option>
            {(events || []).map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </Select>
          <Input label="Gate name" value={gateName} onChange={(e) => setGateName(e.target.value)} placeholder="Gate 01" />
        </div>
      </Card>

      <Card title="Scan QR code" className="mb-5">
        <div id="tp-reader" className="mx-auto w-full max-w-sm overflow-hidden rounded-xl bg-zinc-900/5" />

        <div className="mt-4 flex justify-center gap-3">
          {!scanning ? (
            <Button onClick={startScanner} loading={busy}>
              <Camera className="h-4 w-4" /> Start camera
            </Button>
          ) : (
            <Button variant="secondary" onClick={stopScanner}>
              <CameraOff className="h-4 w-4" /> Stop camera
            </Button>
          )}
        </div>
      </Card>

      <Card title="Manual entry" className="mb-5">
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!manualKey.trim()) return toast.error('Enter a ticket key');
            checkIn({ ticketKey: manualKey.trim() });
            setManualKey('');
          }}
        >
          <div className="flex-1 min-w-[200px]">
            <Input
              label="Ticket key"
              value={manualKey}
              onChange={(e) => setManualKey(e.target.value.toUpperCase())}
              placeholder="TP-XXXXXXXXXXXX"
            />
          </div>
          <Button type="submit" loading={busy}>
            <Keyboard className="h-4 w-4" /> Check in
          </Button>
        </form>
        <p className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
          <Link2 className="h-3 w-3" /> Scanning a full verification URL works too.
        </p>
      </Card>

      {result && style && (
        <div className={`rounded-xl border p-5 ${style.tone}`}>
          <div className="flex items-center gap-3">
            <ResultIcon className={`h-8 w-8 ${style.color}`} />
            <div>
              <p className={`text-lg font-bold ${style.color}`}>{style.label}</p>
              {result.message && <p className="text-sm text-zinc-600">{result.message}</p>}
            </div>
          </div>

          {(result.ticketKey || result.holder) && (
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {result.ticketKey && (
                <div>
                  <dt className="text-xs text-zinc-500">Ticket</dt>
                  <dd className="font-mono font-semibold text-zinc-800">{result.ticketKey}</dd>
                </div>
              )}
              {result.holder?.name && (
                <div>
                  <dt className="text-xs text-zinc-500">Holder</dt>
                  <dd className="font-medium text-zinc-800">{result.holder.name}</dd>
                </div>
              )}
              {result.ticketType && (
                <div>
                  <dt className="text-xs text-zinc-500">Type</dt>
                  <dd className="font-medium text-zinc-800">{result.ticketType}</dd>
                </div>
              )}
              {result.event?.title && (
                <div>
                  <dt className="text-xs text-zinc-500">Event</dt>
                  <dd className="font-medium text-zinc-800">{result.event.title}</dd>
                </div>
              )}
              {result.activity?.title && (
                <div>
                  <dt className="text-xs text-zinc-500">Activity</dt>
                  <dd className="font-semibold text-orange-700">{result.activity.title}</dd>
                </div>
              )}
              {result.checkedInAt && (
                <div>
                  <dt className="text-xs text-zinc-500">Checked in at</dt>
                  <dd className="font-medium text-zinc-800">{formatDateTime(result.checkedInAt)}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      )}
    </div>
  );
}
