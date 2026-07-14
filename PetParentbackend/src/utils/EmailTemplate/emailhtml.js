
export const Emailhtml = (userName, resetUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Password Reset Request</h2>
      <p>Hello ${userName},</p>
      <p>You requested to reset your password.</p>
      <p>This link is valid for 15 minutes.</p>
      <p>
        <a href="${resetUrl}" 
           style="background-color:#4CAF50;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;"
           target="_blank">
           Reset Password
        </a>
      </p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    </div>
  `;
};
