// Centralized theme type definitions
export interface ThemeColors {
    colorful: string;
    contrasty: string;
}

export interface Theme {
    id: string;
    name: string;
    description: string;
    colors: ThemeColors;
    // Backwards compatibility getters
    colorful: string;
    contrasty: string;
}

export interface ThemeData {
    themes: Theme[];
}