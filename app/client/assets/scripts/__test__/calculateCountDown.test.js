const { calculateDeparture } = require('../dataHandlers');

const dayInMileseconds = 1000*60*60*24;
const TenDaysInMiliseconds = dayInMileseconds * 10;
const today = new Date().getTime();
const departureDate = today + TenDaysInMiliseconds;

test('test calculation of departuredate countDown', () => {
    expect(calculateDeparture(departureDate, today)).toBe(10);
})