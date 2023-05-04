SELECT reservations.id, title, start_date, cost_per_night, AVG(rating) AS average_rating
FROM users
LEFT JOIN reservations ON users.id = guest_id
JOIN properties ON properties.id = property_id
LEFT JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE users.id = 1
GROUP BY reservations.id, title, cost_per_night
ORDER BY start_date
LIMIT 10;