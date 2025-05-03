import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    
    if (!lat || !lon) {
        return NextResponse.json({ status: 400, message: 'error', error: 'Latitude and longitude are required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    console.log(latitude, longitude)
    
    if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json({ status: 400, message: 'error', error: 'Invalid latitude or longitude' });
    }

    const apiKey = process.env.OPEN_WEATHER_API_KEY;
    const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );

    const data = await weatherRes.json();

    console.log({data})

    if (!data || data.cod !== 200) {
        return NextResponse.json({ status: 500, message: 'error', error: 'Failed to fetch weather data' });
    }

    return NextResponse.json({ status: 200, data });
}
