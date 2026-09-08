import { useState } from 'react';
import { Radio, CheckCircle, XCircle, FileJson } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { validateAdapterEvent, sampleAdapterEvent } from '@/services/adapter';

export default function UilipAdapter() {
  const [eventText, setEventText] = useState(JSON.stringify(sampleAdapterEvent, null, 2));
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] } | null>(null);

  const handleValidate = () => {
    try {
      const event = JSON.parse(eventText);
      const result = validateAdapterEvent(event);
      setValidation(result);
    } catch {
      setValidation({ valid: false, errors: ['Invalid JSON'] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">ULIP-Aligned Adapter</h1>
        <p className="text-sm text-ink-500 mt-1">Adapter contract for ULIP-aligned event exchange</p>
      </div>

      <Card className="p-5 border-warning-300 bg-warning-50/50">
        <div className="flex items-start gap-3">
          <Radio className="w-5 h-5 text-warning-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-ink-900">ULIP-aligned adapter contract.</p>
            <p className="text-xs text-warning-700 mt-1">Production government API integration is authorization-gated. This is NOT the official ULIP schema.</p>
          </div>
        </div>
      </Card>

      {/* Adapter Schema */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileJson className="w-5 h-5 text-primary-600" />
          <h2 className="section-title">Adapter Event Schema</h2>
        </div>
        <div className="p-4 rounded-lg bg-ink-900 text-ink-300 font-mono text-xs overflow-x-auto">
          <pre>{`{
  "sourceSystem": "NEXFLOW",
  "eventType": "VEHICLE_UPDATE",
  "eventTime": "ISO-8601",
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
          <button onClick={handleValidate} className="btn-primary">Validate</button>
        </div>
        <textarea
          value={eventText}
          onChange={e => setEventText(e.target.value)}
          className="input font-mono text-xs h-64 resize-none"
          spellCheck={false}
        />
        {validation && (
          <div className={`mt-4 p-4 rounded-lg border ${validation.valid ? 'bg-success-50 border-success-200' : 'bg-error-50 border-error-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              {validation.valid ? (
                <><CheckCircle className="w-5 h-5 text-success-600" /><span className="text-sm font-semibold text-success-700">Valid Event</span></>
              ) : (
                <><XCircle className="w-5 h-5 text-error-600" /><span className="text-sm font-semibold text-error-700">Validation Failed</span></>
              )}
            </div>
            {validation.errors.length > 0 && (
              <ul className="text-xs text-error-600 space-y-1">
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
            <div key={type} className="p-3 rounded-lg border border-ink-200 bg-white">
              <p className="text-sm font-medium text-ink-800">{type}</p>
              <Badge variant="neutral">ULIP-aligned</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
