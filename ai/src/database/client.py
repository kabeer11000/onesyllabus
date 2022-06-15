from pymongo import MongoClient


# In[10]:


client = MongoClient("mongodb://localhost:27017");
db=client.KabeersPastPapers
list(db["cat"].find({}))
