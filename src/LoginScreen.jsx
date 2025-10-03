import React, { useState } from 'react';
import { User, Lock, LogIn } from 'lucide-react';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Vul alle velden in');
      return;
    }

    // Simple validation - you can customize this
    if (password.length < 4) {
      setError('Wachtwoord moet minimaal 4 tekens zijn');
      return;
    }

    // Call onLogin with username
    onLogin(username);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 text-white"
      style={{
        background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Johan_Cruijff_ArenA_-_Zicht_vanaf_de_noordzijde.jpg/1920px-Johan_Cruijff_ArenA_-_Zicht_vanaf_de_noordzijde.jpg) center/cover no-repeat'
      }}
    >
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2">AJAX</h1>
        <p className="text-xl text-gray-300">Performance Suite</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Inloggen</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Gebruikersnaam</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none text-gray-800"
                placeholder="Voer je naam in"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Wachtwoord</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none text-gray-800"
                placeholder="Voer je wachtwoord in"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <LogIn size={20} />
            <span>Inloggen</span>
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Maak jezelf klaar voor topprestaties!
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
