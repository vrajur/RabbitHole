const { DataSource } = require('apollo-datasource');
const { Pool } = require('pg');

async function testConnection() {

  const pool = new Pool();
  const client = await pool.connect();
  console.log("CONNECTION OPEN");

  const res = await client.query('SELECT * FROM "public"."Nodes"');
  console.log(res.rows[0]);
  
  await client.release();
  console.log("CONNECTION CLOSED");
};

testConnection();



class pgAPI extends DataSource {

	constructor() {
		super();
		this.pool = new Pool();
	}

	nodeReducer(node) {
		return {
			id: node.node_id,
			url: node.url,
			isStarred: node.is_starred,
			visits: node.visits,
			timestamp: node.timestamp
		}
	}

	/**
    * This is a function that gets called by ApolloServer when being setup.
    * This function gets called with the datasource config including things
    * like caches and context. We'll assign this.context to the request context
    * here, so we can know about the user making requests
    */
	initialize(config) {
		this.context = config.context;
	}

	async getAllNodes() {
		const res = await this.pool.query(`SELECT * FROM "public"."Nodes" ORDER BY timestamp ASC`);
		return Array.isArray(res.rows) ? res.rows.map(node => this.nodeReducer(node)) : [];
	}

	async getMostRecentNodes( n ) {
		const res = await this.pool.query(`SELECT * FROM "public"."Nodes" ORDER BY timestamp DESC LIMIT ${n}`);
		return Array.isArray(res.rows) ? res.rows.map((node, idx, array) => this.nodeReducer(array[array.length-1-idx])) : [];
	}

	async addNode({ url }) {
		const res = await this.pool.query(`INSERT INTO "public"."Nodes" (node_id, url, is_starred, visits, timestamp) VALUES (uuid_generate_v4(), '${url}', FALSE, array[]::uuid[], NOW()) RETURNING *`);
		return res.rowCount > 0 ? this.nodeReducer(res.rows[0]) : null;
	} 
}

module.exports = pgAPI;