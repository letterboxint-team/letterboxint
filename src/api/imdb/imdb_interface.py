from __future__ import annotations

from pydantic import BaseModel
import os
from sqlmodel import Session, create_engine
from models import Movie
import tmdbsimple as tmdb


try:
    API_KEY = os.environ["TMDB_API_KEY"]
except KeyError:
    raise SystemExit("Missing TMDB_API_KEY environ variable")

tmdb.API_KEY = API_KEY


engine = create_engine("sqlite:///database.db")


def add_movie(movie_id: int):
    movie_data = tmdb.Movies(movie_id).info()
    movie = Movie(
        id=movie_data["id"],
        title=movie_data["title"],
        director=", ".join(
            [
                crew["name"]
                for crew in tmdb.Movies(movie_id).credits()["crew"]
                if crew["job"] == "Director"
            ]
        ),
        release_year=int(movie_data["release_date"].split("-")[0])
        if movie_data.get("release_date")
        else None,
        genre=", ".join([genre["name"] for genre in movie_data.get("genres", [])]),
        poster_path=movie_data.get("poster_path", ""),
    )
    with Session(engine) as session:
        session.add(movie)
        session.commit()


def search_movie_by_title(title: str) -> list[MovieSearchResult]:
    search = tmdb.Search()
    data = search.movie(query=title)
    list_films = []
    for result in data.results:
        list_films.append(
            MovieSearchResult(
                title=result["title"],
                poster_path=result["poster_path"],
                release_date=result["release_date"],
                id=result["id"],
            )
        )
    return list_films


class MovieSearchResult(BaseModel):
    title: str
    poster_path: str
    release_date: str
    id: int
