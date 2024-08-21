# 업비트 자동 거래 시스템 (Upbit Auto Trading System)

## 📖 프로젝트 개요
이 프로젝트는 **업비트 API**를 활용하여 실시간 코인 데이터를 수집하고 분석하며, 이를 기반으로 자동 매매를 실행하는 시스템입니다. **LSTM 모델**을 통해 미래 가격을 예측하고, 특정 조건에 따라 자동으로 매수/매도 거래를 실행합니다. 이 시스템은 사용자에게 실시간 거래 데이터 대시보드와 자동화된 거래 기능을 제공합니다.

## ⚙️ 주요 기능
- **실시간 코인 가격 모니터링**: 업비트 API를 사용해 실시간으로 코인 가격과 변동 정보를 확인합니다.
- **LSTM 기반 가격 예측**: 시계열 데이터를 기반으로 미래 코인 가격을 예측합니다.
- **자동 거래 시스템**: 5일 이동평균선과 목표 가격을 기반으로 매수/매도 신호를 발생시키고, 자동으로 거래를 실행합니다.
- **실시간 대시보드**: Flask 서버와 SocketIO를 통해 실시간 거래 내역과 자산 현황을 제공하는 웹 대시보드를 지원합니다.

## 🛠️ 설치 방법

1. **필수 라이브러리 설치**:
   먼저, 프로젝트 디렉토리에서 필요한 Python 라이브러리를 설치합니다.

   ```bash
   pip install -r requirements.txt
