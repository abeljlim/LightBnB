SELECT city, COUNT(reservations.*) AS total_reservations
FROM properties
LEFT JOIN reservations ON properties.id = property_id
GROUP BY city
ORDER BY total_reservations DESC;