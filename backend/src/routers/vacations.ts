import { Router } from 'express';
import multer from 'multer';
import getVacations from '../controllers/vacations/get-vacations';
import getVacation from '../controllers/vacations/get-vacation';
import addVacation from '../controllers/vacations/add-vacation';
import updateVacation from '../controllers/vacations/update-vacation';
import deleteVacation from '../controllers/vacations/delete-vacation';
import like from '../controllers/likes/like';
import unlike from '../controllers/likes/unlike';
import validation from '../middlewares/validation';
import { addVacationValidator, updateVacationValidator } from '../validators/vacation.validator';
import { enforceAuth } from '../middlewares/auth';
import { enforceAdmin } from '../middlewares/admin';
import { uploadImage } from '../services/s3';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
        }
    }
});

// GET /api/vacations - Get all vacations (with pagination and filters)
router.get('/', enforceAuth, getVacations);

// GET /api/vacations/:id - Get a single vacation
router.get('/:id', enforceAuth, getVacation);

// POST /api/vacations - Add a new vacation (admin only)
router.post('/', enforceAuth, enforceAdmin, upload.single('image'), async (req: Request, res: Response, next) => {
    try {
        // Handle image upload if file is provided
        if (req.file) {
            const ext = req.file.originalname.split('.').pop();
            const filename = `${uuidv4()}.${ext}`;
            await uploadImage(filename, req.file.buffer, req.file.mimetype);
            req.body.image_filename = filename;
        }
        next();
    } catch (error) {
        return res.status(500).json({
            error: 'Image upload failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}, validation(addVacationValidator), addVacation);

// PUT /api/vacations/:id - Update a vacation (admin only)
router.put('/:id', enforceAuth, enforceAdmin, upload.single('image'), async (req: Request, res: Response, next) => {
    try {
        // Handle image upload if file is provided
        if (req.file) {
            const ext = req.file.originalname.split('.').pop();
            const filename = `${uuidv4()}.${ext}`;
            await uploadImage(filename, req.file.buffer, req.file.mimetype);
            req.body.image_filename = filename;
        }
        next();
    } catch (error) {
        return res.status(500).json({
            error: 'Image upload failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}, validation(updateVacationValidator), updateVacation);

// DELETE /api/vacations/:id - Delete a vacation (admin only)
router.delete('/:id', enforceAuth, enforceAdmin, deleteVacation);

// POST /api/vacations/:id/like - Like a vacation (users only)
router.post('/:id/like', enforceAuth, like);

// DELETE /api/vacations/:id/like - Unlike a vacation (users only)
router.delete('/:id/like', enforceAuth, unlike);

// GET /api/vacations/image/:filename - Get vacation image (proxy from S3)
router.get('/image/:filename', async (req: Request, res: Response) => {
    try {
        const { filename } = req.params;
        const { getImageStream } = await import('../services/s3');
        const { stream, contentType } = await getImageStream(filename);

        res.setHeader('Content-Type', contentType || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
        stream.pipe(res);
    } catch (error) {
        res.status(404).json({
            error: 'Image not found',
            message: 'The requested image could not be found'
        });
    }
});

export default router;
