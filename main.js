// main.js

// 서버와 연결 설정
const socket = io('http://localhost:5002');

// 서버 연결 시 메시지 표시
socket.on('connect', () => {
    console.log('서버에 연결되었습니다.');
    $('#statusList').append(`<li class="neutral status-message">서버에 연결되었습니다.</li>`);
});

// 서버 연결 해제 시 메시지 표시
socket.on('disconnect', () => {
    console.log('서버와의 연결이 끊어졌습니다.');
    $('#statusList').append(`<li class="neutral status-message">서버와의 연결이 끊어졌습니다.</li>`);
});

// 서버로부터 상태 업데이트 수신 시 메시지 표시
socket.on('status_update', (data) => {
    const message = data.message;
    console.log('Status update received:', message);
    $('#statusList').append(`<li class="neutral status-message">${message}</li>`);
    const statusUpdates = document.getElementById('statusUpdates');
    statusUpdates.scrollTop = statusUpdates.scrollHeight;
});

$(document).ready(() => {
    // 자동 거래 시작 폼 제출 시 처리
    $('#startForm').submit((event) => {
        event.preventDefault();
        const ticker = $('#ticker').val();
        const sid = socket.id;
        console.log('Socket ID:', sid);
        $.ajax({
            url: 'http://localhost:5002/start',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ ticker: ticker, sid: sid }),
            success: (data) => {
                console.log('Trading started:', data);
            },
            error: (xhr, status, error) => {
                $('#statusList').append(`<li class="neutral status-message">Error: ${xhr.responseText}</li>`);
                const statusUpdates = document.getElementById('statusUpdates');
                statusUpdates.scrollTop = statusUpdates.scrollHeight;
            }
        });
    });

    // Chart.js 초기화
    const ctx = document.getElementById('priceChart').getContext('2d');
    const priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Current Price',
                    borderColor: 'blue',
                    backgroundColor: 'blue', // 파란색 데이터 포인트 배경색
                    data: [],
                    fill: false,
                    tension: 0.1,
                    borderWidth: 2,
                    pointRadius: 3, // 포인트 크기 설정
                },
                {
                    label: 'Target Price',
                    borderColor: 'red',
                    data: [],
                    fill: false,
                    tension: 0.1,
                    borderWidth: 2,
                    pointRadius: 0 // 타겟 가격 포인트 숨기기
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',
                        tooltipFormat: 'll HH:mm',
                        displayFormats: {
                            minute: 'HH:mm'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price'
                    }
                }
            },
            animation: {
                duration: 500,
                easing: 'linear'
            }
        }
    });

    const MAX_DATA_POINTS = 50; // 최대 데이터 포인트 수

    let lastUpdateTime = 0;

    // 실시간 데이터 업데이트
    function updateChart(data) {
        const currentPrice = data.current_price;
        const targetPrice = data.target_price;
        const time = new Date(data.time);

        // 1분마다 데이터 업데이트
        if (time - lastUpdateTime >= 60000) {
            lastUpdateTime = time;

            if (priceChart.data.labels.length > MAX_DATA_POINTS) {
                priceChart.data.labels.shift();
                priceChart.data.datasets[0].data.shift();
                priceChart.data.datasets[1].data.shift();
            }

            priceChart.data.labels.push(time);
            priceChart.data.datasets[0].data.push(currentPrice);
            priceChart.data.datasets[1].data.push(targetPrice);

            priceChart.update();
        }
    }

    // 서버로부터 가격 업데이트 수신 시 차트 업데이트
    socket.on('price_update', (data) => {
        updateChart(data);
    });
});
