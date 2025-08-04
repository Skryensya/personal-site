import { type Locale, defaultLocale } from '@/utils/i18n';
import * as textFunctions from './text-functions';

// Universal text getter that works on both server and client
export class UniversalText {
    private locale: Locale;

    constructor(locale: Locale = defaultLocale) {
        this.locale = locale;
    }

    // Update locale
    setLocale(locale: Locale) {
        this.locale = locale;
    }

    getLocale(): Locale {
        return this.locale;
    }

    // Navigation methods
    navHome() { return textFunctions.getNavHome(this.locale); }
    navProjects() { return textFunctions.getNavProjects(this.locale); }
    navBlog() { return textFunctions.getNavBlog(this.locale); }
    navAbout() { return textFunctions.getNavAbout(this.locale); }
    navContact() { return textFunctions.getNavContact(this.locale); }

    // Home page sections
    technologiesTitle() { return textFunctions.getTechnologiesTitle(this.locale); }
    aboutTitle() { return textFunctions.getAboutTitle(this.locale); }
    featuredProjectsTitle() { return textFunctions.getFeaturedProjectsTitle(this.locale); }

    // Bio content
    bioGreeting() { return textFunctions.getBioGreeting(this.locale); }
    bioIntro() { return textFunctions.getBioIntro(this.locale); }
    bioExperience() { return textFunctions.getBioExperience(this.locale); }

    // Badges
    badgeProblemSolver() { return textFunctions.getBadgeProblemSolver(this.locale); }
    badgeCleanCode() { return textFunctions.getBadgeCleanCode(this.locale); }
    badgeUserFocused() { return textFunctions.getBadgeUserFocused(this.locale); }

    // Call to action
    seeMoreButton() { return textFunctions.getSeeMoreButton(this.locale); }

    // Stats
    statsExperience() { return textFunctions.getStatsExperience(this.locale); }
    statsYears() { return textFunctions.getStatsYears(this.locale); }
    statsLocation() { return textFunctions.getStatsLocation(this.locale); }
    statsStatus() { return textFunctions.getStatsStatus(this.locale); }
    statsAvailable() { return textFunctions.getStatsAvailable(this.locale); }

    // Specialties
    specialtiesTitle() { return textFunctions.getSpecialtiesTitle(this.locale); }
    specialtyAccessibility() { return textFunctions.getSpecialtyAccessibility(this.locale); }
    specialtyPerformance() { return textFunctions.getSpecialtyPerformance(this.locale); }
    specialtyDeveloperExperience() { return textFunctions.getSpecialtyDeveloperExperience(this.locale); }
    specialtyUIUX() { return textFunctions.getSpecialtyUIUX(this.locale); }

    // Site metadata
    siteTitle() { return textFunctions.getSiteTitle(this.locale); }
    siteSubtitle() { return textFunctions.getSiteSubtitle(this.locale); }
    siteDescription() { return textFunctions.getSiteDescription(this.locale); }

    // UI text
    loadingText() { return textFunctions.getLoadingText(this.locale); }

    // Hero section
    heroHeading() { return textFunctions.getHeroHeading(this.locale); }
    heroDescription() { return textFunctions.getHeroDescription(this.locale); }
    heroProjectsButton() { return textFunctions.getHeroProjectsButton(this.locale); }
}

// Factory function for quick access
export function createText(locale: Locale = defaultLocale): UniversalText {
    return new UniversalText(locale);
}

// Static helper functions for direct use
export const getText = {
    navHome: textFunctions.getNavHome,
    navProjects: textFunctions.getNavProjects,
    navBlog: textFunctions.getNavBlog,
    navAbout: textFunctions.getNavAbout,
    navContact: textFunctions.getNavContact,
    
    technologiesTitle: textFunctions.getTechnologiesTitle,
    aboutTitle: textFunctions.getAboutTitle,
    featuredProjectsTitle: textFunctions.getFeaturedProjectsTitle,
    
    bioGreeting: textFunctions.getBioGreeting,
    bioIntro: textFunctions.getBioIntro,
    bioExperience: textFunctions.getBioExperience,
    
    badgeProblemSolver: textFunctions.getBadgeProblemSolver,
    badgeCleanCode: textFunctions.getBadgeCleanCode,
    badgeUserFocused: textFunctions.getBadgeUserFocused,
    
    seeMoreButton: textFunctions.getSeeMoreButton,
    
    statsExperience: textFunctions.getStatsExperience,
    statsYears: textFunctions.getStatsYears,
    statsLocation: textFunctions.getStatsLocation,
    statsStatus: textFunctions.getStatsStatus,
    statsAvailable: textFunctions.getStatsAvailable,
    
    specialtiesTitle: textFunctions.getSpecialtiesTitle,
    specialtyAccessibility: textFunctions.getSpecialtyAccessibility,
    specialtyPerformance: textFunctions.getSpecialtyPerformance,
    specialtyDeveloperExperience: textFunctions.getSpecialtyDeveloperExperience,
    specialtyUIUX: textFunctions.getSpecialtyUIUX,
    
    siteTitle: textFunctions.getSiteTitle,
    siteSubtitle: textFunctions.getSiteSubtitle,
    siteDescription: textFunctions.getSiteDescription,
    
    loadingText: textFunctions.getLoadingText,
    
    heroHeading: textFunctions.getHeroHeading,
    heroDescription: textFunctions.getHeroDescription,
    heroProjectsButton: textFunctions.getHeroProjectsButton,
};