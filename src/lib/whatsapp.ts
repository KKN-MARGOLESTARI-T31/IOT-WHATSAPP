import axios from 'axios';

// Meta WhatsApp API configuration
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.warn('Warning: WhatsApp credentials not configured. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN in .env');
}

/**
 * Send a text message via WhatsApp
 */
export async function sendTextMessage(to: string, message: string) {
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
        throw new Error('WhatsApp credentials not configured');
    }

    try {
        const response = await axios.post(
            `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: to,
                type: 'text',
                text: {
                    preview_url: false,
                    body: message
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            success: true,
            message_id: response.data.messages[0].id,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error sending WhatsApp message:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.message
        };
    }
}

/**
 * Send an image message via WhatsApp
 */
export async function sendImageMessage(to: string, imageUrl: string, caption?: string) {
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
        throw new Error('WhatsApp credentials not configured');
    }

    try {
        const response = await axios.post(
            `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: to,
                type: 'image',
                image: {
                    link: imageUrl,
                    caption: caption
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            success: true,
            message_id: response.data.messages[0].id,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error sending WhatsApp image:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.message
        };
    }
}

/**
 * Send a template message via WhatsApp
 */
export async function sendTemplateMessage(to: string, templateName: string, languageCode: string = 'en') {
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
        throw new Error('WhatsApp credentials not configured');
    }

    try {
        const response = await axios.post(
            `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                to: to,
                type: 'template',
                template: {
                    name: templateName,
                    language: {
                        code: languageCode
                    }
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            success: true,
            message_id: response.data.messages[0].id,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error sending WhatsApp template:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.message
        };
    }
}

/**
 * Mark a message as read
 */
export async function markMessageAsRead(messageId: string) {
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
        throw new Error('WhatsApp credentials not configured');
    }

    try {
        const response = await axios.post(
            `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                status: 'read',
                message_id: messageId
            },
            {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error marking message as read:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.message
        };
    }
}

/**
 * Get media URL from media ID
 */
export async function getMediaUrl(mediaId: string) {
    if (!ACCESS_TOKEN) {
        throw new Error('WhatsApp access token not configured');
    }

    try {
        const response = await axios.get(
            `${WHATSAPP_API_URL}/${mediaId}`,
            {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                }
            }
        );

        return {
            success: true,
            url: response.data.url,
            mime_type: response.data.mime_type
        };
    } catch (error: any) {
        console.error('Error getting media URL:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.message
        };
    }
}

/**
 * Download media file
 */
export async function downloadMedia(mediaUrl: string) {
    if (!ACCESS_TOKEN) {
        throw new Error('WhatsApp access token not configured');
    }

    try {
        const response = await axios.get(mediaUrl, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            responseType: 'arraybuffer'
        });

        return {
            success: true,
            data: response.data,
            contentType: response.headers['content-type']
        };
    } catch (error: any) {
        console.error('Error downloading media:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Verify webhook signature (for security)
 */
export function verifyWebhookSignature(payload: string, signature: string, appSecret: string): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
        .createHmac('sha256', appSecret)
        .update(payload)
        .digest('hex');

    return signature === `sha256=${expectedSignature}`;
}
