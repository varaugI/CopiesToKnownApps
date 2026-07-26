import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Movie {
  id: string;
  title: string;
  type: string;
  seasons?: string;
  matchScore: number;
  releaseYear: number;
  ageRating: string;
  resolution: string;
  duration: string;
  overview: string;
  poster: string;
  backdrop: string;
  trailerUrl: string;
  videoUrl: string;
  categories: string[];
  topRank?: number;
  genres: string[];
  cast: string[];
  director: string;
  tags?: string[];
  episodes?: any[];
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isKids: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NetflixService {
  private apiUrl = 'http://localhost:5000/api';

  private activeProfileSubject = new BehaviorSubject<Profile>({
    id: 'p1',
    name: 'Gaurav',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    color: '#E50914',
    isKids: false
  });
  activeProfile$ = this.activeProfileSubject.asObservable();

  private activeModalMovieSubject = new BehaviorSubject<Movie | null>(null);
  activeModalMovie$ = this.activeModalMovieSubject.asObservable();

  private activeVideoMovieSubject = new BehaviorSubject<Movie | null>(null);
  activeVideoMovie$ = this.activeVideoMovieSubject.asObservable();

  private myListSubject = new BehaviorSubject<string[]>(['m1', 'm3']);
  myList$ = this.myListSubject.asObservable();

  // Fallback local data if backend server is not running
  private fallbackMovies: Movie[] = [
    {
      id: 'm1',
      title: 'Cyber Chronicles: 2099',
      type: 'Series',
      seasons: '3 Seasons',
      matchScore: 98,
      releaseYear: 2024,
      ageRating: '18+',
      resolution: '4K Ultra HD',
      duration: '45m per ep',
      overview: 'In a dystopian mega-city ruled by ruthless AI syndicates, a rogue netrunner discovers a secret neural artifact that could rewrite human consciousness forever.',
      poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      categories: ['Trending Now', 'Sci-Fi Blockbusters', 'Top 10 Today'],
      topRank: 1,
      genres: ['Sci-Fi', 'Cyberpunk', 'Action'],
      cast: ['Elena Rostova', 'Marcus Vance'],
      director: 'Denis Villeneuve'
    },
    {
      id: 'm2',
      title: 'The Eclipse Protocol',
      type: 'Movie',
      matchScore: 96,
      releaseYear: 2025,
      ageRating: '16+',
      resolution: 'HDR10+',
      duration: '2h 18m',
      overview: 'When a solar observatory detects an artificial shadow enveloping Jupiter, a team of elite astronauts embarks on a silent reconnaissance mission.',
      poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      categories: ['Trending Now', 'Sci-Fi Blockbusters'],
      genres: ['Space Sci-Fi', 'Suspense'],
      cast: ['Sarah Jenkins', 'David Oyelowo'],
      director: 'Christopher Nolan'
    }
  ];

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies`).pipe(
      catchError(() => of(this.fallbackMovies))
    );
  }

  getBillboard(): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/billboard`).pipe(
      catchError(() => of(this.fallbackMovies[0]))
    );
  }

  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.apiUrl}/profiles`).pipe(
      catchError(() => of([
        { id: 'p1', name: 'Gaurav', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', color: '#E50914', isKids: false },
        { id: 'p2', name: 'Cinema Buff', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80', color: '#0071EB', isKids: false }
      ]))
    );
  }

  searchMovies(query: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`).pipe(
      catchError(() => of(this.fallbackMovies.filter(m => m.title.toLowerCase().includes(query.toLowerCase()))))
    );
  }

  setProfile(profile: Profile) {
    this.activeProfileSubject.next(profile);
  }

  openModal(movie: Movie) {
    this.activeModalMovieSubject.next(movie);
  }

  closeModal() {
    this.activeModalMovieSubject.next(null);
  }

  playMovie(movie: Movie) {
    this.activeVideoMovieSubject.next(movie);
  }

  closeVideo() {
    this.activeVideoMovieSubject.next(null);
  }

  toggleMyList(movieId: string) {
    const list = this.myListSubject.value;
    const updated = list.includes(movieId)
      ? list.filter(id => id !== movieId)
      : [...list, movieId];
    this.myListSubject.next(updated);
  }

  isInMyList(movieId: string): boolean {
    return this.myListSubject.value.includes(movieId);
  }
}
