const db = require('../db/database');

exports.getConsultations = (req, res) => {
  db.all(`SELECT * FROM consultations`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

const createConsultation = (req, res) => {
  const { userId, date, doctor, specialty, status } = req.body;
  db.run(`INSERT INTO consultations (userId, date, doctor, specialty, status) VALUES (?, ?, ?, ?, ?)`,
    [userId, date, doctor, specialty, status],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};


const getUserRole = (req, res) => {
  const { username } = req.body; // Supondo que o username seja enviado no corpo da requisição

  const sql = `SELECT role FROM users WHERE username = ?`;
  db.get(sql, [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log(row);
    if (!row) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json({ role: row.role });
  });
};

const getAllConsultations = (req, res) => {
  const { username } = req.query;
  console.log("Username recebido:", username); // Verifique se o username está correto

  if (!username) {
    return res.status(400).json({ error: "Username não fornecido" });
  }

  let sql;
  let params = [];

  // Buscar o papel do usuário pelo username
  const userRoleSql = `SELECT role, id FROM users WHERE username = ?`;

  db.get(userRoleSql, [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    console.log("Usuário encontrado:", user); // Verifique se o usuário foi encontrado

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const userRole = user.role;
    const userId = user.id; // Usar o userId encontrado para filtrar as consultas no caso de 'user'

    // Definir a query SQL baseada no papel do usuário
    if (userRole === "admin") {
      // Admin pode visualizar todas as consultas
      sql = `SELECT consultations.*, users.username FROM consultations 
             JOIN users ON consultations.userId = users.id`;
    } else {
      // Usuários comuns só podem visualizar suas próprias consultas
      sql = `SELECT consultations.*, users.username FROM consultations 
             JOIN users ON consultations.userId = users.id 
             WHERE consultations.userId = ?`;
      params = [userId];
    }

    // Executar a consulta e retornar os resultados
    db.all(sql, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ consultations: rows });
    });
  });
};


const updateConsultation = (req, res) => {
  const { id } = req.params;
  const { date, doctor, specialty, status, userId } = req.body;

  const sql = `UPDATE consultations SET date = ?, doctor = ?, specialty = ?, status = ?, userId = ? WHERE id = ?`;
  const params = [date, doctor, specialty, status, userId, id];
  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "Consulta atualizada com sucesso." });
  });
};

module.exports = {
  getAllConsultations,
  createConsultation,
  updateConsultation,
  getUserRole,
};