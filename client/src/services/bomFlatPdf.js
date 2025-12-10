// BOM Flat PDF & Word Generation
// Imports and re-exports the generation functions from the unified PDF service

import { generateRecordPDFOffline, generateRecordDOCX } from './ubiShopPdf.js';

/**
 * Generate PDF for BOM Flat records
 * This function uses the unified PDF generation logic from ubiShopPdf.js
 * @param {Object} record - The BOM Flat record data
 * @returns {Promise<string>} - Returns the filename of the generated PDF
 */
export async function generateRecordPDF(record) {
    try {
        console.log('🏢 Generating BOM Flat PDF...');
        console.log('📊 BOM Flat Record:', {
            uniqueId: record?.uniqueId,
            bankName: record?.bankName,
            clientName: record?.clientName,
            city: record?.city,
            formType: record?.formType
        });
        
        // Use the unified offline PDF generation function
        const result = await generateRecordPDFOffline(record);
        
        console.log('✅ BOM Flat PDF generated successfully:', result);
        return result;
    } catch (error) {
        console.error('❌ BOM Flat PDF generation failed:', error);
        throw error;
    }
}

// Export the unified services for BOM Flat
export { generateRecordPDFOffline, generateRecordDOCX };
