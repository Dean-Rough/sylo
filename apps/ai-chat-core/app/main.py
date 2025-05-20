from fastapi import FastAPI

app = FastAPI(title="AI Chat Core Service")

@app.get("/")
async def read_root():
    return {"message": "Welcome to the AI Chat Core Service!"}