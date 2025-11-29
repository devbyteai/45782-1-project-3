import { Router } from 'express';
import getStats from '../controllers/reports/get-stats';
import exportCsv from '../controllers/reports/export-csv';
import { enforceAuth } from '../middlewares/auth';
import { enforceAdmin } from '../middlewares/admin';

const router = Router();

// GET /api/reports/stats - Get vacation follower statistics (admin only)
router.get('/stats', enforceAuth, enforceAdmin, getStats);

// GET /api/reports/csv - Export CSV report (admin only)
router.get('/csv', enforceAuth, enforceAdmin, exportCsv);

export default router;
