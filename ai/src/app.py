import io

import PyPDF2
from flask import Flask, json, jsonify, make_response, request
import pdf.load as load
import pdf.recognize as recognize
import pdf.cleanup as cleanup
import time
from PIL import Image
import base64
from pdf.text_layer import get_pdf_text_layer
from search.load import load_documents, index as get_index, s3_bucket
from search.encode import find
import search.globals as indexes_files

Image.MAX_IMAGE_PIXELS = 1000000000
app = Flask(__name__)


@app.route("/_/index-creation/load")
def load_index_creation_task():
    import os
    os.unlink(indexes_files.documents_cache_path)
    os.unlink(indexes_files.ann_path)
    s3_bucket.Object(indexes_files.remote_documents_cache_path).delete()
    s3_bucket.Object(indexes_files.remote_ann_path).delete()
    return "1"


@app.route("/query")
def query_documents():
    start_time = time.time()
    docs = load_documents(s3_bucket)
    idmap, documents = docs['idmap'], docs['documents']
    print("found ", str(len(documents)), " documents")
    reverse_map = {v: k for k, v in idmap.items()}
    ann = get_index(reverse_map, documents, s3_bucket)
    print("initialised ann")
    indices, scores = find(ann, request.args.get('oq'), 30)
    print("found indices")
    return make_response(jsonify({"oq": request.args.get("oq"),
                                  'pages': [{'page': documents[docIndex], 'score': scores[index]} for
                                            index, docIndex in enumerate(indices)],
                                  'scores': scores,
                                  'execution_time': (time.time() - start_time)}), 200)


@app.route("/get-text-layer-from-pdf")
def metadata_text_extract():
    c = get_pdf_text_layer(base64.b64decode(request.args.get("pdf")).decode('utf-8'))
    return make_response(jsonify(c), 200)


@app.route("/_/toolbox/create-pdf-from-images")
def toolbox_create_pdf_from_images():
    image_uris = base64.b64decode(request.args.get("images")).decode('utf-8').split("|")
    images = [cleanup.pil_to_opencv(load.load_remote_image(image_uri)) for image_uri in image_uris]
    pdfs = [recognize.image_to_pdf(image) for image in images]
    # merge pdfs
    output = PyPDF2.PdfWriter()
    for index, pdf in enumerate(pdfs):
        pdf = PyPDF2.PdfFileReader(io.BytesIO(pdf))
        output.addPage(pdf.getPage(0))
    return make_response(jsonify({
        'pdf_file': output.write()  # binary file, will cause problems
    }), 200)


@app.route("/ocr")
def get_text_from_pdf():
    start_time = time.time()

    dirty_pdf = "https://docs.kabeercloud.tk/c/synced/628d4ff6677e9---Past%20Paper%202019%20Federal%20Board%20HSSC" \
                "%20Inter%20Part%20II%20Physics%20Objective%20English%20Medium.pdf"
    clean_pdf = "https://docs.kabeercloud.tk/p/v/60ae952811083.pdf"
    print("request recieved")
    images = load.load_pdf_to_images(base64.b64decode(request.args.get("pdf")).decode('utf-8'))
    print("loaded_pdf")
    images = [cleanup.pil_to_opencv(image) for image in images]
    print("converted images")
    images = [cleanup.clean_up_image(image) for image in images]
    print("cleaned images")
    thumbnail = load.kabeer_cloud_upload_image(images[0])
    #     for image in images:
    #         load.UploadImage(image)
    print("uploaded images")
    texts = [recognize.recognise(image) for image in images]
    print("recognised")
    #  "images": [str(b85encode(imencode('.jpg', image)[1].tobytes())) for image in images],
    return make_response(
        jsonify({"thumbnail": thumbnail, "pagecount": len(texts), "texts": texts,
                 "execution_time": (time.time() - start_time)}), 200)
