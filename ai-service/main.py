from fastapi
import FastAPI, File, UploadFile
from fastapi.middleware.cors
import CORSMiddleware
from parser
import parse_cv
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.post("/parse-cv")
async def parse_cv_endpoint(file: UploadFile = File(...)):
    with open(file.filename, "wb") as buffer:
    shutil.copyfileobj(file.file, buffer)
result = parse_cv(file.filename)
return result