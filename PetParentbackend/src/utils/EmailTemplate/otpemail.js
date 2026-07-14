export const OtpEmailHtml = (userName, otp) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto;">
      
      <h2 style="color:#333;">Email Verification</h2>
      
      <p>Hello ${userName},</p>
      
      <p>Thank you for signing up with us.</p>
      
      <p>Your One-Time Password (OTP) for email verification is:</p>
      
      <div style="
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 4px;
        background-color: #f4f4f4;
        padding: 12px 20px;
        text-align: center;
        border-radius: 6px;
        margin: 20px 0;
      ">
        ${otp}
      </div>

      <p>This OTP is valid for <strong>5 minutes</strong>.</p>

      <p>If you did not create this account, you can safely ignore this email.</p>

      <br />
      
      
    </div>
  `;
};

export const LoginOtpEmailHtml  = (userName, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body style="margin:0; padding:0; background-color:#f0f4f8; font-family: 'Georgia', serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.08); max-width:600px; width:100%;">
              
              <tr>
                <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%); padding:40px 48px 36px; text-align:center;">
                  <div style="font-size:36px; margin-bottom:16px;">🐾</div>
                  <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:normal; letter-spacing:1px;">Verify Your Email</h1>
                  <p style="margin:8px 0 0; color:#a8b8d0; font-size:14px; font-family:Arial,sans-serif;">PetParent — Your trusted pet companion</p>
                </td>
              </tr>

              <tr>
                <td style="padding:44px 48px 36px;">
                  <p style="margin:0 0 12px; font-size:16px; color:#2d3748; font-family:Arial,sans-serif;">Hello <strong style="color:#0f3460;">${userName}</strong>,</p>
                  <p style="margin:0 0 28px; font-size:15px; color:#4a5568; line-height:1.7; font-family:Arial,sans-serif;">Welcome to PetParent! Use the verification code below to complete your login.</p>
                  
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:0 0 32px;">
                        <div style="display:inline-block; background:linear-gradient(135deg,#f7fafc,#edf2f7); border:2px solid #e2e8f0; border-radius:12px; padding:28px 48px; text-align:center;">
                          <p style="margin:0 0 6px; font-size:11px; color:#718096; letter-spacing:2px; text-transform:uppercase; font-family:Arial,sans-serif;">Your One-Time Password</p>
                          <p style="margin:0; font-size:42px; font-weight:bold; letter-spacing:12px; color:#0f3460; font-family:'Courier New',monospace;">${otp}</p>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                    <tr>
                      <td style="background-color:#fff8f0; border-left:4px solid #ed8936; border-radius:0 8px 8px 0; padding:14px 18px;">
                        <p style="margin:0; font-size:13px; color:#744210; font-family:Arial,sans-serif;">⏱ &nbsp;This code expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0; font-size:13px; color:#a0aec0; font-family:Arial,sans-serif;">If you did not request this, you can safely ignore this email.</p>
                </td>
              </tr>

              <tr><td style="padding:0 48px;"><hr style="border:none; border-top:1px solid #e2e8f0;" /></td></tr>

              <tr>
                <td style="padding:28px 48px 36px; text-align:center;">
                  <p style="margin:0 0 6px; font-size:13px; color:#718096; font-family:Arial,sans-serif;">Need help? <a href="mailto:support@petparent.com" style="color:#0f3460;">support@petparent.com</a></p>
                  <p style="margin:0; font-size:12px; color:#b0bec5; font-family:Arial,sans-serif;">© 2025 PetParent. All rights reserved.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};