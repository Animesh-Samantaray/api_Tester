const otpTemplate = (otp) => {
    return `
        <div style="background-color: #f4f6f8; padding: 40px 20px; font-family: 'Segoe UI', Arial, sans-serif; min-height: 100%; margin: 0;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #eef2f5;">
                
                <!-- Header Banner -->
                <div style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 30px; text-align: center;">
                    <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">BLOG App</h2>
                </div>

                <!-- Content Body -->
                <div style="padding: 40px 30px; text-align: center;">
                    <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 10px; font-size: 20px; font-weight: 600;">Reset Your Password</h3>
                    <p style="color: #4b5563; font-size: 15px; line-height: 1.5; margin-bottom: 30px;">
                        We received a request to reset your password. Use the verification code below to proceed:
                    </p>

                    <!-- OTP Display Box -->
                    <div style="background-color: #f0fdf4; border: 2px dashed #4ade80; border-radius: 8px; padding: 18px; margin-bottom: 30px; display: inline-block; letter-spacing: 6px; padding-left: 24px;">
                        <span style="font-size: 32px; font-weight: 700; color: #166534; font-family: 'Courier New', Courier, monospace;">${otp}</span>
                    </div>

                    <!-- Expiry Warning -->
                    <div style="display: flex; align-items: center; justify-content: center; background-color: #fffbeb; border-radius: 6px; padding: 10px 15px; max-width: 320px; margin: 0 auto 20px auto;">
                        <span style="color: #b45309; font-size: 13px; font-weight: 500;">⏱️ This OTP will expire in 10 minutes.</span>
                    </div>

                    <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                    </p>
                </div>

                <!-- Footer -->
                <div style="background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} BLOG App. All rights reserved.</p>
                </div>

            </div>
        </div>
    `;
};

export default otpTemplate;