import { Input } from "@/Components/ui/input";

type OtpFormProps = {
  email: string;
  otpValues: string[];
  handleChange: (index: number, value: string) => void;
  handleKeyDown: (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  otpyerror: string;
  timer: number;
  formatTime: (seconds: number) => string;
  handleResend: () => void;
  setVerifyOldEmail?: (val: boolean) => void;
  setshowOTP: (val: boolean) => void;
  setTimer: (val: number) => void;
  setupdatedemail?: (val: string) => void;
};

export function OTPMenu({
  email,
  otpValues,
  handleChange,
  handleKeyDown,
  otpyerror,
  timer,
  formatTime,
  handleResend,
  setVerifyOldEmail,
  setshowOTP,
  setTimer,
  setupdatedemail
}: OtpFormProps) {
  return (
    <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
      {/* OTP Form */}
      <div className="w-full max-w-sm p-7">
        <h1 className="text-[1.3rem] font-bold text-gray-600 font-sans">
          Verify with OTP
        </h1>
        <p className="text-[0.8rem] text-gray-400 font-semibold">
          Sent to {email}
        </p>

        {/* OTP Inputs */}
        <div className="flex  gap-5 mt-7">
          {otpValues.map((value, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              value={value}
              maxLength={1}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-12 text-center text-lg font-medium border-gray-300 focus-visible:ring-1 focus-visible:ring-[#ff3f6ce0]"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
            />
          ))}
        </div>
        {otpyerror && (
          <p className="text-red-500 font-semibold text-[0.8rem] mt-3">
            {otpyerror}
          </p>
        )}
        <div className="text-[0.9rem] font-semibold text-gray-600 mt-4">
          {timer > 0 ? (
            <p className="text-sm text-gray-400">
              Resend OTP in {formatTime(timer)}
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-[#ff3f6ce0] font-bold cursor-pointer"
            >
              Resend OTP
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 font-semibold mt-6">
          Have trouble logging in?{" "}
          <a href="#" className="text-[#ff3f6ce0] font-bold">
            Get help
          </a>
        </p>
      </div>
      <button
        onClick={() => {
          {setVerifyOldEmail ? setVerifyOldEmail(false) : ""}
          {setupdatedemail ? setupdatedemail("") : ""}
          setshowOTP(false);
          setTimer(0);
        }}
        className="mt-4 text-gray-500 text-sm underline block text-center cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );
}
