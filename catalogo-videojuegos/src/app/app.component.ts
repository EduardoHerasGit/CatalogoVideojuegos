import { Component, OnInit } from '@angular/core';
import { Game, GameFilters } from './models/game';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  // Datos y paginación
  games: Game[] = [];
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;

  // Filtros actuales
  selectedGenre = '';
  selectedPlatform = '';
  titleText = '';
  globalText = '';
  minPrice = '';
  maxPrice = '';

  // Búsqueda por id
  foundGame: Game | null = null;
  idMessage = '';

  // Estado de la carga
  errorMessage = '';

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadGames();
  }

  /** Centraliza la carga: cuerpo -> juegos, cabecera -> total. */
  loadGames(): void {
    const filters: GameFilters = {
      genre: this.selectedGenre,
      platform: this.selectedPlatform,
      titleLike: this.titleText,
      q: this.globalText,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    };

    this.gameService
      .getGamesFiltered(this.currentPage, this.pageSize, filters)
      .subscribe({
        next: response => {
          this.games = response.body ?? [];
          this.totalItems = Number(response.headers.get('X-Total-Count') ?? 0);
          // Mínimo 1 para no mostrar "Página 1 de 0" cuando no hay resultados
          this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
          this.errorMessage = '';
        },
        error: () => {
          this.errorMessage =
            'No se pudo conectar con JSON Server. ¿Has ejecutado "npm run api"?';
        }
      });
  }

  // ---------- Búsqueda por id ----------
  searchById(value: string): void {
    const id = value.trim();
    this.foundGame = null;

    if (!id) {
      this.idMessage = 'Introduce un ID.';
      return;
    }

    this.gameService.getGame(id).subscribe({
      next: game => {
        this.foundGame = game;
        this.idMessage = '';
      },
      error: () => {
        this.idMessage = `No existe ningún videojuego con ID ${id}.`;
      }
    });
  }

  // ---------- Filtros ----------
  onGenreChange(genre: string): void {
    this.selectedGenre = genre;
    this.currentPage = 1;
    this.loadGames();
  }

  onPlatformChange(platform: string): void {
    this.selectedPlatform = platform;
    this.currentPage = 1;
    this.loadGames();
  }

  onSearchTitle(text: string): void {
    this.titleText = text.trim();
    this.currentPage = 1;
    this.loadGames();
  }

  onSearchGlobal(text: string): void {
    this.globalText = text.trim();
    this.currentPage = 1;
    this.loadGames();
  }

  onApplyPrices(min: string, max: string): void {
    this.minPrice = this.validNumber(min);
    this.maxPrice = this.validNumber(max);
    this.currentPage = 1;
    this.loadGames();
  }

  clearFilters(): void {
    this.selectedGenre = '';
    this.selectedPlatform = '';
    this.titleText = '';
    this.globalText = '';
    this.minPrice = '';
    this.maxPrice = '';
    this.currentPage = 1;
    this.loadGames();
  }

  // ---------- Paginación ----------
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadGames();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadGames();
    }
  }

  /** Devuelve el texto si es un número válido, o '' en caso contrario. */
  private validNumber(value: string): string {
    const v = value.trim().replace(',', '.');
    return v !== '' && !isNaN(Number(v)) ? v : '';
  }
}
