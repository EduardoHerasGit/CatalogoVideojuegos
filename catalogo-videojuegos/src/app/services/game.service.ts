import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Game, GameFilters } from '../models/game';

@Injectable({ providedIn: 'root' })
export class GameService {
  private apiUrl = 'http://localhost:3000/games';

  constructor(private http: HttpClient) {}

  /** GET /games */
  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl);
  }

  /** GET /games/5 */
  getGame(id: number | string): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${id}`);
  }

  /** GET /games?genre=RPG */
  getGamesByGenre(genre: string): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl, { params: new HttpParams().set('genre', genre) });
  }

  /** GET /games?platform=PC */
  getGamesByPlatform(platform: string): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl, { params: new HttpParams().set('platform', platform) });
  }

  /** GET /games?title_like=texto  (búsqueda parcial por título) */
  searchGames(text: string): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl, { params: new HttpParams().set('title_like', text) });
  }

  /** GET /games?q=texto  (búsqueda global en todos los campos) */
  searchGlobal(text: string): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl, { params: new HttpParams().set('q', text) });
  }

  /** GET /games?price_gte=20&price_lte=30 */
  getGamesByPrice(min: number, max: number): Observable<Game[]> {
    const params = new HttpParams().set('price_gte', min).set('price_lte', max);
    return this.http.get<Game[]>(this.apiUrl, { params });
  }

  /** GET /games?_page=2&_limit=5  (respuesta completa para poder leer cabeceras) */
  getGamesPage(page: number, limit: number): Observable<HttpResponse<Game[]>> {
    const params = new HttpParams().set('_page', page).set('_limit', limit);
    return this.http.get<Game[]>(this.apiUrl, { params, observe: 'response' });
  }

  /**
   * Método integrado: filtros + paginación.
   * Ej.: GET /games?genre=RPG&platform=PC&_page=1&_limit=5
   * Solo se añaden los parámetros que tienen valor.
   */
  getGamesFiltered(
    page: number,
    limit: number,
    filters: GameFilters
  ): Observable<HttpResponse<Game[]>> {
    let params = new HttpParams().set('_page', page).set('_limit', limit);

    if (filters.genre) { params = params.set('genre', filters.genre); }
    if (filters.platform) { params = params.set('platform', filters.platform); }
    if (filters.titleLike) { params = params.set('title_like', filters.titleLike); }
    if (filters.q) { params = params.set('q', filters.q); }
    if (filters.minPrice !== '') { params = params.set('price_gte', filters.minPrice); }
    if (filters.maxPrice !== '') { params = params.set('price_lte', filters.maxPrice); }

    return this.http.get<Game[]>(this.apiUrl, { params, observe: 'response' });
  }
}
