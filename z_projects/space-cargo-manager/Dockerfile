FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN mkdir -p /app/data

COPY backend/requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY backend/app/ ./app/
COPY frontend/ ./frontend/
COPY *.csv ./data/

VOLUME ["/app/data"]

EXPOSE 8080

ENV ENV=docker

CMD ["python3", "-m", "app.main"]