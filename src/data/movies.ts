export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  poster: string;
  rating: number;
  userRating?: number;
  watched?: boolean;
  genre: string[];
  runtime: number;
  synopsis: string;
  cast: string[];
  userReview?: {
    rating: number;
    text: string;
    date: string;
    liked: boolean;
  };
}

export const movies: Movie[] = [
  {
    id: 1,
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    poster: "https://images.unsplash.com/photo-1740390133235-e82eba2c040a?w=400&h=600&fit=crop",
    rating: 4.5,
    userRating: 5,
    watched: true,
    genre: ["Crime", "Drame"],
    runtime: 154,
    synopsis: "Les vies de deux hommes de main, d'un boxeur, de la femme d'un gangster et de deux braqueurs s'entremêlent dans quatre histoires de violence et de rédemption.",
    cast: ["John Travolta", "Samuel L. Jackson", "Uma Thurman", "Bruce Willis"],
    userReview: {
      rating: 5,
      text: "Le chef-d'œuvre de Tarantino. Une structure narrative brillante, des dialogues cultes et une bande-son parfaite. Un film qui redéfinit le cinéma des années 90.",
      date: "2024-11-15",
      liked: true
    }
  },
  {
    id: 2,
    title: "Fight Club",
    year: 1999,
    director: "David Fincher",
    poster: "https://images.unsplash.com/photo-1575985977334-ca65c2d8941a?w=400&h=600&fit=crop",
    rating: 4.4,
    userRating: 5,
    watched: true,
    genre: ["Drame", "Thriller"],
    runtime: 139,
    synopsis: "Un employé de bureau insomniaque et un fabricant de savon désabusé créent un club de combat clandestin qui évolue en quelque chose de beaucoup plus grand.",
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter", "Meat Loaf"],
    userReview: {
      rating: 5,
      text: "Un film culte absolu. La critique du consumérisme, la réalisation de Fincher et le twist final font de ce film une œuvre incontournable. Viscéral et intelligent.",
      date: "2024-11-28",
      liked: true
    }
  },
  {
    id: 3,
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    poster: "https://images.unsplash.com/photo-1628432136678-43ff9be34064?w=400&h=600&fit=crop",
    rating: 4.6,
    userRating: 5,
    watched: true,
    genre: ["Crime", "Drame"],
    runtime: 175,
    synopsis: "Le patriarche vieillissant d'une dynastie du crime organisé transfère le contrôle de son empire clandestin à son fils réticent.",
    cast: ["Marlon Brando", "Al Pacino", "James Caan", "Diane Keaton"],
    userReview: {
      rating: 5,
      text: "Le film de gangsters ultime. Chaque scène est iconique, chaque ligne de dialogue est parfaite. Un chef-d'œuvre de Coppola qui définit le genre.",
      date: "2024-11-20",
      liked: true
    }
  },
  {
    id: 4,
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    poster: "https://images.unsplash.com/photo-1712515497052-0b16bbdbfb4e?w=400&h=600&fit=crop",
    rating: 4.7,
    userRating: 5,
    watched: true,
    genre: ["Drame"],
    runtime: 142,
    synopsis: "Deux hommes emprisonnés développent une amitié sur plusieurs années, trouvant réconfort et éventuelle rédemption à travers des actes de décence commune.",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler"],
  },
  {
    id: 5,
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    poster: "https://images.unsplash.com/photo-1594848421556-19ee3f85d417?w=400&h=600&fit=crop",
    rating: 4.3,
    userRating: 4.5,
    watched: true,
    genre: ["Action", "Science-Fiction", "Thriller"],
    runtime: 148,
    synopsis: "Un voleur qui s'infiltre dans les rêves des autres pour voler leurs secrets se voit offrir la chance de faire effacer son passé criminel s'il peut implanter une idée dans l'esprit d'un PDG.",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
  },
  {
    id: 6,
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    poster: "https://images.unsplash.com/photo-1600480505021-e9cfb05527f1?w=400&h=600&fit=crop",
    rating: 4.5,
    userRating: 5,
    watched: true,
    genre: ["Action", "Crime", "Drame"],
    runtime: 152,
    synopsis: "Lorsque le Joker émerge comme une menace pour Gotham, Batman doit accepter l'un des plus grands tests psychologiques et physiques pour combattre l'injustice.",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
  },
  {
    id: 7,
    title: "Interstellar",
    year: 2014,
    director: "Christopher Nolan",
    poster: "https://images.unsplash.com/photo-1681673819379-a183d9acf860?w=400&h=600&fit=crop",
    rating: 4.4,
    genre: ["Science-Fiction", "Drame", "Aventure"],
    runtime: 169,
    synopsis: "Une équipe d'explorateurs voyage à travers un trou de ver dans l'espace pour assurer la survie de l'humanité.",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
  },
  {
    id: 8,
    title: "Schindler's List",
    year: 1993,
    director: "Steven Spielberg",
    poster: "https://images.unsplash.com/photo-1574438041772-09c77dc8c1dc?w=400&h=600&fit=crop",
    rating: 4.6,
    genre: ["Biographie", "Drame", "Histoire"],
    runtime: 195,
    synopsis: "En Pologne occupée par les nazis, l'industriel Oskar Schindler devient préoccupé par sa main-d'œuvre juive après avoir été témoin de leur persécution.",
    cast: ["Liam Neeson", "Ralph Fiennes", "Ben Kingsley", "Caroline Goodall"],
  },
  {
    id: 9,
    title: "Goodfellas",
    year: 1990,
    director: "Martin Scorsese",
    poster: "https://images.unsplash.com/photo-1698086032723-77b19d2ce2f2?w=400&h=600&fit=crop",
    rating: 4.5,
    userRating: 4.5,
    watched: true,
    genre: ["Biographie", "Crime", "Drame"],
    runtime: 145,
    synopsis: "L'histoire de Henry Hill et sa vie dans la mafia, couvrant son ascension et sa chute à travers les années 1955-1980.",
    cast: ["Robert De Niro", "Ray Liotta", "Joe Pesci", "Lorraine Bracco"],
  },
  {
    id: 10,
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
    director: "Peter Jackson",
    poster: "https://images.unsplash.com/photo-1670816281973-13ddc3334b39?w=400&h=600&fit=crop",
    rating: 4.6,
    genre: ["Aventure", "Fantasy", "Drame"],
    runtime: 201,
    synopsis: "Gandalf et Aragorn mènent le Monde des Hommes contre l'armée de Sauron pour détourner son attention de Frodon et Sam qui approchent de la Montagne du Destin avec l'Anneau Unique.",
    cast: ["Elijah Wood", "Viggo Mortensen", "Ian McKellen", "Orlando Bloom"],
  },
  {
    id: 11,
    title: "Forrest Gump",
    year: 1994,
    director: "Robert Zemeckis",
    poster: "https://images.unsplash.com/photo-1733084275706-441432c4a466?w=400&h=600&fit=crop",
    rating: 4.3,
    genre: ["Drame", "Romance"],
    runtime: 142,
    synopsis: "Les présidences de Kennedy et Johnson, la guerre du Vietnam et d'autres événements historiques se déroulent du point de vue d'un homme d'Alabama avec un QI de 75.",
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise", "Sally Field"],
  },
  {
    id: 12,
    title: "The Matrix",
    year: 1999,
    director: "Lana Wachowski, Lilly Wachowski",
    poster: "https://images.unsplash.com/photo-1653613842789-29acfb850e75?w=400&h=600&fit=crop",
    rating: 4.4,
    userRating: 5,
    watched: true,
    genre: ["Action", "Science-Fiction"],
    runtime: 136,
    synopsis: "Un hacker découvre que sa réalité n'est qu'une simulation créée par des machines intelligentes et rejoint une rébellion pour combattre les oppresseurs.",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"],
  },
];

export const getUserWatchedMovies = () => movies.filter(m => m.watched);
export const getUserRatedMovies = () => movies.filter(m => m.userRating);
export const getUserReviewedMovies = () => movies.filter(m => m.userReview);
