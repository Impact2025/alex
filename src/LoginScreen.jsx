import React, { useState } from 'react';
import { User, Lock, LogIn, Delete } from 'lucide-react';
import { supabase } from './supabaseClient';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usePin, setUsePin] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  const handlePinLogin = async () => {
    setLoading(true);
    setError('');

    if (!email.trim() || pincode.length !== 4) {
      setError('Vul email en 4-cijferige pincode in');
      setLoading(false);
      return;
    }

    try {
      // Use pincode as password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: pincode,
      });

      if (error) throw error;

      if (data.user) {
        onLogin(data.user);
      }
    } catch (error) {
      setError('Inloggen mislukt. Controleer je gegevens.');
      setPincode('');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usePin) {
      handlePinLogin();
      return;
    }

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


  const handlePinPress = (num) => {
    if (pincode.length < 4) {
      setPincode(pincode + num);
    }
  };

  const handlePinDelete = () => {
    setPincode(pincode.slice(0, -1));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const pwd = usePin ? pincode : password;

    if (!email.trim() || !pwd.trim()) {
      setError('Vul alle velden in');
      setLoading(false);
      return;
    }

    if (usePin && pincode.length !== 4) {
      setError('Pincode moet 4 cijfers zijn');
      setLoading(false);
      return;
    }

    if (!usePin && password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens zijn');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: pwd,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) throw error;

      if (data.user) {
        // Check if email confirmation is required
        if (data.user.confirmed_at) {
          // User is already confirmed, can login immediately
          setError('');
          alert('Account aangemaakt! Log nu in met je gegevens.');
          setIsRegistering(false);
          setPincode('');
          setPassword('');
        } else {
          // Email confirmation required
          setError('');
          alert('Account aangemaakt! Check je email voor de bevestigingslink, of probeer direct in te loggen als email verificatie uit staat.');
          setIsRegistering(false);
          setPincode('');
          setPassword('');
        }
      }
    } catch (error) {
      setError(error.message || 'Registratie mislukt.');
    } finally {
      setLoading(false);
    }
  };

  const finalHandleSubmit = isRegistering ? handleRegister : handleSubmit;

  return (
    <div
      className="min-h-screen md:flex md:flex-col md:items-center md:justify-center p-4 md:p-8 text-white flex flex-col justify-center"
      style={{
        background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Johan_Cruijff_ArenA_-_Zicht_vanaf_de_noordzijde.jpg/1920px-Johan_Cruijff_ArenA_-_Zicht_vanaf_de_noordzijde.jpg) center/cover no-repeat'
      }}
    >
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">AJAX</h1>
        <p className="text-lg md:text-xl text-gray-300">Performance Suite</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl p-6 md:p-8 shadow-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isRegistering ? 'Registreren' : 'Inloggen'}
        </h2>

        <form onSubmit={finalHandleSubmit} className="space-y-4">
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

          {usePin ? (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Pincode (4 cijfers)</label>

              {/* Pin Display */}
              <div className="flex justify-center gap-3 mb-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-14 h-14 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-800 bg-white"
                  >
                    {pincode[i] ? '●' : ''}
                  </div>
                ))}
              </div>

              {/* Number Pad */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePinPress(num.toString())}
                    disabled={loading || pincode.length >= 4}
                    className="h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-2xl font-bold text-gray-800 transition-colors disabled:opacity-50"
                  >
                    {num}
                  </button>
                ))}
                <div></div>
                <button
                  type="button"
                  onClick={() => handlePinPress('0')}
                  disabled={loading || pincode.length >= 4}
                  className="h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-2xl font-bold text-gray-800 transition-colors disabled:opacity-50"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handlePinDelete}
                  disabled={loading || pincode.length === 0}
                  className="h-16 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <Delete size={24} className="text-red-600" />
                </button>
              </div>
            </div>
          ) : (
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
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (usePin && pincode.length !== 4)}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
          >
            <LogIn size={20} />
            <span>{loading ? 'Bezig...' : (isRegistering ? 'Registreren' : 'Inloggen')}</span>
          </button>
        </form>

        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            onClick={() => setUsePin(!usePin)}
            className="w-full text-gray-600 hover:text-red-600 font-semibold text-sm"
            disabled={loading}
          >
            {usePin ? 'Gebruik wachtwoord' : 'Gebruik pincode'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setPincode('');
              setPassword('');
              setError('');
            }}
            className="w-full text-gray-600 hover:text-red-600 font-semibold text-sm"
            disabled={loading}
          >
            {isRegistering ? 'Al een account? Inloggen' : 'Nieuw account? Registreren'}
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Maak jezelf klaar voor topprestaties!
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
