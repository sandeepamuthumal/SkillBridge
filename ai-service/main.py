from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from services.cv_parser import parse_cv
import shutil
import os
import uuid

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/parse-cv")
async def parse_cv_file(file: UploadFile = File(...)):
    file_ext = file.filename.split('.')[-1]
    temp_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, temp_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        data = parse_cv(file_path)
        os.remove(file_path)
        return JSONResponse(content=data)
    except Exception as e:
        os.remove(file_path)
        return JSONResponse(content={"error": str(e)}, status_code=500)
