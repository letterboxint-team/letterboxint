from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session
from models import User
from fastapi import HTTPException, status, Body
from sqlmodel import select
from models import Movie, Review

app = FastAPI()
engine = create_engine("sqlite:///database.db")
SQLModel.metadata.create_all(engine)


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
    password = credentials.get("password")
    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="username and password required",
        )
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if not user or getattr(user, "password", None) != password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )
        # In a real app return a token; here we return basic info for simplicity
        return {"message": "login successful", "user_id": user.id}


@app.post("/logout")
def logout():
    # Stateless placeholder: client should drop token/cookie. Keep endpoint for symmetry.
    return {"message": "logout successful"}


@app.get("/movies")
def list_movies():
    with Session(engine) as session:
        movies = session.exec(select(Movie)).all()
        return movies


@app.post("/movies", status_code=status.HTTP_201_CREATED)
def create_movie(movie: Movie):
    with Session(engine) as session:
        session.add(movie)
        session.commit()
        session.refresh(movie)
        return movie


@app.get("/movies/{movie_id}")
def read_movie(movie_id: int):
    with Session(engine) as session:
        movie = session.get(Movie, movie_id)
        if not movie:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found"
            )
        return movie


@app.post("/reviews", status_code=status.HTTP_201_CREATED)
def create_review(review: Review):
    with Session(engine) as session:
        # Optionally validate referenced user/movie exist
        if getattr(review, "user_id", None) is not None:
            user = session.get(User, review.user_id)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid user_id",
                )
        if getattr(review, "movie_id", None) is not None:
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
