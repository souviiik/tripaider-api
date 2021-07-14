export function SignupSuccess(fname, email) {
  return `
    <div style="font-size: 16px; line-height: 22px;">
      <img src="https://www.tripaider.com/static/media/logo.3c890626.jpg" alt="tripaider logo" width="200" />

      <p>Hello ${fname}!</p>

      <p>You have successfully created your tripaider account with the following email address: <strong>${email}</strong>.</p>
      
      <p>If you have any queries or comments just send an email to <a href="mailto: support@tripaider.com">support@tripaider.com</a>. We would love to hear from you!</p>
    
      <p>Thank you for visiting tripaider's website.<br />
      The TRIPAIDER Web Team</p>
    </div>`;
}
