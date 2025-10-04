import React, { useState } from 'react';
import { User, Lock, LogIn, UserPlus } from 'lucide-react';
import { supabase } from './supabaseClient';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Vul alle velden in');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens zijn');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      if (data.user) {
        onLogin(data.user);
      }
    } catch (error) {
      setError(error.message || 'Inloggen mislukt. Controleer je gegevens.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Vul alle velden in');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens zijn');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) throw error;

      if (data.user) {
        setError('');
        alert('Account aangemaakt! Controleer je email voor verificatie.');
        setIsRegistering(false);
      }
    } catch (error) {
      setError(error.message || 'Registratie mislukt.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isRegistering ? handleRegister : handleLogin;

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
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isRegistering ? 'Registreren' : 'Inloggen'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none text-gray-800 bg-white"
                placeholder="je@email.com"
                disabled={loading}
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
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none text-gray-800 bg-white"
                placeholder="Minimaal 6 tekens"
                disabled={loading}
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
            disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
          >
            {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
            <span>{loading ? 'Bezig...' : (isRegistering ? 'Registreren' : 'Inloggen')}</span>
          </button>
        </form>

        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-4 text-gray-600 hover:text-red-600 font-semibold text-sm"
          disabled={loading}
        >
          {isRegistering ? 'Al een account? Inloggen' : 'Nog geen account? Registreren'}
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
          Maak jezelf klaar voor topprestaties!
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
