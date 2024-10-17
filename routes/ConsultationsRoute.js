const express = require('express');
const router = express.Router();
const consultationsController = require('../controllers/consultationsController');
const getAllConsultations = require('../controllers/consultationsController');
const createConsultation = require('../controllers/consultationsController');
const updateConsultation = require('../controllers/consultationsController');
const getUserRole = require('../controllers/consultationsController');

// Rota para obter todas as consultas
router.get('/consultations', consultationsController.getConsultations);

// Rota para criar uma nova consulta
router.post('/consultations', consultationsController.createConsultation);
router.get("/consultations/role", getUserRole);
router.get("/consultations", getAllConsultations);
router.post("/consultations", createConsultation);
router.put("/consultations/:id", updateConsultation);


module.exports = router;