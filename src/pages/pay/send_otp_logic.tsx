// services/apiService.ts
export const sendOTP = async (payload: unknown) => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      console.error('Error during Send OTP:', error);
      throw error;
    }
  };
  