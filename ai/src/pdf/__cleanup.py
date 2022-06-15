#!/usr/bin/env python
# coding: utf-8


# In[51]:


import requests, pdf2image
dirty_pdf = "https://docs.kabeercloud.tk/c/synced/628d4ff6677e9---Past%20Paper%202019%20Federal%20Board%20HSSC%20Inter%20Part%20II%20Physics%20Objective%20English%20Medium.pdf"
clean_pdf = "https://docs.kabeercloud.tk/p/v/60ae952811083.pdf"
pdf = requests.get(clean_pdf, stream=True)
# pdf.raw.read()
images = pdf2image.convert_from_bytes(pdf.raw.read())


# In[52]:


import cv2
import pytesseract
import numpy
from matplotlib import pyplot as plt


# In[53]:


def PIL2OpenCV (pil_image):
    open_cv_image = numpy.array(pil_image)
    # Convert RGB to BGR
#     return open_cv_image[:, :, ::-1].copy()
    return cv2.cvtColor(numpy.array(pil_image), cv2.COLOR_RGB2BGR)


# In[26]:


cv2.destroyAllWindows()


# In[54]:


image_encoded = PIL2OpenCV(images[0])
# cv2.imshow("Images[0]", image_encoded)

# waits for user to press any key
# (this is necessary to avoid Python kernel form crashing)
# cv2.waitKey(0)

# closing all open windows
# cv2.destroyAllWindows()


# In[55]:


kernel = numpy.ones((1, 1), numpy.uint8)
image_encoded = cv2.dilate(image_encoded, kernel, iterations=1)
image_encoded = cv2.erode(image_encoded, kernel, iterations=1)

re, thresh1 = cv2.threshold(image_encoded, 120, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C)
# thresh1

plt.rcParams['figure.dpi'] = 300
plt.imshow(thresh1,'gray', interpolation='nearest', aspect='auto')
plt.show()
# plt.title(titles[i])
# plt.xticks([]),plt.yticks([])


# In[56]:


img = image_encoded

# img = cv2.threshold(cv2.GaussianBlur(img, (5, 5), 0), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

# img = cv2.threshold(cv2.bilateralFilter(img, 5, 75, 75), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

# img = cv2.threshold(cv2.medianBlur(img, 3), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

# img = cv2.adaptiveThreshold(cv2.GaussianBlur(img, (5, 5), 0), 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2)

# img = cv2.adaptiveThreshold(cv2.bilateralFilter(img, 9, 75, 75), 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2)

# img = cv2.adaptiveThreshold(cv2.medianBlur(img, 3), 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2)


# In[57]:


plt.rcParams['figure.dpi'] = 300
plt.imshow(img,'gray', interpolation='nearest', aspect='auto')
plt.show()


# In[ ]:





# In[ ]:





# In[ ]:


print("a")


# In[58]:


# image_encoded = PIL2OpenCV(images[0])
# convert the image to black and white for better OCR
ret,th_ = cv2.threshold(image_encoded, 120, 255, cv2.THRESH_BINARY)
ret,th_ = cv2.threshold(th_, 120, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C)
# img
plt.rcParams['figure.dpi'] = 300
plt.imshow(th_, interpolation='nearest', aspect='auto')
plt.show()
# pytesseract image to string to get results
text = str(pytesseract.image_to_string(th_, config='--psm 6'))
print(text)


# In[ ]:




