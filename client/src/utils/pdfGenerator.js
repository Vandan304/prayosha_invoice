import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generatePDF = (invoiceData, action = 'download') => {
    // Standard A4 dimensions
    const doc = new jsPDF('p', 'pt', 'a4');

    // 0. Religious Header
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("|| swami - shreeji ||", doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' });

    // 1. Header (Brand Name)
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0); // Black instead of Gold
    doc.text("PRAYOSHA", 40, 60);

    doc.setFontSize(14);
    doc.text("JEWELLERS", 200, 60);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black
    doc.text("Gold & Silver Jewellery Merchant", 40, 75);
    doc.text("Chokshi Bazar, Near Tower Bazar, Anand", 40, 90);
    doc.text("Phone: 9687852764 | 7567190904", 40, 105);

    // Decorative line
    doc.setDrawColor(0, 0, 0); // Black instead of Gold
    doc.setLineWidth(1.5);
    doc.line(40, 120, 550, 120);

    // 2. Invoice Details
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 40, 145);
    
    doc.setFont("helvetica", "normal");
    doc.text(`No: ${invoiceData.invoiceNumber}`, 40, 165);
    
    // Format date properly
    const dateObj = new Date(invoiceData.date);
    const formattedDate = dateObj.toLocaleDateString('en-GB'); 
    doc.text(`Date: ${formattedDate}`, 40, 185);

    // 3. Customer Details (Right side)
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO", 350, 145);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${invoiceData.customerName}`, 350, 165);
    if(invoiceData.mobile) doc.text(`Mobile: ${invoiceData.mobile}`, 350, 185);
    if(invoiceData.address) {
        // Simple word wrap for address
        const splitAddress = doc.splitTextToSize(`Address: ${invoiceData.address}`, 200);
        doc.text(splitAddress, 350, 205);
    }

    // 4. Products Table
    const tableColumnHeaders = [["#", "Item Description", "Purity", "Weight (gram)", "Rate (per gram)", "Amount"]];
    
    // For rate per 10g or per g logic 
    // Assuming typical gold rate input is per 10 grams, 
    // real amount = weight * (rate/10), but per requirements we just multiply them.
    // If the requirement meant Weight * Rate, we stick to that formula.
    
    const itemsList = invoiceData.items && invoiceData.items.length > 0 ? invoiceData.items : [invoiceData];

    const tableRows = itemsList.map((item, index) => [
        (index + 1).toString(),
        item.itemName || '',
        item.goldPurity === '22k' ? '916 - 22k' : (item.goldPurity || 'N/A'),
        Number(item.weight || 0).toFixed(3),
        (Number(invoiceData.goldRate || 0) / 10).toLocaleString('en-IN', {minimumFractionDigits: 2}),
        Number(item.goldPrice || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})
    ]);

    autoTable(doc, {
        startY: 230,
        head: tableColumnHeaders,
        body: tableRows,
        theme: 'grid',
        headStyles: {
            fillColor: [0, 0, 0], // Black instead of Gold
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 10,
            textColor: 50
        },
        columnStyles: {
            0: { halign: 'center' },
            1: { halign: 'left' },
            2: { halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right', fontStyle: 'bold' }
        },
        margin: { top: 10, left: 40, right: 40 }
    });

    // 5. Calculation Section
    const finalY = doc.lastAutoTable.finalY || 240;
    const calcSectionY = finalY + 20;

    doc.setFont("helvetica", "normal");
    
    // Left side info underneath table (T&C moved to bottom)
    doc.setFontSize(9);
    // Left empty for now, or you can add more info here

    // Right side amounts
    doc.setFontSize(10);
    const amountLabelX = 380;
    const amountValueX = 550; // Align right

    const totalGoldPrice = itemsList.reduce((sum, item) => sum + Number(item.goldPrice || 0), 0);
    const totalMakingCharge = invoiceData.totalMakingCharge !== undefined 
        ? Number(invoiceData.totalMakingCharge) 
        : itemsList.reduce((sum, item) => sum + Number(item.makingCharge || 0), 0);

    doc.text("Total Gold Price:", amountLabelX, calcSectionY);
    doc.text(`Rs. ${totalGoldPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}`, amountValueX, calcSectionY, { align: 'right' });

    doc.text("Total Making Charge:", amountLabelX, calcSectionY + 20);
    doc.text(`(+) Rs. ${totalMakingCharge.toLocaleString('en-IN')}`, amountValueX, calcSectionY + 20, { align: 'right' });
    
    let nextY = calcSectionY + 40;
    
    if (invoiceData.discount && Number(invoiceData.discount) > 0) {
        doc.text("Discount:", amountLabelX, nextY);
        doc.setTextColor(0, 0, 0); // Black instead of Red
        doc.text(`(-) Rs. ${Number(invoiceData.discount).toLocaleString('en-IN')}`, amountValueX, nextY, { align: 'right' });
        doc.setTextColor(0, 0, 0); // Reset color
        nextY += 20;
    } else {
        nextY += 10;
    }

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(1);
    doc.line(amountLabelX, nextY - 10, amountValueX, nextY - 10);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Grand Total:", amountLabelX, nextY + 5);
    doc.text(`Rs. ${Math.round(invoiceData.finalAmount).toLocaleString('en-IN')}`, amountValueX, nextY + 5, { align: 'right' });

    // 6. Footer & Signatures
    const footerY = 700;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    // Terms & Conditions at the bottom left
    const tcY = footerY - 40;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Terms & Conditions:", 40, tcY);
    doc.setFont("helvetica", "normal");
    doc.text("1. Goods once sold will not be returned under any conditions.", 40, tcY + 15);
    doc.text("2. Making charges are non-refundable.", 40, tcY + 30);
    doc.text("3. Subject to Anand Jurisdiction.", 40, tcY + 45);

    // Auth Signature Right
    doc.setFont("helvetica", "bold");
    doc.text("For, PRAYOSHA JEWELLERS", 380, footerY - 30);
    doc.setFont("helvetica", "normal");
    doc.text("Authorized Signatory", 400, footerY);
    doc.line(360, footerY - 10, 550, footerY - 10);

    // Decorative bottom border
    doc.setDrawColor(0, 0, 0); // Black instead of Gold
    doc.setLineWidth(3);
    doc.line(40, 800, 550, 800);

    // Output Action
    if (action === 'print') {
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    } else {
        doc.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
    }
};

export default generatePDF;
