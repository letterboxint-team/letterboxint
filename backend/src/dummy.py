from models import Movie, User, Review, Friendship
from sqlmodel import Session, create_engine, SQLModel

engine = create_engine("sqlite:///database.db")
SQLModel.metadata.create_all(engine)

dummy_movies = [
    Movie(
        id=1,
        title="Inception",
        director="Christopher Nolan",
        release_year=2010,
        genre="Sci-Fi",
        poster_path="",
    ),
    Movie(
        id=2,
        title="The Godfather",
        director="Francis Ford Coppola",
        release_year=1972,
        genre="Crime",
        poster_path="",
    ),
    Movie(
        id=3,
        title="Pulp Fiction",
        director="Quentin Tarantino",
        release_year=1994,
        genre="Crime",
        poster_path="",
    ),
]
dummy_users = [
    User(
        id=1,
        username="john_doe",
        password_hash="hashed_password_1",
        created_at="2023-01-01",
        profile_picture=None,
    ),
    User(
        id=2,
        username="jane_smith",
        password_hash="hashed_password_2",
        created_at="2023-02-01",
        profile_picture=None,
    ),
]
dummy_reviews = [
    Review(id=1, user_id=1, movie_id=1, note_visual=9, note_action=8, note_scenario=9),
    Review(
        id=2,
        user_id=2,
        movie_id=2,
        note_visual=10,
        note_action=9,
        note_scenario=10,
        favorite=True,
    ),
]
dummy_friendships = [
    Friendship(id=1, user_id_1=1, user_id_2=2),
]


def add_dummy_data(engine):
    with Session(engine) as session:
        # for movie in dummy_movies:
        #     session.add(movie)
        for user in dummy_users:
            session.add(user)
        for review in dummy_reviews:
            session.add(review)
        for friendship in dummy_friendships:
            session.add(friendship)
        session.commit()


add_dummy_data(engine)
