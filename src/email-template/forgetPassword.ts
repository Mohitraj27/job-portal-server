function passwordResetTemplate(user: any, resetLink: string): string {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Password;</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
        }

        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header {
          background-color: #2d1e71;
          color: #ffffff;
          text-align: center;
          padding: 20px;
        }

        .header h2 {
          margin: 0;
          font-size: 24px;
        }

        .content {
          padding: 20px;
          text-align: center;
        }

        .content h3 {
          font-size: 18px;
          margin-bottom: 10px;
          color: #333;
        }

        .content p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .btn {
          display: inline-block;
          background-color: #2d1e71;
          color: #ffffff;
          text-decoration: none;
          font-size: 16px;
          padding: 12px 20px;
          border-radius: 4px;
          font-weight: bold;
          margin-top: 20px;
          text-color: #ffffff;
        }

        .btn:hover {
          background-color: #241661;
        }

        .footer {
          background-color: #2d1e71;
          color: #ffffff;
          text-align: center;
          padding: 20px;
        }

        .footer p {
          margin: 5px 0;
          font-size: 14px;
        }

        .footer a {
          color: #ffffff;
          text-decoration: none;
          font-weight: bold;
        }

        .footer a:hover {
          text-decoration: underline;
        }

        .social-icons {
          margin-top: 15px;
        }

        .social-icons a {
          margin: 0 8px;
          text-decoration: none;
          display: inline-block;
          color: #ffffff;
          font-size: 20px;
        }

        .social-icons a:hover {
          opacity: 0.8;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h2>Please Reset Your Password</h2>
        </div>
        <div class="content">
          <p>Hello ${user.personalDetails.firstName},</p>
          <p>We have sent this email in response to your request to reset your password.</p>
          <p>To reset your password, please click the button below:</p>
          <a href="${resetLink}" class="btn">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>Contact</p>
          <p>1912 Mcwhorter Road, FL 11223</p>
          <p>+111 222 333 | <a href="mailto:info@company.com">info@company.com</a></p>
          <div class="social-icons">
            <a href="https://facebook.com" target="_blank">🌐</a>
            <a href="https://twitter.com" target="_blank">🐦</a>
            <a href="https://instagram.com" target="_blank">📷</a>
            <a href="https://linkedin.com" target="_blank">🔗</a>
          </div>
          <p>Company © All Rights Reserved</p>
        </div>
      </div>
    </body>
  </html>
  `;
}

module.exports = { passwordResetTemplate };