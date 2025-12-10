from datetime import date
from sqlmodel import SQLModel, Field
from typing import Optional


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    password_hash: str
    created_at: Optional[str] = Field(default=None)
    profile_picture: Optional[str] = Field(default=None)


class Review(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    movie_id: int
    note_visual: int
    note_action: int
    note_scenario: int
    date_reviewed: date = Field(default_factory=date.today)
    favorite: bool = Field(default=False)


class Movie(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    director: str
    release_year: int | None
    genre: str
    poster_path: str


class Friendship(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id_1: int = Field(foreign_key="user.id")
    user_id_2: int = Field(foreign_key="user.id")
