export interface Game {
  id: number;
  title: string;
  genre: string;
  platform: string;
  price: number;
}

/** Filtros que se pueden combinar en una misma consulta. */
export interface GameFilters {
  genre: string;
  platform: string;
  titleLike: string;   // title_like
  q: string;           // búsqueda global
  minPrice: string;    // price_gte
  maxPrice: string;    // price_lte
}
