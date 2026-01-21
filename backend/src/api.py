try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session
from models import User
from fastapi import HTTPException, status, Body
from sqlmodel import select
from models import Movie, Review, UIMovie, Friendship, WatchedMovie, FavoriteMovie
import os
import jwt
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from imdb.imdb_interface import add_movie, search_movie_by_title, MovieSearchResult
from pathlib import Path

origins = ["*"]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not Path("data").exists():
    Path("data").mkdir()

engine = create_engine("sqlite:///data/database.db")
SQLModel.metadata.create_all(engine)
secret_key = os.getenv("SECRET_KEY", "EDIT_THE_DOT_ENV_IN_PRODUCTION_OR_GET_FIRED")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/users/{user_id}")
def read_user(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user


@app.patch("/users/{user_id}")
def update_user(user_id: int, payload: dict = Body(...)):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        username = payload.get("username")
        if username:
            # Check uniqueness
            existing = session.exec(select(User).where(User.username == username)).first()
            if existing and existing.id != user_id:
                raise HTTPException(status_code=400, detail="Username already exists")
            user.username = username
        
        session.add(user)
        session.commit()
        session.refresh(user)
        return user


@app.get("/users")
def list_users():
    with Session(engine) as session:
        statement = select(User.id, User.username, User.created_at, User.profile_picture)
        users = session.exec(statement).all()
        # Convert rows to dicts
        return [
            {
                "id": u.id, 
                "username": u.username
            } 
            for u in users
        ]


from datetime import date


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

        # Set creation date
        user.created_at = str(date.today())
        
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
        token = jwt.encode({"user_id": user.id}, secret_key, algorithm="HS256")
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
        return [UIMovie(**movie.model_dump()) for movie in movies]


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
def create_review(payload: dict = Body(...)):
    # Payload manual extraction because 'favorite' is not in model anymore
    # but frontend sends it.
    
    review_data = {k: v for k, v in payload.items() if k != "favorite"}
    is_favorite = payload.get("favorite", False)
    
    review = Review(**review_data)

    with Session(engine) as session:
        # Optionally validate referenced user/movie exist
        if review.user_id is not None:
            user = session.get(User, review.user_id)
            if not user:
                raise HTTPException(status_code=400, detail="Invalid user_id")
        if review.movie_id is not None:
            movie = session.get(Movie, review.movie_id)
            if not movie:
                raise HTTPException(status_code=400, detail="Invalid movie_id")
                
        session.add(review)
        
        # AUTO-WATCHED LOGIC
        # Check if already watched
        watched = session.exec(select(WatchedMovie).where(
            WatchedMovie.user_id == review.user_id,
            WatchedMovie.movie_id == review.movie_id
        )).first()
        
        if not watched:
            new_watched = WatchedMovie(user_id=review.user_id, movie_id=review.movie_id)
            session.add(new_watched)
            
        # FAVORITE LOGIC
        if is_favorite:
             fav = session.exec(select(FavoriteMovie).where(
                FavoriteMovie.user_id == review.user_id,
                FavoriteMovie.movie_id == review.movie_id
             )).first()
             if not fav:
                 new_fav = FavoriteMovie(user_id=review.user_id, movie_id=review.movie_id)
                 session.add(new_fav)
        
        session.commit()
        session.refresh(review)

        # Update global rating
        reviews = session.exec(select(Review).where(Review.movie_id == review.movie_id)).all()
        if reviews:
             total_score = 0
             count = 0
             for r in reviews:
                 avg_review = (r.note_visual + r.note_action + r.note_scenario) / 3.0
                 total_score += avg_review
                 count += 1
             
             new_global_rating = total_score / count if count > 0 else None
             movie.global_rating = new_global_rating
             session.add(movie)
             session.commit()

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


from sqlmodel import or_

@app.post("/friends")
def add_friend(payload: dict = Body(...)):
    user_id = payload.get("user_id")
    friend_id = payload.get("friend_id")
    
    if not user_id or not friend_id:
        raise HTTPException(status_code=400, detail="user_id and friend_id required")
        
    with Session(engine) as session:
        # Check if friendship already exists in either direction
        existing = session.exec(select(Friendship).where(
            or_(
                (Friendship.user_id == user_id) & (Friendship.friend_id == friend_id),
                (Friendship.user_id == friend_id) & (Friendship.friend_id == user_id)
            )
        )).first()
        
        if existing:
            return {"message": "Already friends"}
            
        friendship = Friendship(user_id=user_id, friend_id=friend_id)
        session.add(friendship)
        session.commit()
        return {"message": "Friend added"}


@app.get("/users/{user_id}/friends")
def list_friends(user_id: int):
    with Session(engine) as session:
        # Get all friendships where user is involved
        friendships = session.exec(select(Friendship).where(
            or_(Friendship.user_id == user_id, Friendship.friend_id == user_id)
        )).all()
        
        # Get friend IDs
        friend_ids = []
        for f in friendships:
            if f.user_id == user_id:
                friend_ids.append(f.friend_id)
            else:
                friend_ids.append(f.user_id)
        
        # Get user details for these friends
        if not friend_ids:
            return []
            
        friends = session.exec(select(User).where(User.id.in_(friend_ids))).all()
        return friends


# --- WATCHED & FAVORITES ---

@app.post("/users/{user_id}/watched")
def mark_movie_watched(user_id: int, payload: dict = Body(...)):
    movie_id = payload.get("movie_id")
    if not movie_id:
        raise HTTPException(status_code=400, detail="movie_id required")
        
    with Session(engine) as session:
        existing = session.exec(select(WatchedMovie).where(
            WatchedMovie.user_id == user_id,
            WatchedMovie.movie_id == movie_id
        )).first()
        
        if existing:
            return {"message": "Already watched"}
            
        watched = WatchedMovie(user_id=user_id, movie_id=movie_id)
        session.add(watched)
        session.commit()
        return {"message": "Marked as watched"}


@app.delete("/users/{user_id}/watched/{movie_id}")
def unmark_movie_watched(user_id: int, movie_id: int):
    with Session(engine) as session:
        watched = session.exec(select(WatchedMovie).where(
            WatchedMovie.user_id == user_id,
            WatchedMovie.movie_id == movie_id
        )).first()
        
        if watched:
            session.delete(watched)
            session.commit()
            return {"message": "Removed from watched"}
        return {"message": "Not found"}


@app.get("/users/{user_id}/watched")
def get_watched_movies(user_id: int):
    with Session(engine) as session:
        watched = session.exec(select(WatchedMovie).where(WatchedMovie.user_id == user_id)).all()
        return watched


@app.post("/users/{user_id}/favorites")
def mark_movie_favorite(user_id: int, payload: dict = Body(...)):
    movie_id = payload.get("movie_id")
    if not movie_id:
        raise HTTPException(status_code=400, detail="movie_id required")
        
    with Session(engine) as session:
        existing = session.exec(select(FavoriteMovie).where(
            FavoriteMovie.user_id == user_id,
            FavoriteMovie.movie_id == movie_id
        )).first()
        
        if existing:
            return {"message": "Already favorite"}
            
        favorite = FavoriteMovie(user_id=user_id, movie_id=movie_id)
        session.add(favorite)
        session.commit()
        return {"message": "Added to favorites"}


@app.delete("/users/{user_id}/favorites/{movie_id}")
def unmark_movie_favorite(user_id: int, movie_id: int):
    with Session(engine) as session:
        favorite = session.exec(select(FavoriteMovie).where(
            FavoriteMovie.user_id == user_id,
            FavoriteMovie.movie_id == movie_id
        )).first()
        
        if favorite:
            session.delete(favorite)
            session.commit()
            return {"message": "Removed from favorites"}
        return {"message": "Not found"}


@app.get("/users/{user_id}/favorites")
def get_favorite_movies(user_id: int):
    with Session(engine) as session:
        favorites = session.exec(select(FavoriteMovie).where(FavoriteMovie.user_id == user_id)).all()
        return favorites
