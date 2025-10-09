'use client';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

class TicketPDF {
  static generatePDF(ticket) {
    const doc = new jsPDF();

    // Add background color
    doc.setFillColor(12, 12, 20);
    doc.rect(0, 0, 210, 297, 'F');

    // Add header with gradient effect
    doc.setFillColor(76, 29, 149);
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('MOVIE TICKET', 105, 25, { align: 'center' });

    // Booking ID
    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.text(`Booking ID: ${ticket.bookingId}`, 105, 35, { align: 'center' });

    let yPosition = 60;

    // Movie Information Section
    doc.setFillColor(30, 30, 46);
    doc.rect(20, yPosition - 10, 170, 60, 'F');

    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('MOVIE INFORMATION', 25, yPosition);

    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.text(`Movie: ${ticket.movieTitle}`, 25, yPosition + 15);
    doc.text(`Date: ${new Date(ticket.showDate).toLocaleDateString()}`, 25, yPosition + 25);
    doc.text(`Time: ${this.formatTime(ticket.showTime)}`, 25, yPosition + 35);
    doc.text(`Hall: ${ticket.hall?.toUpperCase() || 'MAIN HALL'}`, 25, yPosition + 45);

    // User Information Section
    yPosition += 70;
    doc.setFillColor(30, 30, 46);
    doc.rect(20, yPosition - 10, 170, 40, 'F');

    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('USER INFORMATION', 25, yPosition);

    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.text(`Name: ${ticket.userName}`, 25, yPosition + 15);
    doc.text(`Email: ${ticket.userEmail}`, 25, yPosition + 25);

    // Seat Information Section
    yPosition += 50;
    doc.setFillColor(30, 30, 46);
    doc.rect(20, yPosition - 10, 170, 40, 'F');

    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('SEAT INFORMATION', 25, yPosition);

    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.text(`Seats: ${ticket.selectedSeats?.join(', ')}`, 25, yPosition + 15);
    doc.text(`Total Seats: ${ticket.selectedSeats?.length}`, 25, yPosition + 25);

    // Payment Information Section
    yPosition += 50;
    doc.setFillColor(30, 30, 46);
    doc.rect(20, yPosition - 10, 170, 40, 'F');

    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('PAYMENT INFORMATION', 25, yPosition);

    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.text(`Amount: $${ticket.totalAmount}`, 25, yPosition + 15);
    doc.text(`Status: ${ticket.paymentStatus?.toUpperCase()}`, 25, yPosition + 25);

    // QR Code Placeholder
    yPosition += 50;
    doc.setFillColor(30, 30, 46);
    doc.rect(75, yPosition - 10, 60, 60, 'F');

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('QR CODE', 105, yPosition + 25, { align: 'center' });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for your booking!', 105, 280, { align: 'center' });
    doc.text('Please present this ticket at the entrance.', 105, 285, { align: 'center' });

    // Save the PDF
    doc.save(`ticket-${ticket.bookingId}.pdf`);
  }

  static formatTime(time) {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  }
}

export default TicketPDF;