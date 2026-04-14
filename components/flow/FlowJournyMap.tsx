'use client';

import { useEffect, useRef, useState } from 'react';
import { FlowNodeResult, FlowEdge, FlowNode } from './Flow';

interface FlowJourneyMapProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  results: Record<string, FlowNodeResult>;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes}b`;
  return `${(bytes / 1024).toFixed(1)}kb`;
}

function getItemCount(data: unknown): string {
  if (Array.isArray(data)) return `${data.length} items`;
  if (data && typeof data === 'object') return `${Object.keys(data).length} fields`;
  return '1 value';
}

function resolvePathValue(data: any, path: string): string {
  try {
    const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
    let val: any = data;
    for (const p of parts) val = val?.[p];
    return val !== undefined ? String(val).slice(0, 12) : '?';
  } catch { return '?'; }
}

export default function FlowJourneyMap({ nodes, edges, results }: FlowJourneyMapProps) {
  const [tick, setTick] = useState(0);
  const [hoveredEdgeIdx, setHoveredEdgeIdx] = useState<number | null>(null);
  const [enteredAt, setEnteredAt] = useState<Record<string, number>>({});
  const startRef = useRef<number>(performance.now());
  const rafRef = useRef<number>();

  const successNodes = nodes.filter(n => results[n.id]?.status === 'success');
  const totalTime = successNodes.reduce((s, n) => s + (results[n.id]?.response?.time ?? 0), 0);
  const totalSize = successNodes.reduce((s, n) => s + (results[n.id]?.response?.size ?? 0), 0);
  const hasResults = successNodes.length > 0;

  useEffect(() => {
    startRef.current = performance.now();
    function frame() {
      setTick(t => t + 1);
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [edges, results]);

  if (nodes.length === 0) return null;

  const CYCLE = 4400; // ms per packet loop
  const now = performance.now() - startRef.current;

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: '16px',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)',
    }}>

      {/* ── Stats header ── */}
      {hasResults && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderBottom: '0.5px solid var(--color-border-tertiary)',
        }}>
          {[
            { label: 'Total time', value: `${totalTime}ms` },
            { label: 'Total size', value: formatBytes(totalSize) },
            { label: 'API calls', value: `${successNodes.length}` },
            { label: 'Mappings', value: `${edges.reduce((s, e) => s + e.mappings.length, 0)}` },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              padding: '20px 24px',
              borderRight: i < 3 ? '0.5px solid var(--color-border-tertiary)' : 'none',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '6px', letterSpacing: '0.04em' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '26px', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Journey track ── */}
      <div style={{ padding: '40px 32px 32px', overflowX: 'auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          minWidth: `${nodes.length * 120 + Math.max(nodes.length - 1, 0) * 140}px`,
          position: 'relative',
        }}>
          {nodes.map((node, i) => {
            const result = results[node.id];
            const isSuccess = result?.status === 'success';
            const isRunning = result?.status === 'running';
            const isError = result?.status === 'error';
            const edgeAfter = edges[i]; // edge from node i to node i+1
            const hasMapping = edgeAfter && edgeAfter.mappings.length > 0;

            // packet animation progress 0..1
            const packetProgress = hasMapping && isSuccess
              ? (now % CYCLE) / CYCLE
              : null;

            const mappingLabel = hasMapping
              ? edgeAfter.mappings.map(m => {
                  const val = result?.response?.data
                    ? resolvePathValue(result.response.data, m.fromPath)
                    : '?';
                  return `${m.toParam}=${val}`;
                }).join(' · ')
              : null;

            return (
              <div key={node.id} style={{ display: 'flex', alignItems: 'center', flex: i < nodes.length - 1 ? 1 : 0 }}>

                {/* ── Node circle ── */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '120px' }}>

                  {/* Outer ring pulse when running */}
                  <div style={{ position: 'relative', width: '72px', height: '72px' }}>
                    {isRunning && (
                      <div style={{
                        position: 'absolute', inset: '-6px',
                        borderRadius: '50%',
                        border: '1.5px solid var(--color-border-info)',
                        opacity: 0.5,
                        animation: 'jm-ring 1.4s ease-out infinite',
                      }} />
                    )}
                    {isSuccess && (
                      <div style={{
                        position: 'absolute', inset: '-4px',
                        borderRadius: '50%',
                        border: '1px solid var(--color-border-success)',
                        opacity: 0.3,
                      }} />
                    )}

                    <div style={{
                      width: '72px', height: '72px', borderRadius: '50%',
                      background: isSuccess
                        ? 'var(--color-background-success)'
                        : isError
                        ? 'var(--color-background-danger)'
                        : 'var(--color-background-secondary)',
                      border: `1.5px solid ${
                        isSuccess ? 'var(--color-border-success)'
                        : isError ? 'var(--color-border-danger)'
                        : 'var(--color-border-secondary)'
                      }`,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      position: 'relative', zIndex: 1,
                      transition: 'transform 0.2s',
                    }}>
                      {/* Method badge */}
                      <div style={{
                        fontSize: '9px', fontWeight: 600,
                        letterSpacing: '0.08em',
                        color: isSuccess ? 'var(--color-text-success)'
                          : isError ? 'var(--color-text-danger)'
                          : 'var(--color-text-secondary)',
                        marginBottom: '3px',
                      }}>
                        {node.method}
                      </div>

                      {/* Status icon */}
                      {isSuccess && (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5 10.5l3.5 3.5 6.5-7.5" stroke="var(--color-text-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {isError && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 4.5v5M8 11.5v1" stroke="var(--color-text-danger)" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      )}
                      {isRunning && (
                        <div style={{
                          width: '10px', height: '10px', borderRadius: '50%',
                          background: 'var(--color-text-info)',
                          animation: 'jm-pulse 0.9s ease-in-out infinite',
                        }} />
                      )}
                      {!result && (
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-border-tertiary)' }} />
                      )}

                      {/* Time */}
                      {isSuccess && result.response && (
                        <div style={{ fontSize: '9px', color: 'var(--color-text-success)', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>
                          {result.response.time}ms
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Label block below circle */}
                  <div style={{ marginTop: '12px', textAlign: 'center', width: '100%', padding: '0 6px' }}>
                    <div style={{
                      fontSize: '12px', fontWeight: 500,
                      color: 'var(--color-text-primary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {node.label}
                    </div>
                    <div style={{
                      fontSize: '10px', color: 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      marginTop: '2px',
                    }}>
                      {node.url.replace(/https?:\/\/[^/]+/, '') || node.url}
                    </div>
                    {isSuccess && result.response && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        marginTop: '6px',
                        padding: '2px 8px', borderRadius: '20px',
                        background: 'var(--color-background-success)',
                        fontSize: '10px', color: 'var(--color-text-success)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {getItemCount(result.response.data)}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Connector ── */}
                {i < nodes.length - 1 && (
                  <div
                    style={{ flex: 1, position: 'relative', height: '72px', minWidth: '100px', cursor: 'default' }}
                    onMouseEnter={() => { setHoveredEdgeIdx(i); setEnteredAt(p => ({ ...p, [i]: performance.now() })); }}
                    onMouseLeave={() => setHoveredEdgeIdx(null)}
                  >
                    {/* Track */}
                    <div style={{
                      position: 'absolute', top: '50%', left: '2px', right: '2px',
                      height: '2px',
                      background: hasMapping
                        ? 'var(--color-border-info)'
                        : 'var(--color-border-tertiary)',
                      transform: 'translateY(-50%)',
                      borderRadius: '2px',
                    }} />

                    {/* Arrowhead at right end */}
                    <div style={{
                      position: 'absolute', top: '50%', right: '0',
                      transform: 'translateY(-50%)',
                      width: 0, height: 0,
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent',
                      borderLeft: `7px solid ${hasMapping ? 'var(--color-border-info)' : 'var(--color-border-tertiary)'}`,
                    }} />

                    {/* Animated packet */}
                    {packetProgress !== null && mappingLabel && (() => {
                      const p = packetProgress;
                      const visible = p > 0.04 && p < 0.92;
                      return (
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: `calc(${p * 88}% + 4px)`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 4,
                          pointerEvents: 'none',
                          opacity: visible ? 1 : 0,
                          transition: 'opacity 0.15s',
                        }}>
                          {/* Glow behind pill */}
                          <div style={{
                            position: 'absolute', inset: '-4px',
                            borderRadius: '20px',
                            background: 'var(--color-background-info)',
                            opacity: 0.35,
                            filter: 'blur(4px)',
                          }} />
                          <div style={{
                            position: 'relative',
                            background: 'var(--color-text-info)',
                            color: 'var(--color-background-primary)',
                            fontSize: '10px', fontWeight: 600,
                            padding: '3px 10px', borderRadius: '20px',
                            whiteSpace: 'nowrap',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.02em',
                          }}>
                            {mappingLabel}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Hover tooltip */}
                    {hoveredEdgeIdx === i && edgeAfter && edgeAfter.mappings.length > 0 && (
                      <div style={{
                        position: 'absolute', top: 'calc(50% + 24px)', left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--color-background-primary)',
                        border: '0.5px solid var(--color-border-info)',
                        borderRadius: '10px', padding: '10px 14px',
                        zIndex: 10, whiteSpace: 'nowrap',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      }}>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          Mapping
                        </div>
                        {edgeAfter.mappings.map(m => (
                          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', marginBottom: '4px' }}>
                            <code style={{ color: 'var(--color-text-secondary)', background: 'var(--color-background-secondary)', padding: '1px 6px', borderRadius: '4px', fontSize: '10px' }}>{m.fromPath}</code>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M7 2l4 4-4 4" stroke="var(--color-text-info)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <code style={{ color: 'var(--color-text-info)', background: 'var(--color-background-info)', padding: '1px 6px', borderRadius: '4px', fontSize: '10px' }}>{`{${m.toParam}}`}</code>
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: '10px' }}>→ {m.toTarget}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Timeline bar ── */}
      {hasResults && totalTime > 0 && (
        <div style={{ padding: '0 32px 24px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Execution timeline
          </div>
          <div style={{ position: 'relative', height: '36px', background: 'var(--color-background-secondary)', borderRadius: '8px', overflow: 'hidden', display: 'flex', gap: '2px', padding: '2px' }}>
            {nodes.map((node, i) => {
              const result = results[node.id];
              if (!result?.response) return null;
              const pct = (result.response.time / totalTime) * 100;
              const bgColors = [
                'var(--color-background-info)',
                'var(--color-background-success)',
                'var(--color-background-warning)',
              ];
              const textColors = [
                'var(--color-text-info)',
                'var(--color-text-success)',
                'var(--color-text-warning)',
              ];
              return (
                <div key={node.id} title={`${node.label}: ${result.response.time}ms`} style={{
                  width: `${pct}%`, minWidth: '60px',
                  background: bgColors[i % bgColors.length],
                  borderRadius: '6px',
                  display: 'flex', alignItems: 'center',
                  padding: '0 10px',
                  overflow: 'hidden',
                  transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <span style={{ fontSize: '10px', fontWeight: 500, color: textColors[i % textColors.length], whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                    {node.label} · {result.response.time}ms
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
            <span>0ms</span><span>{totalTime}ms</span>
          </div>
        </div>
      )}

      {/* ── Resolved calls ── */}
      {hasResults && (
        <div style={{ borderTop: '0.5px solid var(--color-border-tertiary)', padding: '20px 32px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Resolved calls
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {nodes.map((node, i) => {
              const result = results[node.id];
              if (!result?.response) return null;
              const url = result.resolvedUrl ?? node.url;
              // highlight the injected part
              const templateUrl = node.url;
              return (
                <div key={node.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px',
                  background: 'var(--color-background-secondary)',
                  borderRadius: '8px',
                  border: '0.5px solid var(--color-border-tertiary)',
                }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 8px',
                    background: 'var(--color-background-success)',
                    color: 'var(--color-text-success)',
                    borderRadius: '4px', flexShrink: 0,
                    letterSpacing: '0.04em',
                  }}>
                    {node.method}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '12px',
                    color: 'var(--color-text-primary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                  }}>
                    {url}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                    {result.response.status}
                  </span>
                  <span style={{
                    fontSize: '10px', padding: '2px 8px',
                    background: 'var(--color-background-success)',
                    color: 'var(--color-text-success)',
                    borderRadius: '4px', flexShrink: 0,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {result.response.time}ms
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes jm-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.3; transform:scale(0.7); }
        }
        @keyframes jm-ring {
          0% { transform:scale(1); opacity:0.6; }
          100% { transform:scale(1.5); opacity:0; }
        }
      `}</style>
    </div>
  );
}