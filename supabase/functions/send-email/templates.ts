// =========================================================================
// SLAP BIBLE PATTERN CHALLENGE — TRANSACTIONAL EMAIL TEMPLATES
// Premium, Responsive HTML Email Templates with Original Beige & Brown Palette
// =========================================================================

export interface WelcomeEmailParams {
  name: string;
  email: string;
  appUrl: string;
}

export interface LoginEmailParams {
  name: string;
  email: string;
  loginTime: string;
  appUrl: string;
}

/**
 * Escapes HTML characters to prevent XSS in email clients
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 1. WELCOME EMAIL ON REGISTRATION
 * Original Beige & Brown Palette:
 * - Outer Background: #F7F4EF (Warm Beige / Parchment)
 * - Card Background: #FFFFFF (Pure White)
 * - Header: #2C1810 (Deep Espresso Brown)
 * - Gold Accent: #B8860B / #D4A017 (Burnished Gold)
 * - Crimson Accent: #B20D30 (SLAP Brand Crimson)
 * - Text Primary: #3D2E24 (Dark Mocha)
 * - Text Secondary: #7A6A5E (Warm Taupe)
 * - Border: #E8DED1 (Soft Sandstone)
 */
export function getWelcomeEmailHtml({ name, email, appUrl }: WelcomeEmailParams): string {
  const safeName = escapeHtml(name || 'Beloved Participant');
  const safeEmail = escapeHtml(email);
  const safeUrl = escapeHtml(appUrl || 'https://slapbiblepattern.org');
  const dashboardUrl = `${safeUrl.replace(/\/$/, '')}/dashboard`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to the SLAP Bible Challenge</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #F7F4EF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-header-padding { padding: 32px 20px !important; }
      .mobile-btn { width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F4EF;">
  <!-- Preheader preview text for inbox -->
  <div style="display: none; font-size: 1px; color: #F7F4EF; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Welcome to the SLAP Bible Challenge, ${safeName}! Your journey of daily consistency in God's Word begins today.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F4EF;">
    <tr>
      <td align="center" style="padding: 30px 15px 40px;">
        <!-- Email Container (Max 600px) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(44, 24, 16, 0.08); border: 1px solid #E8DED1;">
          
          <!-- Top Burnished Gold Accent Bar -->
          <tr>
            <td style="background-color: #B8860B; height: 5px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td class="mobile-header-padding" style="background: linear-gradient(135deg, #2C1810 0%, #3D2216 100%); padding: 40px 36px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <div style="display: inline-block; background-color: rgba(184, 134, 11, 0.2); border: 1px solid #B8860B; border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 26px; color: #E5C378;">
                      📖
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #D4A017; margin-bottom: 8px;">
                      GLOBAL BIBLE STUDY MOVEMENT
                    </span>
                    <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 26px; line-height: 1.3; color: #FFFFFF; font-weight: normal; letter-spacing: 0.5px;">
                      SLAP BIBLE CHALLENGE
                    </h1>
                    <p style="margin: 8px 0 0; font-size: 13px; color: #E8DED1; letter-spacing: 1px; text-transform: uppercase;">
                      Scripture • Lessons • Action Plans • Prayers
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Section -->
          <tr>
            <td class="mobile-padding" style="padding: 38px 36px 20px;">
              
              <!-- Greeting & Appreciation -->
              <h2 style="margin: 0 0 16px; font-family: 'Georgia', serif; font-size: 22px; color: #2C1810; font-weight: normal;">
                Welcome, ${safeName}! 👋
              </h2>

              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.7; color: #3D2E24;">
                We warmly welcome you to the <strong>SLAP Bible Pattern Challenge</strong> family. We deeply appreciate your decision to step forward and dedicate yourself to intentional, disciplined fellowship with God through His holy Word.
              </p>

              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.7; color: #3D2E24;">
                Taking this step is one of the most powerful spiritual investments you will ever make. The difference between spiritual stagnation and supernatural momentum is <strong>consistency</strong>.
              </p>

              <!-- Importance of Consistency Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF6F0; border-radius: 8px; border: 1px solid #E8DED1; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #B8860B; margin-bottom: 6px;">
                      ✦ The Power of Daily Consistency
                    </div>
                    <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #2C1810;">
                      When you study the Scriptures daily, God's Word becomes an anchor for your soul, a lamp to your steps, and a shield in every battle. Daily immersion builds deep spiritual discernment and transforms how you think, speak, and live.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Daily Instructions & SLAP Pattern -->
              <h3 style="margin: 0 0 12px; font-family: 'Georgia', serif; font-size: 17px; color: #2C1810;">
                How to Complete Your Daily Challenge:
              </h3>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td valign="top" style="width: 28px; padding-top: 2px;">
                          <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #2C1810; color: #E5C378; text-align: center; font-size: 12px; font-weight: 700; line-height: 22px;">1</div>
                        </td>
                        <td style="padding-left: 10px; font-size: 14px; line-height: 1.6; color: #3D2E24;">
                          <strong>Read Daily Chapters:</strong> Open your Bible Reader on the platform or read in your chosen translation every day.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td valign="top" style="width: 28px; padding-top: 2px;">
                          <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #2C1810; color: #E5C378; text-align: center; font-size: 12px; font-weight: 700; line-height: 22px;">2</div>
                        </td>
                        <td style="padding-left: 10px; font-size: 14px; line-height: 1.6; color: #3D2E24;">
                          <strong>Apply the SLAP Pattern:</strong> Extract the <strong>S</strong>triking verses, write down <strong>L</strong>essons learnt, define concrete <strong>A</strong>ction plans, and formulate heartfelt <strong>P</strong>rayers.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td valign="top" style="width: 28px; padding-top: 2px;">
                          <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #2C1810; color: #E5C378; text-align: center; font-size: 12px; font-weight: 700; line-height: 22px;">3</div>
                        </td>
                        <td style="padding-left: 10px; font-size: 14px; line-height: 1.6; color: #3D2E24;">
                          <strong>Submit Daily SLAP Reports:</strong> Submit your report on your dashboard to preserve your insights, keep your streak alive, and contribute to the global leaderboard.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Inspiring Bible Verse Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF6F0; border-left: 4px solid #B8860B; border-radius: 0 8px 8px 0; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B8860B; margin-bottom: 6px;">
                      📖 SCRIPTURE OF MEDITATION
                    </div>
                    <p style="margin: 0 0 8px; font-family: 'Georgia', serif; font-size: 15px; font-style: italic; line-height: 1.65; color: #2C1810;">
                      “This Book of the Law shall not depart from your mouth, but you shall meditate in it day and night, that you may observe to do according to all that is written in it. For then you will make your way prosperous, and then you will have good success.”
                    </p>
                    <div style="font-size: 13px; font-weight: 700; color: #7A6A5E;">
                      — Joshua 1:8 (NKJV)
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Personal Declaration Box (iSPEAK & iDECLARE) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FDF4F5; border-left: 4px solid #B20D30; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B20D30; margin-bottom: 6px;">
                      🔥 iSPEAK &amp; iDECLARE PERSONAL PROCLAMATION
                    </div>
                    <p style="margin: 0; font-family: 'Georgia', serif; font-size: 14px; line-height: 1.65; color: #2C1810;">
                      “I am disciplined, diligent, and unwavering in my devotion to God’s Word. The Scriptures are my daily bread and supernatural compass. As I read, meditate, and obey, divine light illuminates my path, and I flourish in all good works in Jesus’ name. Amen!”
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="mobile-btn">
                      <tr>
                        <td align="center" style="background-color: #2C1810; border-radius: 8px; border: 2px solid #B8860B;">
                          <a href="${dashboardUrl}" target="_blank" style="display: inline-block; padding: 15px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 700; color: #FFFFFF; text-decoration: none; letter-spacing: 0.5px;">
                            Launch My SLAP Dashboard &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                    <div style="font-size: 12px; color: #7A6A5E; margin-top: 10px;">
                      Direct Link: <a href="${safeUrl}" target="_blank" style="color: #B8860B; text-decoration: underline;">${safeUrl}</a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <p style="margin: 0 0 6px; font-size: 14px; line-height: 1.6; color: #3D2E24;">
                Standing together with you in faith, consistency, and victory,
              </p>
              <p style="margin: 0 0 24px; font-family: 'Georgia', serif; font-size: 16px; font-weight: bold; color: #2C1810;">
                The SLAP Bible Challenge Team
              </p>

            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td class="mobile-padding" style="background-color: #F7F4EF; border-top: 1px solid #E8DED1; padding: 24px 36px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #7A6A5E; line-height: 1.5;">
                You received this one-time welcome email because you registered for the SLAP Bible Challenge with <strong>${safeEmail}</strong>.
              </p>
              <p style="margin: 0 0 8px; font-size: 11px; color: #7A6A5E; line-height: 1.5;">
                Official Lead Admin: <a href="mailto:slapbiblechallenge@gmail.com" style="color: #B8860B; text-decoration: underline;">slapbiblechallenge@gmail.com</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #A09084;">
                &copy; ${new Date().getFullYear()} SLAP Bible Pattern Challenge. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 2. LOGIN EMAIL NOTIFICATION
 * Original Beige & Brown Palette
 */
export function getLoginEmailHtml({ name, email, loginTime, appUrl }: LoginEmailParams): string {
  const safeName = escapeHtml(name || 'Beloved Participant');
  const safeEmail = escapeHtml(email);
  const safeTime = escapeHtml(loginTime || new Date().toUTCString());
  const safeUrl = escapeHtml(appUrl || 'https://slapbiblepattern.org');
  const dashboardUrl = `${safeUrl.replace(/\/$/, '')}/dashboard`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Successful Login Notification — SLAP Bible Challenge</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #F7F4EF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-header-padding { padding: 30px 20px !important; }
      .mobile-btn { width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F4EF;">
  <!-- Preheader preview text -->
  <div style="display: none; font-size: 1px; color: #F7F4EF; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Successful login confirmed for ${safeName} on the SLAP Bible Challenge platform.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F4EF;">
    <tr>
      <td align="center" style="padding: 30px 15px 40px;">
        <!-- Email Container (Max 600px) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(44, 24, 16, 0.08); border: 1px solid #E8DED1;">
          
          <!-- Top Burnished Gold Accent Bar -->
          <tr>
            <td style="background-color: #B8860B; height: 5px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td class="mobile-header-padding" style="background: linear-gradient(135deg, #2C1810 0%, #3D2216 100%); padding: 32px 36px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #D4A017; margin-bottom: 6px;">
                      ACCOUNT SECURITY NOTIFICATION
                    </span>
                    <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 22px; color: #FFFFFF; font-weight: normal; letter-spacing: 0.5px;">
                      SLAP BIBLE CHALLENGE
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Section -->
          <tr>
            <td class="mobile-padding" style="padding: 32px 36px 20px;">
              
              <!-- Greeting & Login Confirmation -->
              <h2 style="margin: 0 0 14px; font-family: 'Georgia', serif; font-size: 20px; color: #2C1810; font-weight: normal;">
                Hello, ${safeName} 👋
              </h2>

              <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.65; color: #3D2E24;">
                This is a confirmation that your account was successfully logged in to the <strong>SLAP Bible Pattern Challenge</strong>.
              </p>

              <!-- Session Details Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF6F0; border-radius: 8px; border: 1px solid #E8DED1; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #7A6A5E;">
                          Participant Name:
                        </td>
                        <td align="right" style="padding-bottom: 8px; font-size: 14px; font-weight: bold; color: #2C1810;">
                          ${safeName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #7A6A5E;">
                          Registered Email:
                        </td>
                        <td align="right" style="padding-bottom: 8px; font-size: 14px; color: #2C1810;">
                          ${safeEmail}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #7A6A5E;">
                          Login Timestamp:
                        </td>
                        <td align="right" style="padding-bottom: 8px; font-size: 13px; color: #2C1810;">
                          ${safeTime}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #7A6A5E;">
                          Authentication Status:
                        </td>
                        <td align="right" style="font-size: 13px; font-weight: bold; color: #22c55e;">
                          &#10003; Verified &amp; Active
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Inspiring Bible Verse Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF6F0; border-left: 4px solid #B8860B; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B8860B; margin-bottom: 6px;">
                      ✦ DAILY WORD OF ENCOURAGEMENT
                    </div>
                    <p style="margin: 0 0 6px; font-family: 'Georgia', serif; font-size: 15px; font-style: italic; line-height: 1.6; color: #2C1810;">
                      “Through the Lord’s mercies we are not consumed, because His compassions fail not. They are new every morning; great is Your faithfulness.”
                    </p>
                    <div style="font-size: 12px; font-weight: 700; color: #7A6A5E;">
                      — Lamentations 3:22–23
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.65; color: #3D2E24;">
                Every time you step into the Scriptures, God has a word tailored for your destiny. Jump into your chapters today and write your SLAP Report!
              </p>

              <!-- Call to Action Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="mobile-btn">
                      <tr>
                        <td align="center" style="background-color: #2C1810; border-radius: 8px; border: 2px solid #B8860B;">
                          <a href="${dashboardUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; letter-spacing: 0.5px;">
                            Go to Devotional Dashboard &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Preferences Note -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F4EF; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px; font-size: 12px; line-height: 1.5; color: #7A6A5E;">
                    🔔 <strong>Notification Preference:</strong> You are receiving routine login alerts because this feature is enabled in your account. You can toggle this setting ON or OFF at any time directly from the profile banner on your Dashboard.
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 4px; font-size: 14px; color: #3D2E24;">In Christian love and service,</p>
              <p style="margin: 0 0 20px; font-family: 'Georgia', serif; font-size: 15px; font-weight: bold; color: #2C1810;">
                The SLAP Bible Challenge Team
              </p>

            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td class="mobile-padding" style="background-color: #F7F4EF; border-top: 1px solid #E8DED1; padding: 22px 36px; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 11px; color: #7A6A5E; line-height: 1.5;">
                If you did not perform this login, please secure your account immediately by changing your password.
              </p>
              <p style="margin: 0 0 8px; font-size: 11px; color: #7A6A5E; line-height: 1.5;">
                Official Lead Admin: <a href="mailto:slapbiblechallenge@gmail.com" style="color: #B8860B; text-decoration: underline;">slapbiblechallenge@gmail.com</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #A09084;">
                &copy; ${new Date().getFullYear()} SLAP Bible Pattern Challenge. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
