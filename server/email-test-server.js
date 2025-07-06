require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001; // Different port to avoid conflicts

app.use(express.json());

// Test endpoint for email functionality
app.get('/test-email', async (req, res) => {
    try {
        console.log('📧 Testing email via endpoint...');

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: process.env.NODEMAILER_SERVICE,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            }
        });

        // Verify connection first
        await transporter.verify();
        console.log('✅ SMTP connection verified');

        // Send test email
        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_SENDER_EMAIL,
            to: process.env.NODEMAILER_USER,
            subject: 'API Test Email - Student Mentoring System',
            html: `
                <h2>🚀 API Email Test Successful!</h2>
                <p>This test email was sent from the API endpoint.</p>
                <p><strong>Test Details:</strong></p>
                <ul>
                    <li>Service: ${process.env.NODEMAILER_SERVICE}</li>
                    <li>From: ${process.env.NODEMAILER_SENDER_EMAIL}</li>
                    <li>Endpoint: GET /test-email</li>
                    <li>Time: ${new Date().toLocaleString()}</li>
                </ul>
                <p>✅ Your email API is working correctly!</p>
            `
        });

        res.json({
            success: true,
            message: 'Test email sent successfully!',
            details: {
                messageId: info.messageId,
                service: process.env.NODEMAILER_SERVICE,
                from: process.env.NODEMAILER_SENDER_EMAIL,
                to: process.env.NODEMAILER_USER,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ Email test failed:', error.message);
        
        res.status(500).json({
            success: false,
            error: error.message,
            troubleshooting: {
                authIssues: 'Check email credentials and app password',
                connectionIssues: 'Verify internet connection and email service',
                invalidLogin: 'Generate new app password from Google Account settings'
            }
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Email test server is running',
        timestamp: new Date().toISOString(),
        endpoints: {
            testEmail: 'GET /test-email',
            health: 'GET /health'
        }
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Email Test Server for Student Mentoring System',
        availableEndpoints: [
            'GET / - This message',
            'GET /health - Health check',
            'GET /test-email - Send test email'
        ],
        usage: 'Visit http://localhost:3001/test-email to test email functionality'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Email test server running on http://localhost:${PORT}`);
    console.log(`📧 Test email endpoint: http://localhost:${PORT}/test-email`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log('\n📝 Configuration:');
    console.log(`   Service: ${process.env.NODEMAILER_SERVICE}`);
    console.log(`   User: ${process.env.NODEMAILER_USER}`);
    console.log(`   Sender: ${process.env.NODEMAILER_SENDER_EMAIL}`);
});
