import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
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
  private apiUrl = (typeof window !== 'undefined' && (window as any).__env?.apiUrl) || 'http://localhost:5000/api';

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

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies`).pipe(
      catchError((err) => {
        console.error('Angular NetflixService getMovies error:', err);
        return throwError(() => new Error('Backend catalog service unavailable'));
      })
    );
  }

  getBillboard(): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/billboard`).pipe(
      catchError((err) => {
        console.error('Angular NetflixService getBillboard error:', err);
        return throwError(() => new Error('Billboard service unavailable'));
      })
    );
  }

  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.apiUrl}/profiles`).pipe(
      catchError((err) => {
        console.error('Angular NetflixService getProfiles error:', err);
        return throwError(() => new Error('Profiles service unavailable'));
      })
    );
  }

  searchMovies(query: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`).pipe(
      catchError((err) => {
        console.error('Angular NetflixService search error:', err);
        return throwError(() => new Error('Search service unavailable'));
      })
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
