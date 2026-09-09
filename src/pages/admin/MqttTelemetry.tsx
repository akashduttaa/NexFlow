import { useEffect, useState } from 'react';
import { Radio, Wifi, Send, CheckCircle2, Cpu, Activity, Database, ShieldCheck, RefreshCw, Terminal, Layers } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { mqttService, type MqttMessage, type MqttStatus } from '@/services/mqtt';

export default function MqttTelemetry() {
  const [status, setStatus] = useState<MqttStatus | null>(null);
  const [messages, setMessages] = useState<MqttMessage[]>([]);
  const [publishing, setPublishing] = useState(false);

  // Sandbox inputs
  const [topic, setTopic] = useState('nexflow/telemetry/vehicles/WB-04-E-8821');
  const [qos, setQos] = useState<number>(1);
  const [retained, setRetained] = useState(true);
  const [jsonBody, setJsonBody] = useState(
    JSON.stringify({ speedKmh: 32.4, lat: 22.5958, lon: 88.3716, batteryPct: 92, engineState: 'RUNNING' }, null, 2)
  );

  useEffect(() => {
    loadMqttData();
    const interval = setInterval(loadMqttData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadMqttData = async () => {
    const s = await mqttService.getStatus();
    setStatus(s);
    const msgs = await mqttService.getRecentTelemetry();
    setMessages(msgs);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    try {
      const parsed = JSON.parse(jsonBody);
      const msg = await mqttService.publish(topic, parsed, qos, retained);
      setMessages(prev => [msg, ...prev]);
    } catch (err) {
      alert('Invalid JSON Payload');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">MQTT Protocol & Telemetry Engine</h1>
          <p className="text-sm text-ink-400 mt-1">
            Real-time IoT Telemetry Stream — Vehicles, Smart Loading Bays & Dispatch (MQTT v5.0 / v3.1.1 - QoS 1)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="px-3 py-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> MQTT BROKER ONLINE (QoS 1)
          </Badge>
        </div>
      </div>

      {/* Protocol Banner */}
      <Card className="p-5 border-primary-500/30 bg-primary-500/5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-ink-400 font-semibold uppercase">Broker Protocol</p>
              <p className="text-sm font-bold text-white mt-0.5">{status?.protocol ?? 'MQTT v5.0 / v3.1.1'}</p>
            </div>
          </div>
          <div className="border-l border-surface-border pl-4">
            <p className="text-xs text-ink-400 font-semibold uppercase">Broker Endpoints</p>
            <p className="text-sm font-bold text-primary-300 mt-0.5">TCP: 1883 | WS: 9001</p>
          </div>
          <div className="border-l border-surface-border pl-4">
            <p className="text-xs text-ink-400 font-semibold uppercase">Delivery Guarantee</p>
            <p className="text-sm font-bold text-accent-400 mt-0.5">QoS 1 (At Least Once)</p>
          </div>
          <div className="border-l border-surface-border pl-4">
            <p className="text-xs text-ink-400 font-semibold uppercase">Throughput Rate</p>
            <p className="text-sm font-bold text-success-400 mt-0.5">{status?.throughputMsgsPerSec ?? 14.2} msgs/sec</p>
          </div>
        </div>
      </Card>

      {/* Topic Subscriptions */}
      <Card className="p-5">
        <h2 className="section-title mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary-400" />
          Active MQTT Topic Subscriptions ({status?.activeTopics.length ?? 4})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-surface-border bg-surface/50">
            <p className="text-xs font-mono text-primary-400 font-semibold">nexflow/telemetry/vehicles/+</p>
            <p className="text-xs text-ink-400 mt-1">Vehicle GPS, Speed, Battery & Engine Status</p>
          </div>
          <div className="p-3 rounded-lg border border-surface-border bg-surface/50">
            <p className="text-xs font-mono text-accent-400 font-semibold">nexflow/telemetry/bays/+</p>
            <p className="text-xs text-ink-400 mt-1">Ultrasonic Bay Occupancy & Slot State</p>
          </div>
          <div className="p-3 rounded-lg border border-surface-border bg-surface/50">
            <p className="text-xs font-mono text-warning-400 font-semibold">nexflow/events/incidents</p>
            <p className="text-xs text-ink-400 mt-1">Road Closure & Congestion Incident Alerts</p>
          </div>
          <div className="p-3 rounded-lg border border-surface-border bg-surface/50">
            <p className="text-xs font-mono text-success-400 font-semibold">nexflow/commands/dispatch</p>
            <p className="text-xs text-ink-400 mt-1">Real-time Driver Route Dispatch Signals</p>
          </div>
        </div>
      </Card>

      {/* Live MQTT Stream & Sandbox Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title flex items-center gap-2">
                <Terminal className="w-5 h-5 text-accent-400" />
                Live MQTT Event Stream ({messages.length})
              </h2>
              <span className="text-xs text-ink-400">Auto-refreshing live broker feed</span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {messages.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-surface-border bg-surface/60 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-mono font-bold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded border border-primary-500/20">
                      {m.topic}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-ink-400 font-mono">
                      <span>QoS {m.qos}</span>
                      <span>•</span>
                      <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <pre className="text-xs font-mono text-ink-200 bg-ink-950 p-2.5 rounded border border-surface-border overflow-x-auto">
                    {JSON.stringify(m.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sandbox Publisher */}
        <div>
          <Card className="p-5 border-accent-500/30">
            <h2 className="section-title mb-2 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary-400" />
              MQTT Publish Sandbox
            </h2>
            <p className="text-xs text-ink-400 mb-4">
              Publish custom IoT telemetry payloads directly to MQTT topics
            </p>

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="label text-xs">Target Topic</label>
                <input
                  type="text"
                  className="input font-mono text-xs"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="nexflow/telemetry/vehicles/WB-04-E-8821"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs">QoS Level</label>
                  <select
                    className="input text-xs"
                    value={qos}
                    onChange={e => setQos(Number(e.target.value))}
                  >
                    <option value={0}>QoS 0 (At Most Once)</option>
                    <option value={1}>QoS 1 (At Least Once)</option>
                    <option value={2}>QoS 2 (Exactly Once)</option>
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Retained Flag</label>
                  <select
                    className="input text-xs"
                    value={retained ? 'true' : 'false'}
                    onChange={e => setRetained(e.target.value === 'true')}
                  >
                    <option value="true">True (Retain)</option>
                    <option value="false">False (Volatile)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label text-xs">JSON Telemetry Payload</label>
                <textarea
                  className="input font-mono text-xs h-36"
                  value={jsonBody}
                  onChange={e => setJsonBody(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={publishing}
                className="btn-primary w-full text-xs font-semibold py-2.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{publishing ? 'Publishing over MQTT...' : 'Publish Telemetry Message'}</span>
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
