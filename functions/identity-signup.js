/**
 * When a user signs up through Netlify, mirror them to our database
 * In this case FaunaDB
 */

import fetch from 'node-fetch';
import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

exports.handler = async function(event, context) {
  const { identity, user } = context;
  if (!identity || !user) return false;

  try {
    // create user in faunadb
    const response = await fetch('', {
      method: 'POST'
    });
  } catch (error) {}
};
