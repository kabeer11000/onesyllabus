import pytesseract


def set_tesseract_binary(path):
    pytesseract.pytesseract.tesseract_cmd = path


def image_to_pdf(image):
    return pytesseract.image_to_pdf_or_hocr(image, extension='pdf')


def recognise(threshold):
    return str(pytesseract.image_to_string(threshold, config='--psm 6'))
