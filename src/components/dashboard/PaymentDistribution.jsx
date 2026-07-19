import React, { useEffect, useRef } from 'react';

const PaymentDistribution = ({ data = {} }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (Object.keys(data).length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 300;
    
    canvas.width = width;
    canvas.height = height;

    // Payment status colors
    const colors = {
      paid: '#10b981',
      partial: '#f59e0b',
      pending: '#ef4444',
    };

    const labels = {
      paid: 'Paid',
      partial: 'Partial',
      pending: 'Pending',
    };

    // Calculate totals
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    
    if (total === 0) {
      ctx.fillStyle = '#6c757d';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No payment data available', width / 2, height / 2);
      return;
    }

    // Draw donut chart
    const centerX = width * 0.35;
    const centerY = height / 2;
    const radius = Math.min(width * 0.25, height * 0.4);
    const innerRadius = radius * 0.6;

    let startAngle = -Math.PI / 2;
    const entries = Object.entries(data);

    entries.forEach(([key, value]) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = colors[key] || '#6c757d';
      ctx.fill();

      // Draw inner circle for donut
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Draw percentage in center
      const percentage = ((value / total) * 100).toFixed(1);
      
      // Draw label lines for larger slices
      if (sliceAngle > 0.3) {
        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius + 15;
        const x = centerX + Math.cos(midAngle) * labelRadius;
        const y = centerY + Math.sin(midAngle) * labelRadius;

        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(midAngle) * radius, centerY + Math.sin(midAngle) * radius);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#6c757d';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#212529';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${labels[key]} (${percentage}%)`, x + (Math.cos(midAngle) > 0 ? 8 : -8), y);
      }

      startAngle = endAngle;
    });

    // Draw center text
    ctx.fillStyle = '#212529';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Payment', centerX, centerY - 12);
    ctx.fillStyle = '#6c757d';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Status', centerX, centerY + 12);

    // Draw legend on the right side
    const legendX = width * 0.65;
    let legendY = height * 0.2;

    entries.forEach(([key, value]) => {
      const percentage = ((value / total) * 100).toFixed(1);
      
      // Color box
      ctx.fillStyle = colors[key] || '#6c757d';
      ctx.fillRect(legendX, legendY, 12, 12);

      // Label
      ctx.fillStyle = '#212529';
      ctx.font = '13px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`${labels[key]} (${percentage}%)`, legendX + 18, legendY);

      // Value
      ctx.fillStyle = '#6c757d';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText(`${value}`, width - 20, legendY);

      legendY += 35;
    });

    // Handle resize
    const handleResize = () => {
      const newWidth = canvas.parentElement.clientWidth;
      if (newWidth !== width) {
        canvas.width = newWidth;
        // Redraw logic would go here
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [data]);

  if (Object.keys(data).length === 0) {
    return (
      <div className="card h-100">
        <div className="card-header">
          <h5 className="mb-0">Payment Distribution</h5>
        </div>
        <div className="card-body d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
          <div className="text-center text-muted">
            <i className="bi bi-pie-chart fs-1 d-block mb-2"></i>
            <p>No payment data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100">
      <div className="card-header">
        <h5 className="mb-0">Payment Distribution</h5>
      </div>
      <div className="card-body">
        <canvas ref={canvasRef} style={{ width: '100%', height: '300px' }} />
      </div>
    </div>
  );
};

export default PaymentDistribution;