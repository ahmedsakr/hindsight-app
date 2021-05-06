import { useState } from 'react';

/**
 * useOTP is a hook for managing the storage and validation of an OTP input
 * from the user.
 */
export const useOTP = () => {
  const [ otp, setOtp ] = useState(['', '', '', '', '', '']);
  const [ otpFocus, setOtpFocus ] = useState({ enabled: true, index: 0 });

  const update = (index, value) => {

    if (value.length <= 1 || otp[index] === '') {

      if (value.length === 6) {
        setOtp(value.split(''));
        setOtpFocus({ ...otpFocus, index: 5 });
      } else if (value === '' || value.match(/[0-9]/)) {
        const copy = [...otp];
        copy[index] = value;

        setOtp(copy);

        if (otpFocus.enabled) {
          setOtpFocus({ ...otpFocus, index: otpFocus.index + 1 });
        }
      }
    }
  }

  return {
    current: otp,
    update,
    reset: () => {
      setOtp(['', '', '', '', '', '']);
      setOtpFocus({ enabled: true, index: 0 });
    },
    focus: {
      state: otpFocus,
      disable: () => setOtpFocus({ ...otpFocus, enabled: false }),
    }
  }
}