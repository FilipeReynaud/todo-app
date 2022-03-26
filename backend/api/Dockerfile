FROM python:3.9

COPY . /src

COPY ./requirements.txt /src/requirements.txt

WORKDIR /src

EXPOSE 8000:8000

RUN pip install -r requirements.txt

# CMD uvicorn main:app --reload
CMD ["uvicorn", "main:app","--reload", "--host", "0.0.0.0", "--port", "3001"]
