export const contactEmailTemplate = ({ email, subject, message }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>New Contact Message</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
      <tr>
        <td align="center">
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background:#2563eb; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:22px;">
                  📩 New Contact Message
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;">
                
                <p style="font-size:16px; margin-bottom:20px; color:#333;">
                  You have received a new message from your website contact form.
                </p>

                <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
                  
                  <tr>
                    <td style="font-weight:bold; width:120px; color:#555;">From:</td>
                    <td style="color:#111;">${email}</td>
                  </tr>

                  <tr>
                    <td style="font-weight:bold; color:#555;">Subject:</td>
                    <td style="color:#111;">${subject}</td>
                  </tr>

                </table>

                <div style="margin-top:20px; padding:15px; background:#f9fafb; border-radius:6px; border:1px solid #e5e7eb;">
                  <p style="margin:0; font-weight:bold; color:#555;">Message:</p>
                  <p style="margin-top:10px; color:#333; line-height:1.6;">
                    ${message}
                  </p>
                </div>

              </td>
            </tr>

            <!-- Footer -->

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};
