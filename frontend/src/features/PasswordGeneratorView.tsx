import React, { useState, useEffect, useCallback } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import { RefreshCw, Copy, Check, X } from 'lucide-react';
import zxcvbn, { ZxcvbnResult } from 'zxcvbn';

interface PasswordGeneratorViewProps {
  onBack: () => void;
}

const secureRandom = (max: number) => {
  const randomValues = new Uint32Array(1);
  crypto.getRandomValues(randomValues);
  return randomValues[0] % max;
};

const CHARSETS = {
  LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
  UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  NUMBERS: '0123456789',
  SYMBOLS: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};


const PasswordGeneratorView: React.FC<PasswordGeneratorViewProps> = ({ onBack }) => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [strength, setStrength] = useState<ZxcvbnResult | null>(null);
  const { addToast } = useToasts();

  const handleGeneratePassword = useCallback(() => {
    let charset = '';
    let requiredChars = [];

    if (includeLowercase) {
      charset += CHARSETS.LOWERCASE;
      requiredChars.push(CHARSETS.LOWERCASE[secureRandom(CHARSETS.LOWERCASE.length)]);
    }
    if (includeUppercase) {
      charset += CHARSETS.UPPERCASE;
      requiredChars.push(CHARSETS.UPPERCASE[secureRandom(CHARSETS.UPPERCASE.length)]);
    }
    if (includeNumbers) {
      charset += CHARSETS.NUMBERS;
      requiredChars.push(CHARSETS.NUMBERS[secureRandom(CHARSETS.NUMBERS.length)]);
    }
    if (includeSymbols) {
      charset += CHARSETS.SYMBOLS;
      requiredChars.push(CHARSETS.SYMBOLS[secureRandom(CHARSETS.SYMBOLS.length)]);
    }

    if (charset === '') {
      addToast('error', 'Please select at least one character set.');
      return;
    }

    let newPassword = [...requiredChars];
    const remainingLength = length - newPassword.length;

    if (remainingLength > 0) {
        const randomValues = new Uint32Array(remainingLength);
        crypto.getRandomValues(randomValues);
        for (let i = 0; i < remainingLength; i++) {
            newPassword.push(charset[randomValues[i] % charset.length]);
        }
    }

    // Shuffle the array to mix required chars with random chars
    for (let i = newPassword.length - 1; i > 0; i--) {
        const j = secureRandom(i + 1);
        [newPassword[i], newPassword[j]] = [newPassword[j], newPassword[i]];
    }

    const finalPassword = newPassword.slice(0, length).join('');
    setPassword(finalPassword);
    setStrength(zxcvbn(finalPassword));

  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, addToast]);

  // Generate a password on initial load and when options change
  useEffect(() => {
    handleGeneratePassword();
  }, [handleGeneratePassword]);

  const handleCopyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      addToast('success', 'Password copied to clipboard!');
    }
  };

  return (
    <ToolPageLayout
      title="Password Generator"
      onBack={onBack}
      description="Create strong, random passwords and check their strength."
    >
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Password Display */}
        <div className="flex items-center gap-2 p-4 bg-background-alt border border-border rounded-lg">
          <span className="flex-grow font-mono text-lg text-text-primary truncate">{password}</span>
          <button onClick={handleGeneratePassword} title="Generate new password" className="p-2 text-text-secondary hover:text-primary transition-colors"><RefreshCw className="h-5 w-5" /></button>
          <button onClick={handleCopyPassword} title="Copy password" className="p-2 text-text-secondary hover:text-primary transition-colors"><Copy className="h-5 w-5" /></button>
        </div>

        {/* Strength Meter */}
        {strength && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Password Strength</h3>
              <span className={`font-bold text-lg ${
                strength.score === 4 ? 'text-green-500' :
                strength.score === 3 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {['Very Weak', 'Weak', 'Okay', 'Good', 'Strong'][strength.score]}
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-2.5">
              <div className={`h-2.5 rounded-full ${
                strength.score === 4 ? 'bg-green-500' :
                strength.score === 3 ? 'bg-yellow-500' :
                strength.score === 2 ? 'bg-orange-500' : 'bg-red-500'
              }`} style={{ width: `${(strength.score + 1) * 20}%` }}></div>
            </div>
            <p className="text-sm text-text-secondary text-right">
              Time to crack: {strength.crack_times_display.offline_slow_hashing_1e4_per_second}
            </p>
          </div>
        )}

        {/* Options */}
        <div className="space-y-4">
          {/* Length Slider */}
          <div className="flex flex-col">
            <label htmlFor="length" className="text-md mb-2">Password Length: <span className="font-bold text-primary">{length}</span></label>
            <input
              type="range"
              id="length"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Character Sets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="uppercase" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
              <label htmlFor="uppercase">Include Uppercase (A-Z)</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="lowercase" checked={includeLowercase} onChange={(e) => setIncludeLowercase(e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
              <label htmlFor="lowercase">Include Lowercase (a-z)</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="numbers" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
              <label htmlFor="numbers">Include Numbers (0-9)</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="symbols" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
              <label htmlFor="symbols">Include Symbols (!@#$%)</label>
            </div>
          </div>
        </div>

        <Recommendations strength={strength} options={{ length, includeUppercase, includeLowercase, includeNumbers, includeSymbols }} />
      </div>
    </ToolPageLayout>
  );
};

const ChecklistItem: React.FC<{ valid: boolean; children: React.ReactNode }> = ({ valid, children }) => (
  <li className={`flex items-center gap-2 ${valid ? 'text-green-500' : 'text-text-secondary'}`}>
    {valid ? <Check className="h-5 w-5" /> : <X className="h-5 w-5 text-red-500" />}
    <span>{children}</span>
  </li>
);

const Recommendations: React.FC<{ strength: ZxcvbnResult | null, options: { length: number, includeUppercase: boolean, includeLowercase: boolean, includeNumbers: boolean, includeSymbols: boolean } }> = ({ strength, options }) => {
  if (!strength) return null;

  const checks = {
    length: options.length >= 12,
    uppercase: options.includeUppercase,
    lowercase: options.includeLowercase,
    numbers: options.includeNumbers,
    symbols: options.includeSymbols,
    notCommon: !strength.feedback.warning && !strength.feedback.suggestions.length,
  };

  return (
    <div className="p-4 bg-background-alt border border-border rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
      <ul className="space-y-2">
        <ChecklistItem valid={checks.length}>At least 12 characters long</ChecklistItem>
        <ChecklistItem valid={checks.uppercase}>Includes uppercase letters</ChecklistItem>
        <ChecklistItem valid={checks.lowercase}>Includes lowercase letters</ChecklistItem>
        <ChecklistItem valid={checks.numbers}>Includes numbers</ChecklistItem>
        <ChecklistItem valid={checks.symbols}>Includes symbols</ChecklistItem>
        <ChecklistItem valid={checks.notCommon}>Not a common password</ChecklistItem>
      </ul>
    </div>
  );
}

export default PasswordGeneratorView;
