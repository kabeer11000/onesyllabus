import os
from .globals import local_model_path
from sentence_transformers import SentenceTransformer  # , CrossEncoder, util
from annoy import AnnoyIndex

vector_length = 384
if len(os.listdir(local_model_path)) == 0:
    bi_encoder = SentenceTransformer("multi-qa-MiniLM-L6-cos-v1")
    bi_encoder.save(local_model_path)
else:
    bi_encoder = SentenceTransformer(local_model_path)


def init_index(saved=None):
    # No need to build
    print(saved)
    ann = AnnoyIndex(vector_length, 'angular')
    if saved: ann.load(saved)
    return ann


def encode(documents):
    return bi_encoder.encode([document['text'].replace('\\n', '\n') for document in documents], convert_to_tensor=True)


def encode_one(document):
    return bi_encoder.encode(document['text'].replace('\\n', '\n'), convert_to_tensor=True)


def create_index(ann, idmap, encoded_documents):
    for i, doc in enumerate(encoded_documents):
        ann.add_item(i, doc)  # idmap.get(doc['id'])
    ann.build(30)  # 10 trees
    return ann


def find(ann, query: str, neighbors: int):
    query_embedding = bi_encoder.encode(query, convert_to_tensor=True)
    indices = ann.get_nns_by_vector(query_embedding, neighbors | 10,
                                    include_distances=True)  # will find the 1000 nearest neighbors
    return indices
