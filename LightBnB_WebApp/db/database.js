const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

// the following assumes that you named your connection variable `pool`
/* pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)}) */

const properties = require("./json/properties.json");
const users = require("./json/users.json");

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
/* const getUserWithEmail = function (email) {
  let resolvedUser = null;
  for (const userId in users) {
    const user = users[userId];
    if (user.email.toLowerCase() === email.toLowerCase()) {
      resolvedUser = user;
    }
  }
  return Promise.resolve(resolvedUser);
}; */
const getUserWithEmail = (email) => {
  return pool
    .query(`SELECT *
    FROM users
    WHERE email = $1;`, [email])
    .then((result) => {

      // Invalid email
      if(result.rows.length === 0) {
        console.log('invalid query', result.rows);
        return null;
      }

      // email found
      console.log('query', result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
/* const getUserWithId = function (id) {
  return Promise.resolve(users[id]);
}; */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT *
    FROM users
    WHERE id = $1;`, [id])
    .then((result) => {

      // Invalid id
      if(result.rows.length === 0) {
        console.log('invalid query for id', result.rows);
        return null;
      }

      // id found
      console.log('query for id', result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
/* const addUser = function (user) {
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);
}; */
const addUser = function (user) {
  
  return pool
    .query(`INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;`, [user.name, user.email, user.password])
    .then((result) => {
      // Invalid insertion
      if(result.rows.length === 0) {
        console.log('invalid query for insertion', result.rows);
        return null;
      }

      // valid insertion
      console.log('query for insertion', result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
/* const getAllReservations = function (guest_id, limit = 10) {
  return getAllProperties(null, 2);
}; */
const getAllReservations = (guest_id, limit = 10) => {
  return pool
    .query(`SELECT reservations.id, properties.*, start_date, end_date, AVG(rating) AS average_rating
    FROM users
    LEFT JOIN reservations ON users.id = guest_id
    JOIN properties ON properties.id = property_id
    LEFT JOIN property_reviews ON property_reviews.property_id = properties.id
    WHERE users.id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY start_date
    LIMIT $2;`, [guest_id, limit])
    .then((result) => {

      // nvalid/empty query
      if(result.rIows.length === 0) {
        console.log('invalid/empty query', result.rows);
        return null;
      }

      // valid query for all reservations
      console.log('query', result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
