"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { IoClose } from "react-icons/io5";
import { supabase } from "../../lib/SupabaseClient";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 120 }, (_, i) => currentYear - i);

function getDaysInMonth(month: number, year: number) {
  if (!month) return 31;
  return new Date(year || 2000, month, 0).getDate();
}

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [useEmail, setUseEmail] = useState(true);
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);
  const [year, setYear] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"info" | "password">("info");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const daysInMonth = getDaysInMonth(month, year);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isInfoValid =
    name.trim().length > 0 &&
    contact.trim().length > 0 &&
    month > 0 &&
    day > 0 &&
    year > 0;

  async function handleNext() {
    if (step === "info") {
      if (!useEmail) {
        setError(
          "Please use email to sign up. Phone sign-up is not yet supported.",
        );
        return;
      }
      setError("");
      setStep("password");
      return;
    }

    if (step === "password") {
      // Validate password length before making any API calls
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      setLoading(true);
      setError("");

      const email = contact.trim();

      // Attempt to create a new account with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Store name and DOB in the user's metadata
          data: {
            name: name.trim(),
            date_of_birth: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          },
        },
      });

      setLoading(false);

      // Handle explicit errors from Supabase (e.g. invalid email format)
      if (signUpError) {
        console.error("Signup error:", signUpError);
        setError(signUpError.message);
        return;
      }

      // Supabase returns a user with no identities if the email already exists
      // (it does this to prevent email enumeration attacks)
      if (data.user && data.user.identities?.length === 0) {
        setError("An account with this email already exists. Please sign in instead.");
        return;
      }

      // Success — close modal and navigate to profile setup
      onClose();
      router.replace("/auth/callback");
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(91,112,131,0.4)]"
      onClick={onClose}
    >
      <div
        className="bg-black w-full h-full sm:w-[600px] sm:h-[620px] sm:rounded-2xl flex flex-col relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-2 h-[53px] shrink-0">
          <button
            onClick={onClose}
            className="w-[34px] h-[34px] flex items-center justify-center rounded-full hover:bg-hover cursor-pointer"
          >
            <IoClose className="text-white text-[24px]" />
          </button>
          <div className="flex-1 flex justify-center">
            <FontAwesomeIcon
              icon={faXTwitter}
              className="text-white"
              style={{ width: 28, height: 28 }}
            />
          </div>
          <div className="w-[34px]" />
        </div>

        <div className="flex-1 flex flex-col px-[80px] sm:px-[80px] pt-[20px]">
          {step === "info" && (
            <>
              <h1 className="text-white text-[31px] font-bold mb-[28px]">
                Create your account
              </h1>

              <div className="relative mb-[24px]">
                <input
                  type="text"
                  value={name}
                  autoComplete="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder=" "
                  maxLength={50}
                  className="peer w-full h-[56px] bg-black border border-[#333] rounded-[4px] px-[12px] pt-[22px] pb-[6px] text-white text-[17px] outline-none focus:border-primary"
                />
                <label className="absolute left-[12px] top-[16px] text-secondary-text text-[17px] transition-all pointer-events-none peer-focus:top-[6px] peer-focus:text-[13px] peer-focus:text-primary peer-not-placeholder-shown:top-[6px] peer-not-placeholder-shown:text-[13px]">
                  Name
                </label>
                <span className="absolute right-[12px] top-[6px] text-secondary-text text-[13px] hidden peer-focus:block">
                  {name.length} / 50
                </span>
              </div>

              <div className="relative mb-[12px]">
                <input
                  type={useEmail ? "email" : "tel"}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-[56px] bg-black border border-[#333] rounded-[4px] px-[12px] pt-[22px] pb-[6px] text-white text-[17px] outline-none focus:border-primary"
                />
                <label className="absolute left-[12px] top-[16px] text-secondary-text text-[17px] transition-all pointer-events-none peer-focus:top-[6px] peer-focus:text-[13px] peer-focus:text-primary peer-not-placeholder-shown:top-[6px] peer-not-placeholder-shown:text-[13px]">
                  {useEmail ? "Email" : "Phone"}
                </label>
              </div>

              <button
                // onClick={() => {
                //   setUseEmail(!useEmail);
                //   setContact("");
                // }}
                className="text-primary text-[15px] text-right cursor-not-allowed hover:underline mb-[24px]"
              >
                {useEmail ? "Use phone instead" : "Use email instead"}
              </button>
              <div className="mb-[24px]" />

              <h2 className="text-white text-[15px] font-bold mb-[4px]">
                Date of birth
              </h2>
              <p className="text-secondary-text text-[14px] leading-[18px] mb-[16px]">
                This will not be shown publicly. Confirm your own age, even if
                this account is for a business, a pet, or something else.
              </p>

              <div className="flex gap-[12px] mb-[24px]">
                <div className="relative flex-[2]">
                  <select
                    name="month"
                    autoComplete="bday-month"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="peer w-full h-[56px] bg-black border border-[#333] rounded-[4px] px-[12px] pt-[22px] pb-[6px] text-white text-[17px] outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value={0} disabled hidden />
                    {months.map((m, i) => (
                      <option key={m} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <label className={`absolute left-[12px] text-secondary-text text-[17px] transition-all pointer-events-none peer-focus:top-[6px] peer-focus:text-[13px] peer-focus:text-primary ${month ? 'top-[6px] text-[13px]' : 'top-[16px]'}`}>
                    Month
                  </label>
                </div>

                <div className="relative flex-1">
                  <select
                    name="day"
                    autoComplete="bday-day"
                    value={day}
                    onChange={(e) => setDay(Number(e.target.value))}
                    className="peer w-full h-[56px] bg-black border border-[#333] rounded-[4px] px-[12px] pt-[22px] pb-[6px] text-white text-[17px] outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value={0} disabled hidden />
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <label className={`absolute left-[12px] text-secondary-text text-[17px] transition-all pointer-events-none peer-focus:top-[6px] peer-focus:text-[13px] peer-focus:text-primary ${day ? 'top-[6px] text-[13px]' : 'top-[16px]'}`}>
                    Day
                  </label>
                </div>

                <div className="relative flex-1">
                  <select
                    name="year"
                    autoComplete="bday-year"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="peer w-full h-[56px] bg-black border border-[#333] rounded-[4px] px-[12px] pt-[22px] pb-[6px] text-white text-[17px] outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value={0} disabled hidden />
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <label className={`absolute left-[12px] text-secondary-text text-[17px] transition-all pointer-events-none peer-focus:top-[6px] peer-focus:text-[13px] peer-focus:text-primary ${year ? 'top-[6px] text-[13px]' : 'top-[16px]'}`}>
                    Year
                  </label>
                </div>
              </div>
            </>
          )}

          {step === "password" && (
            <>
              <h1 className="text-white text-[31px] font-bold mb-[28px]">
                Create a password
              </h1>

              <div className="relative mb-[24px]">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-[56px] bg-black border border-[#333] rounded-[4px] px-[12px] pt-[22px] pb-[6px] text-white text-[17px] outline-none focus:border-primary"
                />
                <label className="absolute left-[12px] top-[16px] text-secondary-text text-[17px] transition-all pointer-events-none peer-focus:top-[6px] peer-focus:text-[13px] peer-focus:text-primary peer-not-placeholder-shown:top-[6px] peer-not-placeholder-shown:text-[13px]">
                  Password
                </label>
              </div>

              <p className="text-secondary-text text-[13px] leading-[16px]">
                By signing up, you agree to the{" "}
                <span className="text-primary">Terms of Service</span> and{" "}
                <span className="text-primary">Privacy Policy</span>, including{" "}
                <span className="text-primary">Cookie Use</span>. X may use your
                contact information, including your email address and phone number
                for purposes outlined in our Privacy Policy, like keeping your
                account secure and personalizing our services, including ads.{" "}
                <span className="text-primary">Learn more</span>. Others will be
                able to find you by email or phone number, when provided, unless
                you choose otherwise{" "}
                <span className="text-primary">here</span>.
              </p>
            </>
          )}

          {error && (
            <p className="text-red-500 text-[14px] mb-[12px]">{error}</p>
          )}
        </div>

        <div className="px-[80px] pb-[24px] shrink-0">
          <button
            onClick={handleNext}
            disabled={
              loading ||
              (step === "info" && !isInfoValid) ||
              (step === "password" && password.length < 6)
            }
            className="w-full h-[52px] bg-white text-black font-bold text-[17px] rounded-full cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
