// ===== CHART CONFIG =====

function getChartOptions(title = '') {
    return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            title: {
                display: !!title,
                text: title,
                color: '#ffd700',
                font: { size: 14, weight: 'bold' }
            },
            legend: {
                labels: {
                    color: '#e0e0e0',
                    font: { size: 12 },
                    usePointStyle: true
                }
            },
            tooltip: {
                backgroundColor: 'rgba(26, 26, 46, 0.95)',
                titleColor: '#ffd700',
                bodyColor: '#e0e0e0',
                borderColor: '#3a3a5c',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#a0a0b0' },
                grid: { color: 'rgba(255,215,0,0.1)' }
            },
            x: {
                ticks: { color: '#a0a0b0' },
                grid: { display: false }
            }
        },
        animation: {
            duration: 800,
            easing: 'easeOutQuart'
        }
    };
}

function getBarChartOptions(title) {
    const opts = getChartOptions(title);
    opts.plugins.legend.display = false;
    return opts;
}

function getLineChartOptions(title) {
    const opts = getChartOptions(title);
    opts.elements = {
        line: { tension: 0.4, borderWidth: 2 },
        point: { radius: 4, hoverRadius: 6 }
    };
    return opts;
}
