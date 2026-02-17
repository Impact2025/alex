import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Star, Trophy, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import * as dailyEntryService from '../dailyEntryService';

const C = {
  bg: '#f8f9fb', white: '#ffffff', red: '#DC2626',
  border: '#f0f0f0', borderMd: '#e5e7eb',
  text: '#111111', textSub: '#6b7280', textMuted: '#9ca3af',
};

const Journal = ({ onBack, user }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEntry, setExpandedEntry] = useState(null);

  useEffect(() => { loadEntries(); }, [user]);

  const loadEntries = async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const data = await dailyEntryService.getAllEntries(user.id, 30);
    setEntries(data);
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const Header = () => (
    <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={20} color={C.textSub} />
        </button>
        <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Logboek</span>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      <Header />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
        <p style={{ color: C.textMuted }}>Laden...</p>
      </div>
    </div>
  );

  if (entries.length === 0) return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      <Header />
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📔</div>
        <p style={{ fontWeight: 600, color: C.text, marginBottom: 8 }}>Nog geen dagboek entries</p>
        <p style={{ color: C.textMuted, fontSize: 14 }}>Start met dagelijkse activiteiten om je logboek te vullen!</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      <Header />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.map((entry) => {
            const isExpanded = expandedEntry === entry.id;
            const hasContent = entry.morning_goal || entry.thoughts || entry.dribbel_dare || entry.gratitude_1;

            return (
              <div key={entry.id} style={{ background: C.white, borderRadius: 16, border: `1.5px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                {/* Header row */}
                <button
                  onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                  style={{ width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Calendar size={18} color={C.red} />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 14, color: C.text }}>{formatDate(entry.entry_date)}</p>
                      <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>
                        {entry.completed_missions?.length || 0} missies · {entry.points_earned || 0} punten
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {hasContent && <Star size={14} color="#f59e0b" fill="#f59e0b" />}
                    {isExpanded ? <ChevronUp size={18} color={C.textSub} /> : <ChevronDown size={18} color={C.textSub} />}
                  </div>
                </button>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${C.border}', paddingTop: 16` }}>
                    <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {entry.morning_goal && (
                        <div style={{ background: '#eff6ff', borderRadius: 12, padding: '10px 14px' }}>
                          <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: '#1d4ed8' }}>🌅 Ochtend Doel</p>
                          <p style={{ margin: 0, fontSize: 13, color: C.text }}>{entry.morning_goal}</p>
                          {entry.morning_sleep && <p style={{ margin: '4px 0 0', fontSize: 11, color: C.textMuted }}>Slaap: {entry.morning_sleep}/10</p>}
                        </div>
                      )}

                      {entry.thoughts && (
                        <div style={{ background: '#faf5ff', borderRadius: 12, padding: '10px 14px' }}>
                          <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Brain size={12} /> Gedachten
                          </p>
                          <p style={{ margin: 0, fontSize: 13, color: C.text }}>{entry.thoughts}</p>
                        </div>
                      )}

                      {entry.dribbel_dare && (
                        <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '10px 14px' }}>
                          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#15803d' }}>✎ Pyjama-Dribbel</p>
                          <p style={{ margin: '0 0 2px', fontSize: 11, color: C.textMuted }}>Vandaag durfde ik:</p>
                          <p style={{ margin: '0 0 8px', fontSize: 13, color: C.text }}>{entry.dribbel_dare}</p>
                          {entry.dribbel_try && <>
                            <p style={{ margin: '0 0 2px', fontSize: 11, color: C.textMuted }}>Morgen ga ik proberen:</p>
                            <p style={{ margin: 0, fontSize: 13, color: C.text }}>{entry.dribbel_try}</p>
                          </>}
                        </div>
                      )}

                      {(entry.gratitude_1 || entry.gratitude_2 || entry.gratitude_3) && (
                        <div style={{ background: '#fefce8', borderRadius: 12, padding: '10px 14px' }}>
                          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#a16207', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Star size={12} /> Dankbaarheid
                          </p>
                          {[entry.gratitude_1, entry.gratitude_2, entry.gratitude_3].filter(Boolean).map((g, i) => (
                            <p key={i} style={{ margin: i === 0 ? 0 : '4px 0 0', fontSize: 13, color: C.text }}>• {g}</p>
                          ))}
                        </div>
                      )}

                      {entry.points_earned > 0 && (
                        <div style={{ background: '#fff5f5', borderRadius: 12, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.red }}>Punten Verdiend</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Trophy size={16} color="#d97706" />
                            <span style={{ fontSize: 18, fontWeight: 800, color: C.red }}>+{entry.points_earned}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ marginTop: 32, textAlign: 'center', fontSize: 13, color: C.textMuted }}>
          Blijf dagelijks bijhouden om je groei te zien
        </p>
      </div>
    </div>
  );
};

export default Journal;
