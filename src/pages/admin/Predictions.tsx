import { useEffect, useState } from 'react';
import { Brain, TrendingUp, Clock, AlertTriangle, Activity, CloudSun, Play, CheckCircle2, BarChart2, Zap, Sliders, Cpu, Gauge } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { apiClient } from '@/services/api-client';
import type { LiveWeatherData } from '@/services/live-weather';
import type { ModelTrainingResult, PredictionTestInput, PredictionTestOutput } from '@/services/xgboost-trainer';
import type { Prediction } from '@/types';

export default function Predictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [trainingResult, setTrainingResult] = useState<ModelTrainingResult | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [sampleCount, setSampleCount] = useState<number>(1500);

  // Live Prediction Tester State
  const [testInputs, setTestInputs] = useState<PredictionTestInput>({
    hour: 14,
    weekday: 2,
    orders15m: 28,
    orders1h: 95,
    rainfall: 0.0,
    temperature: 29.5,
    vehicles: 18,
    distanceKm: 3.8
  });

  const [liveTestOutput, setLiveTestOutput] = useState<PredictionTestOutput | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Calculate live test prediction on input change
    const output = apiClient.predictLiveTestScore(testInputs);
    setLiveTestOutput(output);
  }, [testInputs, trainingResult]);

  const loadData = async () => {
    const preds = await apiClient.getPredictions();
    setPredictions(preds);
    const liveWeather = await apiClient.getLiveWeather();
    setWeather(liveWeather);
    if (liveWeather) {
      setTestInputs(prev => ({
        ...prev,
        rainfall: liveWeather.precipitationMm,
        temperature: liveWeather.temperatureC
      }));
    }
    const meta = await apiClient.getXgbModelMetadata();
    if (meta) setTrainingResult(meta);
  };

  const handleTrainModel = async () => {
    setIsTraining(true);
    try {
      const res = await apiClient.trainXgbModel(sampleCount);
      setTrainingResult(res);
      const updatedPreds = await apiClient.getPredictions();
      setPredictions(updatedPreds);
    } catch (err) {
      console.error('Training model error:', err);
    } finally {
      setIsTraining(false);
    }
  };

  const iconFor = (type: Prediction['type']) => {
    if (type === 'DEMAND') return <TrendingUp className="w-5 h-5" />;
    if (type === 'TRAFFIC_RISK') return <AlertTriangle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const colorFor = (type: Prediction['type']) => {
    if (type === 'DEMAND') return 'text-primary-400 bg-primary-500/15';
    if (type === 'TRAFFIC_RISK') return 'text-warning-400 bg-warning-100';
    return 'text-accent-400 bg-accent-100';
  };

  const isTrained = Boolean(trainingResult);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">AI Predictions & Live XGBoost Engine</h1>
          <p className="text-sm text-ink-400 mt-1">Real-time XGBoost inference, live weather signals & dynamic model scoring</p>
        </div>
        <div className="flex items-center gap-2">
          {isTrained ? (
            <Badge variant="success" className="px-3 py-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> LIVE TRAINED / ONLINE
            </Badge>
          ) : (
            <Badge variant="demo" className="px-3 py-1">CONNECTOR READY</Badge>
          )}
        </div>
      </div>

      {/* Live Weather Feed Banner */}
      <Card className="p-5 border-primary-500/30 bg-surface/80">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center">
              <CloudSun className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">Live Meteorological Signal — Kolkata Pilot Area</h3>
                <Badge variant={weather?.isLive ? "success" : "neutral"}>
                  {weather?.isLive ? "OPEN-METEO LIVE" : "ESTIMATED"}
                </Badge>
              </div>
              <p className="text-xs text-ink-400 mt-1">
                Real-time weather parameters feed XGBoost traffic risk & ETA forecasting features
              </p>
            </div>
          </div>
          {weather && (
            <div className="flex items-center gap-6 bg-surface px-4 py-2.5 rounded-lg border border-surface-border">
              <div>
                <p className="text-xs text-ink-400">Temperature</p>
                <p className="text-lg font-bold text-white">{weather.temperatureC}°C</p>
              </div>
              <div className="h-8 w-px bg-surface-border" />
              <div>
                <p className="text-xs text-ink-400">Precipitation</p>
                <p className="text-lg font-bold text-white">{weather.precipitationMm} mm</p>
              </div>
              <div className="h-8 w-px bg-surface-border" />
              <div>
                <p className="text-xs text-ink-400">Condition</p>
                <p className="text-sm font-semibold text-primary-300">{weather.weatherDescription}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Model Status & Live Training Execution */}
      <Card className={`p-5 border ${isTrained ? 'border-success-500/40 bg-success-500/5' : 'border-primary-500/20 bg-primary-500/10/50'}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Brain className={`w-7 h-7 ${isTrained ? 'text-success-400' : 'text-primary-400'}`} />
            <div>
              <p className="text-base font-semibold text-white">
                MODEL STATUS: {isTrained ? 'LIVE TRAINED & ACTIVE' : 'CONNECTOR READY'}
              </p>
              <p className="text-xs text-ink-300 mt-0.5">
                {isTrained 
                  ? `XGBoost model trained on ${trainingResult?.sampleCount} live district samples in ${trainingResult?.trainingDurationMs}ms at ${new Date(trainingResult?.trainedAt || '').toLocaleTimeString()}`
                  : 'XGBoost regression models ready for training on live operational district features.'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-ink-400">Dataset Size:</label>
              <select 
                value={sampleCount} 
                onChange={(e) => setSampleCount(Number(e.target.value))}
                className="bg-surface border border-surface-border text-xs rounded px-2 py-1.5 text-white"
              >
                <option value={500}>500 samples</option>
                <option value={1500}>1,500 samples</option>
                <option value={3000}>3,000 samples</option>
              </select>
            </div>

            <button 
              onClick={handleTrainModel}
              disabled={isTraining}
              className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isTraining ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-white" />
                  <span>Training XGBoost Models...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Train Model on Live Data</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Card>

      {/* Model Metrics & Feature Importance (If Trained) */}
      {trainingResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Training Performance Metrics */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-5 h-5 text-primary-400" />
              <h2 className="section-title">Model Evaluation Metrics</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-surface border border-surface-border">
                <p className="text-xs text-ink-400">Demand Model R² Score</p>
                <p className="text-2xl font-bold text-success-400 mt-1">{trainingResult.demandMetrics.r2.toFixed(3)}</p>
                <p className="text-xs text-ink-400 mt-1">RMSE: {trainingResult.demandMetrics.rmse} orders</p>
              </div>
              <div className="p-3 rounded-lg bg-surface border border-surface-border">
                <p className="text-xs text-ink-400">Traffic Risk R² Score</p>
                <p className="text-2xl font-bold text-success-400 mt-1">{trainingResult.trafficMetrics.r2.toFixed(3)}</p>
                <p className="text-xs text-ink-400 mt-1">RMSE: {trainingResult.trafficMetrics.rmse} score pts</p>
              </div>
            </div>
          </Card>

          {/* Feature Importance Breakdown */}
          <Card className="p-5">
            <h2 className="section-title mb-4">XGBoost Feature Importance</h2>
            <div className="space-y-2">
              {Object.entries(trainingResult.featureImportance).map(([feat, imp]) => (
                <div key={feat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-300 font-medium">{feat.replace(/_/g, ' ')}</span>
                    <span className="text-primary-300">{(imp * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-primary-400 rounded-full" style={{ width: `${imp * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Live Interactive AI Prediction Score Tester */}
      <Card className="p-5 border-primary-500/30 bg-surface/90">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-5 pb-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="section-title">Live AI Model Interactive Scoring Simulator</h2>
              <p className="text-xs text-ink-400">Adjust live operational parameters to test real-time XGBoost inference output</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info" className="px-2.5 py-1 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> INFERENCE SPEED: {liveTestOutput?.executionMs ?? 1} ms
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Sliders */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Input Operational Vector</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-300">Hour of Day (0-23h)</span>
                  <span className="text-primary-300 font-bold">{testInputs.hour}:00</span>
                </div>
                <input 
                  type="range" min="0" max="23" step="1" 
                  value={testInputs.hour} 
                  onChange={e => setTestInputs({...testInputs, hour: Number(e.target.value)})}
                  className="w-full accent-primary-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-300">Orders (Last 15m)</span>
                  <span className="text-primary-300 font-bold">{testInputs.orders15m} orders</span>
                </div>
                <input 
                  type="range" min="5" max="60" step="1" 
                  value={testInputs.orders15m} 
                  onChange={e => setTestInputs({...testInputs, orders15m: Number(e.target.value)})}
                  className="w-full accent-primary-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-300">Orders (Last 1h)</span>
                  <span className="text-primary-300 font-bold">{testInputs.orders1h} orders</span>
                </div>
                <input 
                  type="range" min="15" max="200" step="5" 
                  value={testInputs.orders1h} 
                  onChange={e => setTestInputs({...testInputs, orders1h: Number(e.target.value)})}
                  className="w-full accent-primary-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-300">Rainfall (Precipitation)</span>
                  <span className="text-primary-300 font-bold">{testInputs.rainfall} mm</span>
                </div>
                <input 
                  type="range" min="0" max="45" step="0.5" 
                  value={testInputs.rainfall} 
                  onChange={e => setTestInputs({...testInputs, rainfall: Number(e.target.value)})}
                  className="w-full accent-primary-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-300">Active Fleet Vehicles</span>
                  <span className="text-primary-300 font-bold">{testInputs.vehicles} vehicles</span>
                </div>
                <input 
                  type="range" min="5" max="50" step="1" 
                  value={testInputs.vehicles} 
                  onChange={e => setTestInputs({...testInputs, vehicles: Number(e.target.value)})}
                  className="w-full accent-primary-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-300">Trip Distance</span>
                  <span className="text-primary-300 font-bold">{testInputs.distanceKm} km</span>
                </div>
                <input 
                  type="range" min="0.5" max="15" step="0.5" 
                  value={testInputs.distanceKm} 
                  onChange={e => setTestInputs({...testInputs, distanceKm: Number(e.target.value)})}
                  className="w-full accent-primary-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Real-Time Live Inference Results Display */}
          <div className="lg:col-span-5 bg-surface-dark border border-surface-border rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-border">
                <span className="text-xs font-semibold text-ink-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-primary-400" /> Live Model Inference Scores
                </span>
                <Badge variant={liveTestOutput?.isLiveTrained ? "success" : "demo"}>
                  {liveTestOutput?.isLiveTrained ? "XGBoost Trained Model" : "Default Model"}
                </Badge>
              </div>

              <div className="space-y-4">
                {/* 1. Demand Score */}
                <div className="bg-surface/70 p-3 rounded-lg border border-surface-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-ink-400">Predicted Demand Index</span>
                    <span className="text-xs font-semibold text-primary-400">{liveTestOutput?.demandIndex} / 100</span>
                  </div>
                  <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-primary-400 rounded-full transition-all duration-300" style={{ width: `${liveTestOutput?.demandIndex}%` }} />
                  </div>
                </div>

                {/* 2. Traffic Risk Score */}
                <div className="bg-surface/70 p-3 rounded-lg border border-surface-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-ink-400">Traffic Congestion Risk</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{liveTestOutput?.trafficRiskScore} pts</span>
                      <Badge variant={liveTestOutput?.trafficRiskLevel === 'HIGH' ? 'error' : liveTestOutput?.trafficRiskLevel === 'MEDIUM' ? 'warning' : 'success'}>
                        {liveTestOutput?.trafficRiskLevel} RISK
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        liveTestOutput?.trafficRiskLevel === 'HIGH' ? 'bg-error-500' : liveTestOutput?.trafficRiskLevel === 'MEDIUM' ? 'bg-warning-500' : 'bg-success-500'
                      }`} 
                      style={{ width: `${liveTestOutput?.trafficRiskScore}%` }} 
                    />
                  </div>
                </div>

                {/* 3. Estimated ETA */}
                <div className="bg-surface/70 p-3 rounded-lg border border-surface-border flex items-center justify-between">
                  <div>
                    <span className="text-xs text-ink-400">Predicted Trip Duration (ETA)</span>
                    <p className="text-xl font-bold text-white mt-0.5">{liveTestOutput?.etaMinutes} minutes</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-ink-400">Confidence</span>
                    <p className="text-sm font-semibold text-primary-300">{liveTestOutput?.confidencePct}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-surface-border text-center text-xs text-ink-400 flex items-center justify-between">
              <span>Model Execution: <strong>{liveTestOutput?.executionMs} ms</strong></span>
              <span>Feature Vector: <strong>7 inputs</strong></span>
            </div>
          </div>
        </div>
      </Card>

      {/* Live Prediction Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Active District Forecasts</h2>
          <span className="text-xs text-ink-400">Zone: Kolkata Burrabazar / Posta</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictions.map(p => (
            <Card key={p.id} hover className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorFor(p.type)}`}>
                  {iconFor(p.type)}
                </div>
                <Badge variant={isTrained ? "success" : "demo"}>
                  {isTrained ? "LIVE TRAINED" : "CONNECTOR READY"}
                </Badge>
              </div>
              <h3 className="font-semibold text-white">{p.type.replace(/_/g, ' ')}</h3>
              <p className="text-3xl font-bold text-white mt-2">
                {p.value} <span className="text-base font-normal text-ink-400">{p.unit}</span>
              </p>

              <div className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-ink-400">Zone</span><span className="text-ink-100">{p.zone}</span></div>
                <div className="flex justify-between"><span className="text-ink-400">Horizon</span><span className="text-ink-100">{p.horizonMin} min</span></div>
                <div className="flex justify-between"><span className="text-ink-400">Confidence</span><span className="text-ink-100">{(p.confidence * 100).toFixed(0)}%</span></div>
                <div className="flex justify-between"><span className="text-ink-400">Model</span><span className="text-ink-100">{p.model} v{p.version}</span></div>
                <div className="flex justify-between"><span className="text-ink-400">Timestamp</span><span className="text-ink-100 text-xs">{new Date(p.timestamp).toLocaleTimeString('en-IN')}</span></div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-ink-400">Confidence Score</span>
                  <span className="text-ink-200">{(p.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${p.confidence * 100}%` }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Notice */}
      <Card className="p-4 bg-surface border-surface-border">
        <div className="flex items-start gap-2">
          <Activity className="w-4 h-4 text-ink-400 mt-0.5 shrink-0" />
          <p className="text-xs text-ink-400">
            Predictions above combine live meteorological signals (Open-Meteo API) with active district vehicle counts and delivery queue states. Use the interactive <strong>Live Model Scoring Simulator</strong> above to test live XGBoost prediction outputs under different road & weather conditions.
          </p>
        </div>
      </Card>
    </div>
  );
}
