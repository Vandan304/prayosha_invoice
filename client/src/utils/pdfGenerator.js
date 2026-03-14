import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generatePDF = (invoiceData, action = 'download') => {
    // Standard A4 dimensions
    const doc = new jsPDF('p', 'pt', 'a4');

    // 1. Header (Brand Name)
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(212, 175, 55); // Hex #D4AF37 to RGB (Gold)
    doc.text("PRAYOSHA", 40, 50);

    doc.setFontSize(14);
    doc.text("JEWELLERS", 200, 50);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text("Gold & Silver Jewellery Merchant", 40, 65);
    doc.text("Chokshi Bazar, Near Tower Bazar, Anand", 40, 80);
    doc.text("Phone: 9687852764 | 7567190904", 40, 95);

    // Decorative line
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.5);
    doc.line(40, 110, 550, 110);

    // 2. Invoice Details
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 40, 135);
    
    doc.setFont("helvetica", "normal");
    doc.text(`No: ${invoiceData.invoiceNumber}`, 40, 155);
    
    // Format date properly
    const dateObj = new Date(invoiceData.date);
    const formattedDate = dateObj.toLocaleDateString('en-GB'); 
    doc.text(`Date: ${formattedDate}`, 40, 175);

    // 3. Customer Details (Right side)
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO", 350, 135);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${invoiceData.customerName}`, 350, 155);
    if(invoiceData.mobile) doc.text(`Mobile: ${invoiceData.mobile}`, 350, 175);
    if(invoiceData.address) doc.text(`Address: ${invoiceData.address}`, 350, 195);

    // 4. Products Table
    const tableColumnHeaders = [["#", "Item Description", "Purity", "Weight (g)", "Rate (per 10g)", "Amount"]];
    
    // For rate per 10g or per g logic 
    // Assuming typical gold rate input is per 10 grams, 
    // real amount = weight * (rate/10), but per requirements we just multiply them.
    // If the requirement meant Weight * Rate, we stick to that formula.
    
    const tableRows = [
        [
            "1",
            invoiceData.itemName,
            invoiceData.goldPurity,
            invoiceData.weight,
            Number(invoiceData.goldRate).toLocaleString('en-IN'),
            Number(invoiceData.goldPrice).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})
        ]
    ];

    autoTable(doc, {
        startY: 220,
        head: tableColumnHeaders,
        body: tableRows,
        theme: 'grid',
        headStyles: {
            fillColor: [212, 175, 55],
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
    
    // Left side info underneath table
    doc.setFontSize(9);
    doc.text("Terms & Conditions:", 40, calcSectionY);
    doc.text("1. Goods once sold will not be returned under any conditions.", 40, calcSectionY + 15);
    doc.text("2. Making charges are non-refundable.", 40, calcSectionY + 30);
    doc.text("3. Subject to Anand Jurisdiction.", 40, calcSectionY + 45);

    // Right side amounts
    doc.setFontSize(10);
    const amountLabelX = 380;
    const amountValueX = 550; // Align right

    doc.text("Gold Price:", amountLabelX, calcSectionY);
    doc.text(`Rs. ${Number(invoiceData.goldPrice).toLocaleString('en-IN', {minimumFractionDigits: 2})}`, amountValueX, calcSectionY, { align: 'right' });

    doc.text("Making Charge:", amountLabelX, calcSectionY + 20);
    doc.text(`(+) Rs. ${Number(invoiceData.makingCharge || 0).toLocaleString('en-IN')}`, amountValueX, calcSectionY + 20, { align: 'right' });
    
    let nextY = calcSectionY + 40;
    
    if (invoiceData.discount && Number(invoiceData.discount) > 0) {
        doc.text("Discount:", amountLabelX, nextY);
        doc.setTextColor(220, 53, 69); // Red for discount
        doc.text(`(-) Rs. ${Number(invoiceData.discount).toLocaleString('en-IN')}`, amountValueX, nextY, { align: 'right' });
        doc.setTextColor(50, 50, 50); // Reset color
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
    doc.text("Final Amount:", amountLabelX, nextY + 5);
    doc.text(`Rs. ${Math.round(invoiceData.finalAmount).toLocaleString('en-IN')}`, amountValueX, nextY + 5, { align: 'right' });

    // 6. Footer & Signatures
    const footerY = 700;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    // Customer Signature Left
    doc.text("Customer's Signature", 80, footerY);
    doc.line(40, footerY - 10, 200, footerY - 10);
    
    // Auth Signature Right
    doc.setFont("helvetica", "bold");
    doc.text("For, PRAYOSHA JEWELLERS", 380, footerY - 30);
    doc.setFont("helvetica", "normal");
    doc.text("Authorized Signatory", 400, footerY);
    doc.line(360, footerY - 10, 550, footerY - 10);

    // Decorative bottom border
    doc.setDrawColor(212, 175, 55);
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
