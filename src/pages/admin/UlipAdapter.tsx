import { useState } from 'react';
import { Radio, CheckCircle, XCircle, FileJson, Send, CheckCircle2 } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { validateAdapterEvent, sampleAdapterEvent } from '@/services/adapter';
import { apiClient } from '@/services/api-client';

export default function UlipAdapter() {
  const [eventText, setEventText] = useState(JSON.stringify(sampleAdapterEvent, null, 2));
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] } | null>(null);
  const [transmitting, setTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);

  const handleValidate = () => {
    try {
      const event = JSON.parse(eventText);
      const result = validateAdapterEvent(event);
      setValidation(result);
    } catch {
      setValidation({ valid: false, errors: ['Invalid JSON'] });
    }
  };

  const handleTransmit = async () => {
    setTransmitting(true);
    let evtPayload = {};
    try { evtPayload = JSON.parse(eventText); } catch (e) {}
    await apiClient.createAuditEvent({
      eventType: 'ULIP_ADAPTER_EVENT_TRANSMITTED',
      actor: 'ULIP_ADAPTER',
      entityType: 'consignment',
      entityId: 'C-1042',
      metadata: evtPayload
    });
    setTimeout(() => {
      setTransmitting(false);
      setTransmitted(true);
      setTimeout(() => setTransmitted(false), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">ULIP-Aligned Adapter</h1>
          <p className="text-sm text-ink-400 mt-1">Adapter contract for ULIP-aligned event exchange</p>
        </div>
        <button 
          onClick={handleTransmit}
          disabled={transmitting}
          className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-primary-500/20 cursor-pointer disabled:opacity-50"
        >
          {transmitting ? (
            <span>Transmitting ULIP Payload...</span>
          ) : transmitted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-success-400" />
              <span>Payload Transmitted & Logged</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Transmit ULIP Event to Audit Trail</span>
            </>
          )}
        </button>
      </div>

      <Card className="p-5 border-warning-500/30 bg-warning-500/5">
        <div className="flex items-start gap-3">
          <Radio className="w-5 h-5 text-warning-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">ULIP-aligned adapter contract.</p>
            <p className="text-xs text-warning-700 mt-1">Production government API integration is authorization-gated. This is an internal ULIP-aligned JSON payload contract.</p>
          </div>
        </div>
      </Card>

      {/* Adapter Schema */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileJson className="w-5 h-5 text-primary-400" />
          <h2 className="section-title">Adapter Event Schema</h2>
        </div>
        <div className="p-4 rounded-lg bg-ink-900 text-ink-300 font-mono text-xs overflow-x-auto">
          <pre>{`{
  "sourceSystem": "NEXFLOW",
  "eventType": "VEHICLE_UPDATE",
  "eventTime": "${new Date().toISOString()}",
  "vehicleNo": "WB01XX0001",
  "location": {
    "lat": 22.5726,
    "lon": 88.3639
  },
  "consignmentId": "C-1042",
  "cargoStatus": "OUT_FOR_DELIVERY",
  "load": {
    "units": 12,
    "weightKg": 84
  },
  "sourceVersion": "1.0"
}`}</pre>
        </div>
      </Card>

      {/* Validator */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Event Validator — validateAdapterEvent()</h2>
          <button onClick={handleValidate} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-lg cursor-pointer">Validate</button>
        </div>
        <textarea
          value={eventText}
          onChange={e => setEventText(e.target.value)}
          className="input font-mono text-xs h-64 resize-none"
          spellCheck={false}
        />
        {validation && (
          <div className={`mt-4 p-4 rounded-lg border ${validation.valid ? 'bg-success-500/10 border-success-500/20' : 'bg-error-500/10 border-error-500/20'}`}>
            <div className="flex items-center gap-2 mb-2">
              {validation.valid ? (
                <><CheckCircle className="w-5 h-5 text-success-400" /><span className="text-sm font-semibold text-success-700">Valid Event</span></>
              ) : (
                <><XCircle className="w-5 h-5 text-error-400" /><span className="text-sm font-semibold text-error-300">Validation Failed</span></>
              )}
            </div>
            {validation.errors.length > 0 && (
              <ul className="text-xs text-error-400 space-y-1">
                {validation.errors.map((err, i) => <li key={i}>• {err}</li>)}
              </ul>
            )}
          </div>
        )}
      </Card>

      {/* Event Types */}
      <Card className="p-5">
        <h2 className="section-title mb-3">Supported Event Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['VEHICLE_UPDATE', 'DELIVERY_STATUS', 'BAY_RESERVATION', 'ROUTE_UPDATE', 'INCIDENT_ALERT', 'FREIGHT_PRESSURE'].map(type => (
            <div key={type} className="p-3 rounded-lg border border-surface-border bg-surface">
              <p className="text-sm font-medium text-ink-100">{type}</p>
              <Badge variant="info">ULIP-aligned</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
