import PyPDF2
import requests
import io


def get_pdf_text_layer(address: str):
    pdf = requests.get(address)
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf.content))
    return [{'text': pdf_reader.getPage(index).extractText(), 'index': index} for index in range(pdf_reader.numPages)]
