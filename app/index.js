const express = require('express');
const Chance = require('chance');
const { Trino } = require('trino-client');

const app = express();
const port = process.env.PORT || 3000;

const chance = new Chance();

const HOST_TRINO = 'http://localhost:8080';
async function createTrinoClient(catalog, schema) {
  return Trino.create({
    server: HOST_TRINO,
    catalog,
    schema,
    auth: null,
  });
}

async function execQuery(client, sql) {
  const iterator = await client.query(sql);
  const results = [];

  for await (const result of iterator) {
    if (result?.data) results.push(result);
  }

  return results;
}

async function insertLead(client, name) {
  await execQuery(client, `INSERT INTO lead (name) VALUES ('${name}')`);

  const result = await execQuery(client, `
    SELECT id FROM lead WHERE name = '${name}' ORDER BY id DESC LIMIT 1
  `);

  if (!result.length || !result[0].data?.[0]) {
    throw new Error(`Falha ao obter ID do lead (${name})`);
  }

  return result[0].data[0][0];
}

async function insertAttendance(client, name, externalLeadId) {
  const sql = `
    INSERT INTO attendance (name, external_lead_id)
    VALUES ('${name}', ${externalLeadId})
  `;
  await execQuery(client, sql);
}

async function fetchJoinedData(client) {
  const sql = `
    SELECT
      p.id AS p_id,
      p.name AS p_name,
      m.id AS m_id,
      m.name AS m_name,
      m.external_lead_id AS m_external_lead_id
    FROM
      postgresql.public.lead p
    INNER JOIN
      mysql.db_mysql.attendance m
    ON
      p.id = m.external_lead_id
  `;

  const iterator = await client.query(sql);
  const joinedResults = [];

  for await (const queryResult of iterator) {
    if (!queryResult?.data) continue;
    const cols = queryResult.columns.map(c => c.name);
    const rows = queryResult.data.map(row =>
      Object.fromEntries(row.map((val, idx) => [cols[idx], val]))
    );
    joinedResults.push(...rows);
  }

  return joinedResults;
}

// Endpoint: [GET] /generate
app.get('/generate', async (req, res) => {
  const trinoPg = await createTrinoClient('postgresql', 'public');
  const trinoMy = await createTrinoClient('mysql', 'db_mysql');

  try {
    const leads = [];

    // Criar 2 leads
    for (let i = 0; i < 2; i++) {
      const leadName = chance.name();
      const leadId = await insertLead(trinoPg, leadName);
      leads.push({ id: leadId, name: leadName });
    }

    // Criar 3-10 attendances
    const numAttendances = chance.integer({ min: 3, max: 10 });

    for (let i = 0; i < numAttendances; i++) {
      const attendanceName = chance.first();
      const randomLead = chance.pickone(leads);
      await insertAttendance(trinoMy, attendanceName, randomLead.id);
    }

    res.status(201).json({ message: 'Dados gerados com sucesso', leads, attendances: numAttendances });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar dados' });
  }
});

// Endpoint: [GET] /result
app.get('/result', async (req, res) => {
  const trinoPg = await createTrinoClient('postgresql', 'public');

  try {
    const results = await fetchJoinedData(trinoPg);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

app.listen(port, () => {
  console.log(`✅ Servidor Express rodando em http://localhost:${port}`);
  console.log(`📌 Use os seguintes endpoints:`);
  console.log(`➡️  [GET] /generate - Gera leads e attendances`);
  console.log(`    Exemplo: curl http://localhost:${port}/generate`);
  console.log(`➡️  [GET] /result   - Retorna dados combinados entre PostgreSQL e MySQL via Trino`);
  console.log(`    Exemplo: curl http://localhost:${port}/result`);
});
