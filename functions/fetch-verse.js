// functions/fetch-verse.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // Initialize Supabase client with environment variables
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  // Get query parameters from the request (e.g., ?type=daily&day=5)
  const { type, day } = event.queryStringParameters || {};
  
  // Default to "daily" if no type is provided
  const verseType = type ? type.toLowerCase() : 'daily';

  try {
    let data;
    let error;

    // Handle different verse types
    switch (verseType) {
      case 'daily':
        // Fetch the daily verse (special = "daily")
        ({ data, error } = await supabase
          .from('verses')
          .select('*')
          .eq('special', 'daily')
          .single());
        break;

      case 'odd-even':
        // Determine odd or even based on the day parameter
        if (!day) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Day parameter is required for odd-even verse' }),
          };
        }
        const dayNumber = parseInt(day);
        const specialValue = dayNumber % 2 === 0 ? 'even' : 'odd';
        ({ data, error } = await supabase
          .from('verses')
          .select('*')
          .eq('special', specialValue)
          .single());
        break;

      case 'day-of-week':
        // Determine day of week based on the day parameter or current date
        const date = day ? new Date(day) : new Date();
        const dayOfWeekMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const dayOfWeek = dayOfWeekMap[date.getDay()];
        ({ data, error } = await supabase
          .from('verses')
          .select('*')
          .eq('special', dayOfWeek)
          .single());
        break;

      case 'day-of-month':
        // Fetch all verses for the day of the month
        if (!day) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Day parameter is required for day-of-month verse' }),
          };
        }
        ({ data, error } = await supabase
          .from('verses')
          .select('*')
          .eq('day_month', day));
        // Sort by special field (like in your original code)
        if (data && data.length > 0) {
          data.sort((a, b) => parseInt(a.special) - parseInt(b.special));
        }
        break;

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid verse type. Use daily, odd-even, day-of-week, or day-of-month' }),
        };
    }

    // Handle errors or no data
    if (error || (!data && verseType !== 'day-of-month') || (verseType === 'day-of-month' && (!data || data.length === 0))) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error?.message || `No ${verseType} verse available` }),
      };
    }

    // Return the data
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error: ' + err.message }),
    };
  }
};