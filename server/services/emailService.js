const nodemailer =
  require('nodemailer');

console.log(
  'SMTP HOST:',
  process.env.SMTP_HOST
);

console.log(
  'SMTP PORT:',
  process.env.SMTP_PORT
);

console.log(
  'SMTP USER:',
  process.env.SMTP_USER
);

console.log(
  'SMTP PASS:',
  process.env.SMTP_PASS
);

const transporter =
  nodemailer.createTransport({

    host:
      process.env.SMTP_HOST,

    port:
      Number(
        process.env.SMTP_PORT
      ),

    secure: false,

    auth: {

      user:
        process.env.SMTP_USER,

      pass:
        process.env.SMTP_PASS
    }
  });

// ✅ SMTP TEST
transporter.verify(

  function (
    error,
    success
  ) {

    if (error) {

      console.log(
        'SMTP ERROR:',
        error
      );

    } else {

      console.log(
        'SMTP SERVER READY'
      );
    }
  }
);

// ✅ WELCOME EMAIL
const sendWelcomeEmail =
  async (
    email,
    fullName
  ) => {

    try {

      await transporter.sendMail({

        from:
          'RecoMart <bukharisaifullah33@gmail.com>',

        to: email,

        subject:
          'Welcome to RecoMart',

        html: `

          <h2>
            Welcome ${fullName}
          </h2>

          <p>
            Your account has been created successfully.
          </p>
        `
      });

      console.log(
        'Welcome email sent'
      );

    } catch (error) {

      console.log(
        'WELCOME EMAIL ERROR:',
        error
      );
    }
  };

// ✅ OTP EMAIL
const sendOTPEmail =
  async (
    email,
    otp
  ) => {

    try {

      await transporter.sendMail({

        from:
          'RecoMart <bukharisaifullah33@gmail.com>',

        to: email,

        subject:
          'RecoMart OTP Verification',

        html: `

          <h2>
            Your OTP Code
          </h2>

          <h1>
            ${otp}
          </h1>

          <p>
            OTP expires in 5 minutes.
          </p>
        `
      });

      console.log(
        'OTP email sent'
      );

    } catch (error) {

      console.log(
        'OTP EMAIL ERROR:',
        error
      );
    }
  };

module.exports = {

  sendWelcomeEmail,

  sendOTPEmail
};