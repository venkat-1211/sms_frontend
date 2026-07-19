import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';

const RevenueChart = ({ data = [] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 300;
    
    canvas.width = width;
    canvas.height = height;

    // Calculate dimensions
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find max value for scaling
    const maxRevenue = Math.max(...data.map(d => d.revenue || 0), 100);
    const maxAdmissions = Math.max(...data.map(d => d.admissions_count || 0), 1);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw bars and lines
    const barWidth = Math.min(chartWidth / data.length * 0.6, 40);
    const spacing = chartWidth / data.length;

    // Draw revenue bars
    data.forEach((item, index) => {
      const x = padding.left + index * spacing + (spacing - barWidth) / 2;
      const height = (item.revenue / maxRevenue) * chartHeight;
      const y = padding.top + chartHeight - height;

      // Bar gradient
      const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartHeight);
      gradient.addColorStop(0, '#0d6efd');
      gradient.addColorStop(1, '#6ea8fe');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, height, 4);
      ctx.fill();

      // Bar label (revenue amount)
      ctx.fillStyle = '#0d6efd';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`$${item.revenue || 0}`, x + barWidth / 2, y - 5);

      // X-axis labels
      ctx.fillStyle = '#6c757d';
      ctx.font = '11px Inter, sans-serif';
      const monthLabel = format(new Date(item.year, item.month - 1), 'MMM');
      ctx.fillText(monthLabel, x + barWidth / 2, padding.top + chartHeight + 20);

      // Draw admissions line points
      if (item.admissions_count > 0) {
        const pointX = padding.left + index * spacing + spacing / 2;
        const pointY = padding.top + chartHeight - (item.admissions_count / maxAdmissions) * chartHeight;

        ctx.fillStyle = '#20c997';
        ctx.beginPath();
        ctx.arc(pointX, pointY, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Admission count label
        ctx.fillStyle = '#20c997';
        ctx.font = '9px Inter, sans-serif';
        ctx.fillText(item.admissions_count, pointX, pointY - 10);
      }
    });

    // Draw admissions line
    if (data.length > 1) {
      ctx.strokeStyle = '#20c997';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();

      data.forEach((item, index) => {
        const x = padding.left + index * spacing + spacing / 2;
        const y = padding.top + chartHeight - (item.admissions_count / maxAdmissions) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw legend
    const legendY = height - 10;
    
    // Revenue legend
    ctx.fillStyle = '#0d6efd';
    ctx.fillRect(width - 200, legendY - 10, 12, 12);
    ctx.fillStyle = '#6c757d';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Revenue', width - 184, legendY + 1);

    // Admissions legend
    ctx.fillStyle = '#20c997';
    ctx.fillRect(width - 120, legendY - 10, 12, 12);
    ctx.fillStyle = '#6c757d';
    ctx.fillText('Admissions', width - 104, legendY + 1);

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

  // RoundRect polyfill for canvas if needed
  useEffect(() => {
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (r > w / 2) r = w / 2;
        if (r > h / 2) r = h / 2;
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        return this;
      };
    }
  }, []);

  if (data.length === 0) {
    return (
      <div className="card h-100">
        <div className="card-header">
          <h5 className="mb-0">Revenue & Admissions</h5>
        </div>
        <div className="card-body d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
          <div className="text-center text-muted">
            <i className="bi bi-bar-chart-line fs-1 d-block mb-2"></i>
            <p>No revenue data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Revenue & Admissions</h5>
        <div className="btn-group btn-group-sm">
          <button className="btn btn-outline-secondary active">12 Months</button>
          <button className="btn btn-outline-secondary">6 Months</button>
          <button className="btn btn-outline-secondary">3 Months</button>
        </div>
      </div>
      <div className="card-body">
        <canvas ref={canvasRef} style={{ width: '100%', height: '300px' }} />
      </div>
    </div>
  );
};

export default RevenueChart;