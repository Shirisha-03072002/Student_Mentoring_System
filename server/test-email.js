require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    try {
        console.log('🧪 Testing Email Configuration...');
        console.log('📧 Service:', process.env.NODEMAILER_SERVICE);
        console.log('👤 User:', process.env.NODEMAILER_USER);
        console.log('📤 Sender:', process.env.NODEMAILER_SENDER_EMAIL);

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: process.env.NODEMAILER_SERVICE,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            }
        });

        // Verify connection
        console.log('\n🔍 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully!');

        // Send test email
        console.log('\n📨 Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_SENDER_EMAIL,
            to: process.env.NODEMAILER_USER, // Send to yourself for testing
            subject: 'Test Email - Student Mentoring System',
            html: `
                <h2>📧 Email Test Successful!</h2>
                <p>This is a test email from your Student Mentoring System.</p>
                <p><strong>Test Details:</strong></p>
                <ul>
                    <li>Service: ${process.env.NODEMAILER_SERVICE}</li>
                    <li>From: ${process.env.NODEMAILER_SENDER_EMAIL}</li>
                    <li>Time: ${new Date().toLocaleString()}</li>
                </ul>
                <p>✅ Your email configuration is working correctly!</p>
                <hr>
                <small>This is an automated test email from Student Mentoring System</small>
            `
        });

        console.log('✅ Test email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('📮 Email sent to:', process.env.NODEMAILER_USER);
        
        if (info.response) {
            console.log('📋 Server response:', info.response);
        }

        console.log('\n🎉 Email test completed successfully! Check your inbox.');
        
    } catch (error) {
        console.error('\n❌ Email test failed:');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        
        if (error.code) {
            console.error('Error code:', error.code);
        }
        
        if (error.response) {
            console.error('Server response:', error.response);
        }

        // Common error suggestions
        console.log('\n💡 Troubleshooting suggestions:');
        if (error.message.includes('authentication') || error.message.includes('auth')) {
            console.log('- Check your email and app password are correct');
            console.log('- Make sure 2-factor authentication is enabled and you\'re using an app password');
        }
        if (error.message.includes('connection') || error.message.includes('ECONNREFUSED')) {
            console.log('- Check your internet connection');
            console.log('- Verify the email service is correct');
        }
        if (error.message.includes('Invalid login')) {
            console.log('- Generate a new app password from your Google Account settings');
            console.log('- Make sure "Less secure app access" is not needed (use app passwords instead)');
        }
    }
}

// Run the test
console.log('🚀 Starting Email Test...\n');
testEmail().then(() => {
    process.exit(0);
}).catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
});
