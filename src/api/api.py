from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session
from models import User
from fastapi import HTTPException, status, Body
from sqlmodel import select
from models import Movie, Review
import os
from dotenv import load_dotenv
from PyJWT import encode
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from imdb_interface import add_movie, search_movie_by_title, MovieSearchResult

origins = ["*"]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
engine = create_engine("sqlite:///database.db")
SQLModel.metadata.create_all(engine)
load_dotenv()
secret_key = os.getenv("SECRET_KEY", "EDIT_THE_DOT_ENV_IN_PRODUCTION_OR_GET_FIRED")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/users/{user_id}")
def read_user(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        return user


@app.get("/users")
def list_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        return users


@app.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: User):
    with Session(engine) as session:
        existing = session.exec(
            select(User).where(User.username == user.username)
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists",
            )
        session.add(user)
        session.commit()
        session.refresh(user)
        return user


@app.post("/login")
def login(credentials: dict = Body(...)):
    username = credentials.get("username")
    password_hash = credentials.get("password_hash")
    if not username or not password_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="username and password required",
        )
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if not user or user.password_hash != password_hash:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )
        token = encode({"user_id": user.id}, secret_key, algorithm="HS256")
        return {"access_token": token, "token_type": "bearer"}


@app.post("/logout")
def logout():
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie(key="access_token")
    return response


@app.get("/movies")
def list_movies():
    with Session(engine) as session:
        movies = session.exec(select(Movie)).all()
        return movies


@app.get("/movies/search/")
def search_movies(title: str) -> list[MovieSearchResult]:
    results = search_movie_by_title(title)
    return results


@app.get("/movies/{movie_id}")
def read_movie(movie_id: int):
    with Session(engine) as session:
        movie = session.get(Movie, movie_id)
        if not movie:
            add_movie(movie_id)
            movie = session.get(Movie, movie_id)
        return movie


@app.post("/reviews", status_code=status.HTTP_201_CREATED)
def create_review(review: Review):
    with Session(engine) as session:
        # Optionally validate referenced user/movie exist
        if review.user_id is not None:
            user = session.get(User, review.user_id)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid user_id",
                )
        if review.movie_id is not None:
            movie = session.get(Movie, review.movie_id)
            if not movie:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid movie_id",
                )
        session.add(review)
        session.commit()
        session.refresh(review)
        return review


@app.get("/reviews")
def list_reviews():
    with Session(engine) as session:
        reviews = session.exec(select(Review)).all()
        return reviews


@app.get("/reviews/{movie_id}")
def reviews_by_movie(movie_id: int):
    with Session(engine) as session:
        movie = session.get(Movie, movie_id)
        if not movie:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found"
            )
        reviews = session.exec(select(Review).where(Review.movie_id == movie_id)).all()
        return reviews


@app.get("/users/{user_id}/reviews")
def reviews_by_user(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        reviews = session.exec(select(Review).where(Review.user_id == user_id)).all()
        return reviews
