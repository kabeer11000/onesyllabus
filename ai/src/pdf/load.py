import json

import requests, pdf2image
import asyncio
from cv2 import imencode


def load_remote_image(url):
    return requests.get(url).content


def load_pdf_to_images(url):
    pdf = requests.get(url, stream=True)
    return pdf2image.convert_from_bytes(pdf.raw.read())  # Images


async def kabeer_cloud_upload_image(image):
    data = imencode('.jpg', image)[1].tobytes()
    res = json.loads(requests.post(url='https://docs.kabeercloud.tk/tests/papers/image-upload/upload.php',
                                   data=data,
                                   headers={'Content-Type': 'application/octet-stream'}).content)
    return res.url
