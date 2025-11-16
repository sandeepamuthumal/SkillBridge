from sentence_transformers import SentenceTransformer

def load_model():
    # use CPU-friendly model
    return SentenceTransformer(
        "sentence-transformers/paraphrase-MiniLM-L6-v2",
        device="cpu"
    )

# Lazy-load model (prevents issues on Render)
model = None

def get_model():
    global model
    if model is None:
        model = load_model()
    return model
