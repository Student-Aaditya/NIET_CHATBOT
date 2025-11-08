from pymongo import MongoClient

def get_database():
    client = MongoClient("mongodb://localhost:27017/")  # or your Atlas URI
    db = client["niet_db"]
    return db
