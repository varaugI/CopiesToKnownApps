import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NetflixService, Movie, Profile } from './services/netflix.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['../styles.css']
})
export class AppComponent implements OnInit {
  movies: Movie[] = [];
  billboardMovie: Movie | null = null;
  activeModalMovie: Movie | null = null;
  activeVideoMovie: Movie | null = null;
  activeProfile: Profile | null = null;
  
  selectedTab = 'Home';
  searchQuery = '';
  searchResults: Movie[] = [];

  categories = [
    'Trending Now',
    'Sci-Fi Blockbusters',
    'Action & Thrillers',
    'Popular Movies'
  ];

  constructor(public netflixService: NetflixService) {}

  ngOnInit() {
    this.netflixService.getMovies().subscribe(res => {
      this.movies = res;
    });

    this.netflixService.getBillboard().subscribe(res => {
      this.billboardMovie = res;
    });

    this.netflixService.activeProfile$.subscribe(p => {
      this.activeProfile = p;
    });

    this.netflixService.activeModalMovie$.subscribe(m => {
      this.activeModalMovie = m;
    });

    this.netflixService.activeVideoMovie$.subscribe(m => {
      this.activeVideoMovie = m;
    });
  }

  onSearchChange() {
    if (this.searchQuery.trim()) {
      this.netflixService.searchMovies(this.searchQuery).subscribe(res => {
        this.searchResults = res;
      });
    } else {
      this.searchResults = [];
    }
  }

  getMoviesByCategory(cat: string): Movie[] {
    return this.movies.filter(m => m.categories && m.categories.includes(cat));
  }

  openModal(movie: Movie) {
    this.netflixService.openModal(movie);
  }

  closeModal() {
    this.netflixService.closeModal();
  }

  playMovie(movie: Movie) {
    this.netflixService.playMovie(movie);
  }

  closeVideo() {
    this.netflixService.closeVideo();
  }

  toggleMyList(movieId: string) {
    this.netflixService.toggleMyList(movieId);
  }

  isInMyList(movieId: string): boolean {
    return this.netflixService.isInMyList(movieId);
  }
}
