import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';

const defaultMaterials = [
  { name: 'PLA+' },
  { name: 'PETG' },
  { name: 'TPU' },
  { name: 'ABS' },
];

const defaultSlots = [
  { time: '09:00 AM - 11:00 AM', status: 'Booked' },
  { time: '11:00 AM - 01:00 PM', status: 'Available' },
  { time: '01:00 PM - 03:00 PM', status: 'Available' },
  { time: '03:00 PM - 05:00 PM', status: 'Pending' },
  { time: '05:00 PM - 07:00 PM', status: 'Available' },
];

export default function ClientDashboard({ user, token, onLogout }) {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinterId, setSelectedPrinterId] = useState('x1-carbon');
  const [liveFeed, setLiveFeed] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [quote, setQuote] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState('PLA+');
  const [selectedSlot, setSelectedSlot] = useState(defaultSlots[1].time);
  const [bookingStatus, setBookingStatus] = useState('');
  const [printerControlStatus, setPrinterControlStatus] = useState('');
  const [connectionMethod, setConnectionMethod] = useState('local');
  const [loading, setLoading] = useState(false);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    async function loadPrinters() {
      try {
        const res = await axios.get('http://localhost:5000/api/printers', { headers: authHeaders });
        setPrinters(res.data.printers || []);
      } catch (error) {
        console.warn('Unable to load printers:', error.message);
      }
    }

    loadPrinters();
  }, [authHeaders]);

  useEffect(() => {
    let interval;

    async function loadLiveFeed() {
      if (!selectedPrinterId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/live/${selectedPrinterId}`, { headers: authHeaders });
        setLiveFeed(res.data.liveFeed || res.data.printer || null);
      } catch (error) {
        console.warn('Unable to load live feed:', error.message);
      }
    }

    loadLiveFeed();
    interval = setInterval(loadLiveFeed, 8000);
    return () => clearInterval(interval);
  }, [selectedPrinterId, authHeaders]);

  const availableCount = useMemo(() => printers.filter((printer) => printer.status === 'Available').length, [printers]);
  const printingCount = useMemo(() => printers.filter((printer) => printer.status === 'Printing').length, [printers]);
  const pausedCount = useMemo(() => printers.filter((printer) => printer.status === 'Paused').length, [printers]);

  const uploadFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', ...authHeaders },
      });
      setUploadedFile(res.data.file);
      setAnalysis(res.data.analysis);
      setQuote(null);
      setBookingStatus('');
    } catch (error) {
      console.error('Upload failed:', error.message);
      setBookingStatus('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const requestQuote = async () => {
    if (!uploadedFile) {
      setBookingStatus('Please upload a file before requesting a quote.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:5000/api/quote',
        {
          fileName: uploadedFile.originalname,
          sizeBytes: uploadedFile.size,
          material: selectedMaterial,
          printerId: selectedPrinterId,
          quality: 'standard',
        },
        { headers: authHeaders },
      );

      setQuote(res.data.quote);
      setBookingStatus('Quote generated. Review and confirm your booking.');
    } catch (error) {
      console.error('Quote request failed:', error.message);
      setBookingStatus('Unable to generate quote at the moment.');
    } finally {
      setLoading(false);
    }
  };

  const bookSlot = async () => {
    if (!quote) {
      setBookingStatus('Generate a quote before booking a slot.');
      return;
    }

    try {
      setLoading(true);
      const printer = printers.find((item) => item.id === selectedPrinterId);
      await axios.post(
        'http://localhost:5000/api/bookings/create',
        {
          user: user?.name || 'Client',
          printer: printer?.name || 'Unknown Printer',
          printerId: selectedPrinterId,
          material: selectedMaterial,
          slot: selectedSlot,
          date: new Date().toISOString().slice(0, 10),
          fileName: uploadedFile?.originalname || 'unknown.stl',
          quote,
        },
        { headers: authHeaders },
      );

      setBookingStatus('Booking confirmed. You are scheduled for the selected slot.');
    } catch (error) {
      console.error('Booking failed:', error.message);
      setBookingStatus('Unable to confirm booking right now.');
    } finally {
      setLoading(false);
    }
  };

  const controlPrinter = async (action) => {
    if (!selectedPrinterId) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/printers/${selectedPrinterId}/control`,
        { action },
        { headers: authHeaders },
      );
      setLiveFeed(res.data.liveFeed || res.data.printer || liveFeed);
      setPrinterControlStatus(`Printer ${action} request sent.`);
    } catch (error) {
      console.error('Printer control failed:', error.message);
      setPrinterControlStatus('Control request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Client dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Hi, {user?.name || 'Fabrication Client'}</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Your STL upload, quote, booking, and live printer feed workflow is ready.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-3xl bg-slate-800 px-5 py-3 text-slate-200 transition hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-6 xl:grid-cols-4 mb-10">
          {[
            { label: 'Available', value: availableCount, tone: 'text-emerald-300' },
            { label: 'Printing', value: printingCount, tone: 'text-cyan-300' },
            { label: 'Paused', value: pausedCount, tone: 'text-amber-300' },
            { label: 'Selected slot', value: selectedSlot, tone: 'text-slate-200' },
          ].map((metric) => (
            <div key={metric.label} className="rounded-[2rem] bg-slate-900/90 p-8 ring-1 ring-slate-800 shadow-2xl shadow-slate-950/40">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">{metric.label}</p>
              <p className={`mt-5 text-4xl font-semibold ${metric.tone}`}>{metric.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-3 mb-10">
          <div className="rounded-[2rem] bg-slate-900/90 p-8 ring-1 ring-slate-800 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Upload file</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Prepare model slicing</h2>
              </div>
              <span className="rounded-full bg-cyan-500/15 px-4 py-2 text-sm text-cyan-200">{connectionMethod === 'moonraker' ? 'Moonraker API' : 'Local Network'}</span>
            </div>

            <div className="mt-8 space-y-5">
              <input
                type="file"
                accept=".stl,.3mf,.step"
                onChange={uploadFile}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
              />

              {uploadedFile && (
                <div className="rounded-3xl bg-slate-950/95 p-5 ring-1 ring-slate-800">
                  <p className="text-sm text-slate-400">Uploaded file</p>
                  <p className="mt-3 text-lg font-semibold text-white">{uploadedFile.originalname}</p>
                  <p className="mt-2 text-slate-400">Size: {(uploadedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              )}

              {analysis && (
                <div className="rounded-3xl bg-slate-950/95 p-5 ring-1 ring-slate-800">
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Slicing estimate</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-slate-400">
                    <div>
                      <p>Material use</p>
                      <p className="mt-1 text-white">{analysis.materialUsageGrams}g</p>
                    </div>
                    <div>
                      <p>Support</p>
                      <p className="mt-1 text-white">{analysis.supportMaterialGrams}g</p>
                    </div>
                    <div>
                      <p>Print time</p>
                      <p className="mt-1 text-white">{analysis.printTimeLabel}</p>
                    </div>
                    <div>
                      <p>Printer</p>
                      <p className="mt-1 text-white">{analysis.recommendedPrinter}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                disabled={loading}
                onClick={requestQuote}
                className="w-full rounded-3xl bg-emerald-500 px-5 py-4 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
              >
                Request Quote
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-900/90 p-8 ring-1 ring-slate-800 shadow-2xl shadow-slate-950/40">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Printer selection</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Choose your machine</h2>

            <div className="mt-8 space-y-4">
              {printers.map((printer) => (
                <button
                  key={printer.id}
                  onClick={() => setSelectedPrinterId(printer.id)}
                  className={`w-full rounded-3xl border p-5 text-left transition ${printer.id === selectedPrinterId ? 'border-cyan-500 bg-slate-800' : 'border-slate-800 bg-slate-950/90 hover:border-cyan-500'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{printer.name}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{printer.user || 'Idle'}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs uppercase ${printer.status === 'Available' ? 'bg-emerald-500/15 text-emerald-200' : printer.status === 'Printing' ? 'bg-cyan-500/15 text-cyan-200' : 'bg-amber-500/15 text-amber-200'}`}>
                      {printer.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-900/90 p-8 ring-1 ring-slate-800 shadow-2xl shadow-slate-950/40">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Quote summary</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Cost breakdown</h2>

            {quote ? (
              <div className="mt-8 space-y-4">
                <div className="rounded-3xl bg-slate-950/95 p-5 ring-1 ring-slate-800">
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Material cost</span>
                    <span>₹{quote.materialCost}</span>
                  </div>
                  <div className="mt-3 flex justify-between text-slate-400 text-sm">
                    <span>Machine runtime</span>
                    <span>₹{quote.machineCost}</span>
                  </div>
                  <div className="mt-3 flex justify-between text-slate-400 text-sm">
                    <span>Handling fee</span>
                    <span>₹{quote.handlingFee}</span>
                  </div>
                  <div className="mt-4 border-t border-slate-800 pt-4 flex justify-between text-white text-xl font-semibold">
                    <span>Total</span>
                    <span>₹{quote.totalCost}</span>
                  </div>
                </div>

                <button
                  disabled={!quote || loading}
                  onClick={bookSlot}
                  className="w-full rounded-3xl bg-cyan-500 px-5 py-4 text-slate-950 font-semibold transition hover:bg-cyan-400 disabled:opacity-50"
                >
                  Confirm booking
                </button>
              </div>
            ) : (
              <p className="mt-8 text-slate-400">Upload a model and request a quote to proceed with booking.</p>
            )}

            {bookingStatus && <p className="mt-5 text-sm text-emerald-300">{bookingStatus}</p>}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 mb-10">
          <div className="rounded-[2rem] bg-slate-900/90 p-8 ring-1 ring-slate-800 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Live printer feed</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Current status</h2>
              </div>
              <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">{selectedPrinterId}</span>
            </div>

            <div className="mt-8 rounded-3xl bg-slate-950/95 p-5 ring-1 ring-slate-800">
              <div className="grid gap-4 sm:grid-cols-3 text-sm text-slate-400">
                <div>
                  <p>Status</p>
                  <p className="mt-1 text-white">{liveFeed?.status || 'Loading...'}</p>
                </div>
                <div>
                  <p>Progress</p>
                  <p className="mt-1 text-white">{liveFeed?.progress ?? 0}%</p>
                </div>
                <div>
                  <p>ETA</p>
                  <p className="mt-1 text-white">{liveFeed?.timeRemaining || '-'}</p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900">
                <img
                  src={liveFeed?.cameraStream || 'https://via.placeholder.com/720x405?text=Camera+Feed'}
                  alt="Live printer camera"
                  className="h-52 w-full object-cover"
                />
              </div>

              <div className="mt-5 rounded-3xl bg-slate-900/90 p-5 border border-slate-800">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Current file</span>
                  <span>{liveFeed?.currentFile || 'No file'}</span>
                </div>
                <div className="mt-3 flex justify-between text-slate-400 text-sm">
                  <span>File info</span>
                  <span>{liveFeed?.fileInfo || '-'}</span>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <button
                  onClick={() => controlPrinter('start')}
                  className="rounded-3xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950"
                >
                  Start
                </button>
                <button
                  onClick={() => controlPrinter('pause')}
                  className="rounded-3xl bg-amber-500 px-4 py-3 font-semibold text-slate-950"
                >
                  Pause
                </button>
                <button
                  onClick={() => controlPrinter('stop')}
                  className="rounded-3xl bg-red-500 px-4 py-3 font-semibold text-slate-950"
                >
                  Stop
                </button>
              </div>

              {printerControlStatus && <p className="mt-4 text-sm text-cyan-200">{printerControlStatus}</p>}
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-900/90 p-8 ring-1 ring-slate-800 shadow-2xl shadow-slate-950/40">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Printer queue</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Queue snapshot</h2>
            <div className="mt-8 space-y-4">
              {printers.map((printer) => (
                <div key={printer.id} className="rounded-3xl border border-slate-800 p-4 bg-slate-950/95">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{printer.name}</p>
                      <p className="text-slate-400 text-sm mt-1">{printer.status}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs ${printer.status === 'Available' ? 'bg-emerald-500/15 text-emerald-200' : printer.status === 'Printing' ? 'bg-cyan-500/15 text-cyan-200' : 'bg-amber-500/15 text-amber-200'}`}>
                      {printer.status}
                    </span>
                  </div>
                  <div className="mt-4 text-sm text-slate-400">
                    <p>ETA: {printer.eta}</p>
                    <p>Progress: {printer.progress}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
