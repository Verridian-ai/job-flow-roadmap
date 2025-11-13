import { useState, useRef, useEffect } from 'react';

interface ThreeDSecureProps {
  onVerify: (code: string) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export default function ThreeDSecure({ onVerify, onCancel, loading, error }: ThreeDSecureProps) {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (index === 5 && value) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        onVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Move to previous input and clear it
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      onVerify(pastedData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      onVerify(fullCode);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8f8f5] dark:bg-[#181711]">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="layout-content-container flex w-full max-w-lg flex-col items-center justify-center rounded-xl bg-[#f8f8f5] dark:bg-[#23200f] shadow-2xl">
            <div className="flex w-full flex-col gap-6 p-6 sm:p-8">
              {/* Header */}
              <div className="flex flex-col gap-3 text-center">
                <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
                  Verify Your Payment
                </h1>
                <p className="text-slate-500 dark:text-[#bbb69b] text-sm">
                  For your security, your bank requires an extra verification step to complete
                  this purchase.
                </p>
              </div>

              {/* Instructions */}
              <div className="flex flex-col gap-4 text-center">
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
                  Enter the 6-digit code sent to your mobile device.
                </p>

                {/* Code Input Fields */}
                <form onSubmit={handleSubmit}>
                  <fieldset
                    className="relative flex justify-center gap-2 sm:gap-4"
                    onPaste={handlePaste}
                  >
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="number"
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="flex h-14 w-12 text-center text-lg font-semibold text-slate-900 dark:text-white [appearance:textfield] bg-transparent focus:outline-0 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border-0 border-b-2 border-slate-300 dark:border-[#55513a] focus:border-[#f9d406] dark:focus:border-[#f9d406] focus:ring-0 transition-colors"
                        max={9}
                        min={0}
                        maxLength={1}
                        disabled={loading}
                      />
                    ))}
                  </fieldset>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 dark:bg-red-500/20 dark:text-red-400 mt-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4 mt-6">
                    <button
                      type="submit"
                      disabled={loading || code.some((d) => !d)}
                      className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#f9d406] text-[#181711] text-base font-bold tracking-[0.015em] hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#f9d406]/50 focus:ring-offset-2 focus:ring-offset-[#f8f8f5] dark:focus:ring-offset-[#181711] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="truncate">{loading ? 'Verifying...' : 'Submit'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={onCancel}
                      disabled={loading}
                      className="text-slate-500 dark:text-[#bbb69b] text-sm font-medium leading-normal text-center underline-offset-4 hover:underline disabled:opacity-50"
                    >
                      Cancel Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="w-full border-t border-slate-200 dark:border-slate-800 px-6 py-4">
              <p className="text-slate-500 dark:text-[#bbb69b] text-xs font-normal text-center">
                Secure payment processing powered by Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
