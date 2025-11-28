// ===== CHART-CONFIG.JS - Chart.js Default Options =====

function getChartOptions(title = '') {
    return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            title: {
                display: !!title,
                text: title,
                color: '#d4af37',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: 20
            },
            legend: {
                labels: {
                    color: '#e0e0e0',
                    font: { size: 12 },
                    padding: 15,
                    usePointStyle: true
                }
            },
            tooltip: {
                backgroundColor: 'rgba(10, 10, 15, 0.95)',
                titleColor: '#d4af37',
                bodyColor: '#e0e0e0',
                borderColor: '#d4af37',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#999',
                    font: { size: 11 }
                },
                grid: {
                    color: 'rgba(212, 175, 55, 0.1)',
                    lineWidth: 1
                }
            },
            x: {
                ticks: {
                    color: '#999',
                    font: { size: 11 }
                },
                grid: {
                    display: false
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };
}
