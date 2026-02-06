export interface LoginResponse {
    token: string;
}

export interface User {
    id: string;
    username: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    full_description: string;
    date: string;
    location: string;
    image_url: string;
    owner_id: string;
    participants: string[];
}