FROM frolvlad/alpine-miniconda3

COPY requirements.txt .

RUN pip install -r requirements.txt && \
    rm requirements.txt

EXPOSE 80

COPY ./src/app /app

WORKDIR /app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]