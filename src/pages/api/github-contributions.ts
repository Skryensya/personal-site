import type { APIRoute } from 'astro';
import * as cheerio from 'cheerio';

export interface ContributionDay {
    date: string;
    count: number;
    level: string;
}

export const GET: APIRoute = async ({ url }) => {
    const username = url.searchParams.get('username') || 'skryensya';

    try {
        // console.log(`🔍 Server-side fetching contributions for ${username}...`);

        const githubUrl = `https://github.com/users/${username}/contributions`;
        const res = await fetch(githubUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch contributions for ${username}: ${res.status}`);
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        // console.log(`📄 HTML length: ${html.length} characters`);

        const days: ContributionDay[] = [];

        // Extract contribution data from table cells
        $('td[data-date][data-level]').each((_, element) => {
            const $cell = $(element);
            const date = $cell.attr('data-date');
            const level = $cell.attr('data-level') || '0';

            // Find the associated tooltip to get the count
            const cellId = $cell.attr('id');
            const $tooltip = $(`tool-tip[for="${cellId}"]`);
            let count = 0;

            if ($tooltip.length > 0) {
                const tooltipText = $tooltip.text();
                // Parse tooltip text like "No contributions on July 21st." or "1 contribution on July 22nd."
                const match = tooltipText.match(/(\d+)\s+contribution/);
                if (match) {
                    count = parseInt(match[1], 10);
                }
            }

            if (date) {
                days.push({ date, count, level });
            }
        });

        // console.log(`📊 Found ${days.length} contribution days`);
        // console.log(`🎯 Sample data:`, days.slice(0, 5));

        return new Response(
            JSON.stringify({
                success: true,
                username,
                totalDays: days.length,
                contributions: days
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
                }
            }
        );
    } catch (error) {
        // Error will be handled by returning error response

        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};
