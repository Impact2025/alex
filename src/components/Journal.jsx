import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Star, Trophy, Brain, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import * as dailyEntryService from '../dailyEntryService';

const Journal = ({ onBack, user }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEntry, setExpandedEntry] = useState(null);

  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;

    setLoading(true);
    const data = await dailyEntryService.getAllEntries(user.id, 30);
    setEntries(data);
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('nl-NL', options);
  };

  const toggleEntry = (entryId) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200">
            <ArrowLeft className="text-red-600" size={24} />
          </button>
          <h1 className="text-2xl font-bold ml-4 text-red-700">Mijn Dagboek</h1>
        </div>
        <div className="text-center text-gray-600 mt-20">Laden...</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200">
            <ArrowLeft className="text-red-600" size={24} />
          </button>
          <h1 className="text-2xl font-bold ml-4 text-red-700">Mijn Dagboek</h1>
        </div>
        <div className="text-center mt-20">
          <div className="text-6xl mb-4">📔</div>
          <p className="text-gray-600">Nog geen dagboek entries.</p>
          <p className="text-gray-500 text-sm mt-2">Start met dagelijkse activiteiten om je dagboek te vullen!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200">
          <ArrowLeft className="text-red-600" size={24} />
        </button>
        <h1 className="text-2xl font-bold ml-4 text-red-700">Mijn Dagboek 📔</h1>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => {
          const isExpanded = expandedEntry === entry.id;
          const hasContent = entry.morning_goal || entry.thoughts || entry.dribbel_dare || entry.gratitude_1;

          return (
            <div
              key={entry.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {/* Header - Always visible */}
              <button
                onClick={() => toggleEntry(entry.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="text-red-600" size={20} />
                  <div className="text-left">
                    <p className="font-bold text-gray-800">{formatDate(entry.entry_date)}</p>
                    <p className="text-xs text-gray-500">
                      {entry.completed_missions?.length || 0} missies · {entry.points_earned || 0} punten
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {hasContent && <Star className="text-yellow-500" size={16} fill="currentColor" />}
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-gray-100 space-y-4">
                  {/* Morning data */}
                  {entry.morning_goal && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-blue-700 mb-1">🌅 Ochtend Doel</p>
                      <p className="text-sm text-gray-800">{entry.morning_goal}</p>
                      {entry.morning_sleep && (
                        <p className="text-xs text-gray-600 mt-1">Slaap: {entry.morning_sleep}/10</p>
                      )}
                    </div>
                  )}

                  {/* Thoughts */}
                  {entry.thoughts && (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-purple-700 mb-1 flex items-center">
                        <Brain size={14} className="mr-1" /> Gedachten
                      </p>
                      <p className="text-sm text-gray-800">{entry.thoughts}</p>
                    </div>
                  )}

                  {/* Dribbel */}
                  {entry.dribbel_dare && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-700 mb-2 flex items-center">
                        <Edit3 size={14} className="mr-1" /> Pyjama-Dribbel
                      </p>
                      <p className="text-xs text-gray-600 mb-1">Vandaag durfde ik:</p>
                      <p className="text-sm text-gray-800 mb-2">{entry.dribbel_dare}</p>
                      {entry.dribbel_try && (
                        <>
                          <p className="text-xs text-gray-600 mb-1">Morgen ga ik proberen:</p>
                          <p className="text-sm text-gray-800">{entry.dribbel_try}</p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Gratitude */}
                  {(entry.gratitude_1 || entry.gratitude_2 || entry.gratitude_3) && (
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-yellow-700 mb-2 flex items-center">
                        <Star size={14} className="mr-1" /> Dankbaarheid
                      </p>
                      {entry.gratitude_1 && <p className="text-sm text-gray-800 mb-1">• {entry.gratitude_1}</p>}
                      {entry.gratitude_2 && <p className="text-sm text-gray-800 mb-1">• {entry.gratitude_2}</p>}
                      {entry.gratitude_3 && <p className="text-sm text-gray-800">• {entry.gratitude_3}</p>}
                    </div>
                  )}

                  {/* Points earned */}
                  {entry.points_earned > 0 && (
                    <div className="bg-red-50 rounded-lg p-3 flex items-center justify-between">
                      <p className="text-xs font-semibold text-red-700">Punten Verdiend</p>
                      <div className="flex items-center space-x-1">
                        <Trophy className="text-yellow-600" size={16} />
                        <p className="text-lg font-bold text-red-600">+{entry.points_earned}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Blijf dagelijks bijhouden om je groei te zien! 🌱</p>
      </div>
    </div>
  );
};

export default Journal;
