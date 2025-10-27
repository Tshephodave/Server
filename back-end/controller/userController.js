// controller/userController.js
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

async function register(req, res) {
  try {
    const { username, email, agent, phone, address, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({ username, email, agent, phone, address, role });
    await newUser.save();

    // Setup transporter (use App Password)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'www.tshepodavid@gmail.com',
        pass: 'kjvl nttf knhr zrqy', // make sure this is your Gmail App Password
      },
    });

    const mailOptions = {
      from: 'Vivlia Online Store <www.tshepodavid@gmail.com>',
      to: newUser.email,
      subject: 'Welcome to Vivlia Online Store - Registration Successful',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Vivlia</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f7fa; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); padding: 30px 0; text-align: center;">
                                    <img src="https://vivlia.co.za/wp-content/uploads/2023/07/Vivlia-Logo.png" alt="Vivlia Logo" style="max-width: 180px; height: auto;" />
                                </td>
                            </tr>
                            
                            <!-- Welcome Section -->
                            <tr>
                                <td style="padding: 40px 30px 30px 30px;">
                                    <h1 style="color: #28a745; font-size: 28px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
                                        Welcome to Vivlia Online Store!
                                    </h1>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Dear <strong>${newUser.username}</strong>,
                                    </p>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                                        Thank you for choosing Vivlia Online Store. Your registration has been successfully completed and your account is now active.
                                    </p>
                                </td>
                            </tr>

                            <!-- Account Details Card -->
                            <tr>
                                <td style="padding: 0 30px 30px 30px;">
                                    <div style="background-color: #f8fff9; border-left: 4px solid #28a745; padding: 20px; border-radius: 8px;">
                                        <h3 style="color: #1e7e34; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">
                                            Account Information
                                        </h3>
                                        <table width="100%" cellpadding="5" cellspacing="0">
                                            <tr>
                                                <td width="30%" style="color: #6b7280; font-size: 14px; padding: 8px 0;">Username:</td>
                                                <td style="color: #1f2937; font-weight: 500; padding: 8px 0;">${newUser.username}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Email:</td>
                                                <td style="color: #1f2937; font-weight: 500; padding: 8px 0;">${newUser.email}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Account Type:</td>
                                                <td style="color: #1f2937; font-weight: 500; padding: 8px 0;">${newUser.role || 'User'}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                            </tr>

                            <!-- Next Steps -->
                            <tr>
                                <td style="padding: 0 30px 30px 30px;">
                                    <h3 style="color: #1e7e34; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">
                                        Getting Started
                                    </h3>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                                        You can now access your account using your registered email address. Explore our extensive catalog and start placing orders today.
                                    </p>
                                    <div style="text-align: center; margin: 25px 0;">
                                        <a href="#" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                                            Access Your Account
                                        </a>
                                    </div>
                                </td>
                            </tr>

                            <!-- Support Section -->
                            <tr>
                                <td style="padding: 0 30px 40px 30px;">
                                    <div style="background-color: #f0fff4; border: 1px solid #c6f6d5; border-radius: 8px; padding: 20px; text-align: center;">
                                        <h3 style="color: #1e7e34; font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">
                                            Need Assistance?
                                        </h3>
                                        <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin: 0 0 15px 0;">
                                            Our support team is here to help you with any questions or concerns you may have.
                                        </p>
                                        <p style="color: #28a745; font-size: 14px; font-weight: 500; margin: 0;">
                                            📞 Support: +27 11 123 4567<br>
                                            ✉️ Email: support@vivlia.co.za
                                        </p>
                                    </div>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #1a331f; padding: 30px; text-align: center;">
                                    <p style="color: #a7f3d0; font-size: 14px; line-height: 1.5; margin: 0 0 15px 0;">
                                        &copy; 2024 Vivlia Online Store. All rights reserved.
                                    </p>
                                    <p style="color: #86efac; font-size: 12px; line-height: 1.4; margin: 0 0 10px 0;">
                                        This email was sent to ${newUser.email} as part of your Vivlia Online Store account registration.
                                    </p>
                                    <p style="color: #6ee7b7; font-size: 11px; line-height: 1.4; margin: 0;">
                                        123 Business Street, Johannesburg, South Africa
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
    };

    // Send email with await (catch actual error)
    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: 'User registered successfully and email sent' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'User registered but email not sent', error: error.message });
  }
}

// login, getUser, logout remain unchanged
async function login(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ userId: user._id, role: user.role }, 'order_web_2024');
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { register, login, logout, getUser };
