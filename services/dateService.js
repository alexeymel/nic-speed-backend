/**
 * Convert Date to Y-m-d H:i:s datetime format
 * 
 * @param {Date} date 
 * @returns {string} Y-m-d H:i:s
 */
exports.dateToSimpleDatetime = (date) => {
    return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}