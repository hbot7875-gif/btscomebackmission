// ===== CHART-CONFIG.JS - Chart.js Options with Explanations =====

function getChartOptions(title = '', explanation = '') {
    return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            title: {
                display: !!title,
                text: title,
                color: '#d4af37',
                font: {
                    size: 14,
                    weight: 'bold'
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            subtitle: {
                display: !!explanation,
                text: explanation,
                color: '#999',
                font: {
                    size: 11,
                    weight: 'normal',
                    style: 'italic'
                },
                padding: {
                    bottom: 10
                }
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
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
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
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        }
    };
}

// Chart type specific configurations
function getLineChartOptions(title, explanation) {
    const options = getChartOptions(title, explanation);
    options.elements = {
        line: {
            tension: 0.4,
            borderWidth: 3
        },
        point: {
            radius: 4,
            hoverRadius: 6,
            borderWidth: 2,
            backgroundColor: '#0a0a0f'
        }
    };
    return options;
}

function getBarChartOptions(title, explanation) {
    const options = getChartOptions(title, explanation);
    options.plugins.legend.display = false;
    return options;
}
