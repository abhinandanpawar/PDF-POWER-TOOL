import React, { useState, useMemo } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import jsPDF from 'jspdf';

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

const BasicInvoicePdfView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const [fromName, setFromName] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toName, setToName] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, price: 0 }]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const { subtotal, taxAmount, total } = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const taxAmount = subtotal * (tax / 100);
    const total = subtotal + taxAmount - discount;
    return { subtotal, taxAmount, total };
  }, [items, tax, discount]);

  const handleGeneratePdf = () => {
    try {
      const doc = new jsPDF();

      // Add content to the PDF
      doc.setFontSize(20);
      doc.text('Invoice', 105, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoiceNumber}`, 150, 40);
      doc.text(`Date: ${invoiceDate}`, 150, 48);

      doc.text('From:', 20, 40);
      doc.text(fromName, 20, 48);
      doc.text(fromAddress, 20, 56);

      doc.text('To:', 20, 80);
      doc.text(toName, 20, 88);
      doc.text(toAddress, 20, 96);

      let y = 120;
      doc.line(20, y - 5, 190, y - 5);
      doc.text('Description', 20, y);
      doc.text('Quantity', 120, y);
      doc.text('Price', 150, y);
      doc.text('Total', 180, y);
      y += 7;
      doc.line(20, y - 5, 190, y - 5);

      items.forEach(item => {
        const itemTotal = item.quantity * item.price;
        y += 7;
        doc.text(item.description, 20, y);
        doc.text(item.quantity.toString(), 120, y);
        doc.text(`$${item.price.toFixed(2)}`, 150, y);
        doc.text(`$${itemTotal.toFixed(2)}`, 180, y);
      });

      doc.line(20, y + 5, 190, y + 5);
      y += 12;
      doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, y);
      y += 7;
      doc.text(`Tax (${tax}%): $${taxAmount.toFixed(2)}`, 150, y);
      y += 7;
      doc.text(`Discount: $${discount.toFixed(2)}`, 150, y);
      y += 7;
      doc.setFontSize(14);
      doc.text(`Total: $${total.toFixed(2)}`, 150, y);

      doc.save('invoice.pdf');
      addToast({ type: 'success', message: 'Invoice PDF generated successfully!' });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to generate PDF.' });
      console.error(error);
    }
  };

  return (
    <ToolPageLayout
      title="Advanced Invoice PDF Generator"
      onBack={onBack}
      description="Create a detailed invoice with tax and discount calculations, and download it as a PDF."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">From</h3>
            <input type="text" placeholder="Your Name" value={fromName} onChange={e => setFromName(e.target.value)} className="w-full p-2 border rounded" />
            <textarea placeholder="Your Address" value={fromAddress} onChange={e => setFromAddress(e.target.value)} className="w-full p-2 border rounded" rows={3}></textarea>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">To</h3>
            <input type="text" placeholder="Client's Name" value={toName} onChange={e => setToName(e.target.value)} className="w-full p-2 border rounded" />
            <textarea placeholder="Client's Address" value={toAddress} onChange={e => setToAddress(e.target.value)} className="w-full p-2 border rounded" rows={3}></textarea>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Invoice #" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="w-full p-2 border rounded" />
            <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Items</h3>
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={e => handleItemChange(index, 'description', e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                className="w-24 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value))}
                className="w-24 p-2 border rounded"
              />
              <button onClick={() => handleRemoveItem(index)} className="p-2 bg-red-500 text-white rounded">&times;</button>
            </div>
          ))}
          <button onClick={handleAddItem} className="px-4 py-2 bg-gray-200 rounded">Add Item</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tax" className="block text-sm font-medium text-text-primary">Tax (%)</label>
            <input type="number" id="tax" value={tax} onChange={e => setTax(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-text-primary">Discount ($)</label>
            <input type="number" id="discount" value={discount} onChange={e => setDiscount(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="text-right space-y-2">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax: ${taxAmount.toFixed(2)}</p>
          <p>Discount: ${discount.toFixed(2)}</p>
          <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        </div>

        <button
          onClick={handleGeneratePdf}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Generate PDF
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default BasicInvoicePdfView;
