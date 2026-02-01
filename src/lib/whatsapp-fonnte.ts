import axios from 'axios';

// Fonnte API configuration
const FONNTE_API_URL = 'https://api.fonnte.com';
const FONNTE_TOKEN = process.env.FONNTE_TOKEN;

if (!FONNTE_TOKEN) {
    console.warn('Warning: Fonnte token not configured. Set FONNTE_TOKEN in .env');
}

/**
 * Send a text message via WhatsApp using Fonnte
 */
export async function sendTextMessage(to: string, message: string) {
    if (!FONNTE_TOKEN) {
        throw new Error('Fonnte token not configured');
    }

    try {
        const response = await axios.post(
            `${FONNTE_API_URL}/send`,
            {
                target: to,
                message: message,
                countryCode: '62', // Indonesia - sesuaikan jika perlu
            },
            {
                headers: {
                    'Authorization': FONNTE_TOKEN,
                }
            }
        );

        // Fonnte response format
        if (response.data.status) {
            return {
                success: true,
                message_id: response.data.id || Date.now().toString(),
                data: response.data
            };
        } else {
            return {
                success: false,
                error: response.data.reason || 'Failed to send message'
            };
        }
    } catch (error: any) {
        console.error('Error sending Fonnte message:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.reason || error.message
        };
    }
}

/**
 * Send an image message via WhatsApp using Fonnte
 */
export async function sendImageMessage(to: string, imageUrl: string, caption?: string) {
    if (!FONNTE_TOKEN) {
        throw new Error('Fonnte token not configured');
    }

    try {
        const response = await axios.post(
            `${FONNTE_API_URL}/send`,
            {
                target: to,
                url: imageUrl,
                caption: caption || '',
                countryCode: '62',
            },
            {
                headers: {
                    'Authorization': FONNTE_TOKEN,
                }
            }
        );

        if (response.data.status) {
            return {
                success: true,
                message_id: response.data.id || Date.now().toString(),
                data: response.data
            };
        } else {
            return {
                success: false,
                error: response.data.reason || 'Failed to send image'
            };
        }
    } catch (error: any) {
        console.error('Error sending Fonnte image:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.reason || error.message
        };
    }
}

/**
 * Send a file/document via WhatsApp using Fonnte
 */
export async function sendDocumentMessage(to: string, fileUrl: string, filename?: string) {
    if (!FONNTE_TOKEN) {
        throw new Error('Fonnte token not configured');
    }

    try {
        const response = await axios.post(
            `${FONNTE_API_URL}/send`,
            {
                target: to,
                file: fileUrl,
                filename: filename,
                countryCode: '62',
            },
            {
                headers: {
                    'Authorization': FONNTE_TOKEN,
                }
            }
        );

        if (response.data.status) {
            return {
                success: true,
                message_id: response.data.id || Date.now().toString(),
                data: response.data
            };
        } else {
            return {
                success: false,
                error: response.data.reason || 'Failed to send document'
            };
        }
    } catch (error: any) {
        console.error('Error sending Fonnte document:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.reason || error.message
        };
    }
}

/**
 * Get device status/info from Fonnte
 */
export async function getDeviceStatus() {
    if (!FONNTE_TOKEN) {
        throw new Error('Fonnte token not configured');
    }

    try {
        const response = await axios.post(
            `${FONNTE_API_URL}/get-devices`,
            {},
            {
                headers: {
                    'Authorization': FONNTE_TOKEN,
                }
            }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error getting Fonnte device status:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.reason || error.message
        };
    }
}

/**
 * Get message history from Fonnte
 */
export async function getFonnteMessageHistory(limit: number = 100) {
    if (!FONNTE_TOKEN) {
        throw new Error('Fonnte token not configured');
    }

    try {
        const response = await axios.post(
            `${FONNTE_API_URL}/get-message-history`,
            {
                limit: limit
            },
            {
                headers: {
                    'Authorization': FONNTE_TOKEN,
                }
            }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error getting Fonnte message history:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.reason || error.message
        };
    }
}

/**
 * Validate phone number format for Fonnte
 */
export function validatePhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, replace with 62
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1);
    }

    // If doesn't start with 62, add it
    if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned;
    }

    return cleaned;
}

/**
 * Mark message as read (Fonnte doesn't have this feature natively)
 * This is a placeholder for compatibility
 */
export async function markMessageAsRead(messageId: string) {
    // Fonnte doesn't have mark as read feature
    // Return success for compatibility
    return {
        success: true,
        data: { message: 'Fonnte does not support mark as read' }
    };
}

/**
 * Legacy function names for backward compatibility
 */
export const sendTemplateMessage = sendTextMessage; // Fonnte doesn't have templates, use regular text
export const getMediaUrl = async (mediaId: string) => ({ success: false, error: 'Not supported by Fonnte' });
export const downloadMedia = async (mediaUrl: string) => ({ success: false, error: 'Not supported by Fonnte' });
