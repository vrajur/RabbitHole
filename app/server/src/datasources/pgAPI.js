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
		this.tableOIDs = {
			Node: null,
			NodeVisits: null
		};
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

	nodeVisitReducer(nodeVisit) {
		return {
			id: nodeVisit.node_visit_id,
			nodeId: nodeVisit.node_id,
			timestamp: nodeVisit.timestamp,
			domCache: nodeVisit.dom_cache,
			pageTextCache: nodeVisit.page_text_cache,
			faviconPath: nodeVisit.favicon_path,
			markups: nodeVisit.markups,
			location: nodeVisit.location,
			actionEvents: nodeVisit.actionEvents
		}
	}

	nodeVisitResultReducer(nodeVisitResult, nodeIdxs, nodeVisitIdxs) {

		const node = {}; 
		const nodeVisit = {};
		const nIdxs = nodeIdxs.map((e) => {return e.idx});
		const nvIdxs = nodeVisitIdxs.map((e) => {return e.idx});

		// Split NodeVisitResults into node and nodeVisit objects:
		for (let ii = 0, numElements = nodeVisitResult.length; ii < numElements; ii++) {
			let nIdx = nIdxs.indexOf(ii);
			let nvIdx = nvIdxs.indexOf(ii);
			if (nIdx >= 0) {
				node[nodeIdxs[nIdx].name] = nodeVisitResult[ii];
			} else if (nvIdx >= 0) {
				nodeVisit[nodeVisitIdxs[nvIdx].name] = nodeVisitResult[ii];
			}
		}

		return {
			node: this.nodeReducer(node),
			nodeVisit: this.nodeVisitReducer(nodeVisit)
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

	async getTableOID(tableName) {
		let res = await this.pool.query(`SELECT oid FROM pg_class WHERE relname = '${tableName}' AND relkind = 'r';`);
		return res.rows.length > 0 ? res.rows[0].oid : null;
	}

	async getAllNodes() {
		const res = await this.pool.query(`SELECT * FROM "public"."Nodes" ORDER BY timestamp ASC`);
		return Array.isArray(res.rows) ? res.rows.map(node => this.nodeReducer(node)) : [];
	}

	async getMostRecentNodes( n ) {
		const res = await this.pool.query(`SELECT * FROM "public"."Nodes" ORDER BY timestamp DESC LIMIT ${n}`);
		return Array.isArray(res.rows) ? res.rows.map((node, idx, array) => this.nodeReducer(array[array.length-1-idx])) : [];
	}

	async getMostRecentNodeVisits( n ) {

		// Get table OIDs for Nodes and NodeVisits table:
		this.tableOIDs.Nodes = this.tableOIDs.Nodes == null ? await this.getTableOID('Nodes') : null;
		this.tableOIDs.NodeVisits = this.tableOIDs.NodeVisits == null ? await this.getTableOID('NodeVisits') : null;

		// Query returning row as array (to avoid column overlap)
		const query = {
			text: `SELECT nv.*, n.* FROM public."NodeVisits" as nv JOIN public."Nodes" AS n ON nv.node_id = n.node_id ORDER BY nv.timestamp DESC LIMIT $1`,
			values: [n],
			rowMode: 'array'
		}
		const res = await this.pool.query(query);
		if ( res.rows.length <= 0 ) { return null; }
		
		// Determine fields belonging to node and nodeVisit
		const nodeIdxs = [];
		const nodeVisitIdxs = [];
		for (let ii = 0; ii < res.fields.length; ii++) {
			let f = res.fields[ii];
			if (f.tableID == this.tableOIDs.Nodes) {
				nodeIdxs.push({idx: ii, name: f.name});
			} else if (f.tableID == this.tableOIDs.NodeVisits) {
				nodeVisitIdxs.push({idx: ii, name: f.name});
			}
 		}

		return res.rows.map((nodeVisitResult) => { return this.nodeVisitResultReducer(nodeVisitResult, nodeIdxs, nodeVisitIdxs) });
	}

	async addNode({ url }) {
		console.log('addNode - url: ', url);
		const res = await this.pool.query(`INSERT INTO "public"."Nodes" (node_id, url, is_starred, visits, timestamp) VALUES (uuid_generate_v4(), '${url}', FALSE, array[]::uuid[], NOW()) RETURNING *`);
		return res.rows.length > 0 ? this.nodeReducer(res.rows[0]) : null;
	} 

	async getOrCreateNode({ url }) {
		// Strip http and https from beginning of url
		const cleanedUrl = url.replace(/^(https:\/\/|http:\/\/)/, '');
		console.log('cleaned url: ', cleanedUrl);
		const res = await this.pool.query(`SELECT * FROM "public"."Nodes" WHERE url ~ '(^|http://|https://)${cleanedUrl}'`);
		console.log('result rowcount: ', res.rowCount);
		return res.rows.length === 0 ? await this.addNode({url: url}) : this.nodeReducer(res.rows[0]); // Add node if no result found, otherwise return result
	}

	async setNodeIsStarredValue({ nodeId, isStarredValue }) {
		const res = await this.pool.query(`UPDATE "public"."Nodes" SET is_starred = $1 WHERE node_id = $2 RETURNING *`, [isStarredValue, nodeId]);
		console.log("setNodeIsStarredValue -  results: ", res.rows[0])
		return res.rows.length > 0 ? this.nodeReducer(res.rows[0]) : null;
	}

	async getLastNodeVisitId({ nodeId }) {
		console.log('getLastNodeVisitId - nodeId: ', nodeId)
		const res = await this.pool.query(`SELECT visits[array_upper(visits, 1)] FROM "public"."Nodes" WHERE node_id = '${nodeId}'`);
		console.log("getLastNodeVisitID - result: ", res.rows[0].visits);
		return res.rows.length > 0 ? res.rows[0].visits : null;
	}

	async getNodeVisit({ nodeVisitId }) {
		const res = await this.pool.query(`SELECT * FROM public."NodeVisits" WHERE node_visit_id = '${nodeVisitId}'`);
		console.log("GetNodeVisit: ", res.rows[0]);
		return res.rows.length === 0 ? null : this.nodeVisitReducer(res.rows[0]);
	}

	async addNodeVisit({ nodeId }) {
		const res = await this.pool.query(`INSERT INTO public."NodeVisits" (node_visit_id, node_id, timestamp) VALUES (uuid_generate_v4(), $1, NOW()) RETURNING *`, [nodeId]);
		console.log("addNodeVisit: ", res.rows[0]);
		return res.rows.length > 0 ? this.nodeVisitReducer(res.rows[0]) : null;
	}

	async addNodeVisitToNode({ nodeId, nodeVisitId }) {
		const res1 = await this.pool.query(`UPDATE public."Nodes" SET visits = array_append(visits, $1	) WHERE node_id = $2 RETURNING *`, [nodeVisitId, nodeId]);
		const res2 = await this.pool.query(`UPDATE public."NodeVisits" SET node_id = $1 WHERE node_visit_id = $2`, [nodeId, nodeVisitId]);
		return res1.rows.length > 0 ? this.nodeReducer(res1.rows[0]) : null;
	}

	async addDomCache({ nodeVisitId, domCache }) {
		const res = await this.pool.query(`UPDATE public."NodeVisits" SET dom_cache = $1 WHERE node_visit_id = $2 RETURNING *`, [domCache, nodeVisitId]);
		return res.rows.length > 0 ? this.nodeVisitReducer(res.rows[0]) : null;
	}

	async addFaviconPath({ nodeVisitId, faviconPath }) {
		const res = await this.pool.query(`UPDATE public."NodeVisits" SET favicon_path = $1 WHERE node_visit_id = $2 RETURNING *`, [faviconPath, nodeVisitId]);
		return res.rows.length > 0 ? this.nodeVisitReducer(res.rows[0]) : null;
	}
}

module.exports = pgAPI;