import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const url = searchParams.get('url');
    if (!url) {
        return NextResponse.json({ status: 400, error: 'Missing URL parameter'})
    }

    try {
        const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Example: extract all the text from <h1> tags
        const data = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('h1')).map(el => el.innerText);
        });

        await browser.close();
        return NextResponse.json({ status: 200, data })
    } catch (error) {
        console.error('Scraping failed:', error);
        return NextResponse.json({ status: 500, error })
    }
}