import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete, LogIn, Shield } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { signInWithPincode } = useAuth();
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pincode.length !== 4) {
      setError('Pincode moet 4 cijfers zijn');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await signInWithPincode(pincode);

      if (error) {
        throw error;
      }

      if (data?.user) {
        // Navigate to home
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Ongeldige pincode');
      setPincode('');
    } finally {
      setLoading(false);
    }
  };

  const handlePinPress = (num) => {
    if (pincode.length < 4) {
      setPincode(pincode + num);
      setError('');
    }
  };

  const handlePinDelete = () => {
    setPincode(pincode.slice(0, -1));
    setError('');
  };

  return (
    <main
      className="min-h-screen md:flex md:flex-col md:items-center md:justify-center p-4 md:p-8 text-white flex flex-col justify-center"
      style={{
        background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Johan_Cruijff_ArenA_-_Zicht_vanaf_de_noordzijde.jpg/1920px-Johan_Cruijff_ArenA_-_Zicht_vanaf_de_noordzijde.jpg) center/cover no-repeat'
      }}
    >
      <header className="text-center mb-6 md:mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">AJAX</h1>
        <p className="text-lg md:text-xl text-gray-300">Champions Academy</p>
      </header>

      <section className="w-full max-w-sm bg-white rounded-2xl p-6 md:p-8 shadow-2xl mx-auto" aria-label="Login formulier">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center" id="login-title">
          Inloggen met Pincode
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="login-title">
          <div>
            <label id="pincode-label" className="block text-gray-700 font-semibold mb-2 text-center">
              Voer je 4-cijferige pincode in
            </label>

            {/* Pin Display */}
            <div className="flex justify-center gap-3 mb-4" role="group" aria-labelledby="pincode-label" aria-live="polite">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-14 h-14 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-800 bg-white"
                  aria-label={`Pincode cijfer ${i + 1} ${pincode[i] ? 'ingevuld' : 'leeg'}`}
                >
                  {pincode[i] ? '●' : ''}
                </div>
              ))}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3 mb-4" role="group" aria-label="Pincode invoer">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePinPress(num.toString())}
                  disabled={loading || pincode.length >= 4}
                  className="h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-2xl font-bold text-gray-800 transition-colors disabled:opacity-50"
                  aria-label={`Cijfer ${num}`}
                >
                  {num}
                </button>
              ))}
              <div aria-hidden="true"></div>
              <button
                type="button"
                onClick={() => handlePinPress('0')}
                disabled={loading || pincode.length >= 4}
                className="h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-2xl font-bold text-gray-800 transition-colors disabled:opacity-50"
                aria-label="Cijfer 0"
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinDelete}
                disabled={loading || pincode.length === 0}
                className="h-16 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                aria-label="Verwijder laatste cijfer"
              >
                <Delete size={24} className="text-red-600" aria-hidden="true" />
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || pincode.length !== 4}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
            aria-label={loading ? 'Bezig met laden' : 'Log in'}
          >
            <LogIn size={20} aria-hidden="true" />
            <span>{loading ? 'Bezig...' : 'Inloggen'}</span>
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6" role="contentinfo">
          Welkom bij de Champions Academy! 🏆
        </p>
      </section>
    </main>
  );
};

export default LoginScreen;
