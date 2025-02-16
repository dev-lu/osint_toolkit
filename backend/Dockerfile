FROM python:3.12-slim
WORKDIR /backend

RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    python3-dev \
    libxml2-dev \
    libxslt-dev \
    liblzma-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /backend/database/data
COPY ./requirements.txt /backend/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /backend/requirements.txt
COPY ./ /backend/
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]