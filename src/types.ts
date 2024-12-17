export interface Star {
    id: number;
    top: string;
    left: string;
    scale: number;
    duration: string;
    delay: string;
}

export interface MobileMenuProps {
    isOpen: boolean;
    toggleMenuAction: () => void;
}

export type ShowingWithMovie = {
    showing: ShowingDetails;
    movie: MovieDetails;
};

export type ShowingsResponse = {
    movies: ShowingWithMovie[];
};

export type StarringCast = {
    cast: string[];
};

export type TicketDetails = {
    id: string;
    showing_id: string;
    user_id: string;
    purchase_timestamp: string;
};

export type ShowingDetails = {
    id: string;
    movie_id: string;
    start_time: string;
    location: string;
    spaces_available: number;
    is_active: boolean;
};

export type MovieDetails = {
    id: string;
    name: string;
    description: string;
    duration: number;
    genre: string;
    starring: StarringCast;
    image: string;
    video: string;
    price: number;
};

export type TicketWithShowingAndMovie = {
    ticket: TicketDetails;
    showing: ShowingDetails;
    movie: MovieDetails;
};

export type TicketsResponse = {
    tickets: TicketWithShowingAndMovie[];
};

export type TicketResponse = {
    ticket: TicketWithShowingAndMovie[];
};

export type LoyaltyPoints = {
    id: string;
    user_id: string;
    total_points: number;
    tier_progress_percentage: number;
    tier_name: string;
    next_tier_points: number;
};

export type LoyaltyPointsResponse = {
    loyaltyPoints: LoyaltyPoints[];
};

export type MoviesResponse = {
    movies: MovieDetails[];
};